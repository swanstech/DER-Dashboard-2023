import { KNOWN_FLEET } from './fleet';
import type {
  DERAlert,
  DERTelemetry,
  DeviceStatus,
  DeviceSummary,
  Severity,
} from './types';

// A device is considered online if we've seen telemetry within
// ONLINE_WINDOW_MS, stale if within STALE_WINDOW_MS, otherwise offline.
// These windows are tuned to the poller's default 10s poll interval —
// three missed cycles tips us into "stale", thirty into "offline".
export const ONLINE_WINDOW_MS = 30_000;       // 30 s
export const STALE_WINDOW_MS = 5 * 60_000;    // 5 min
export const DAY_MS = 24 * 60 * 60_000;

export function safeDate(ts: string | undefined | null): Date | null {
  if (!ts) return null;
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatTime(ts: string | undefined | null): string {
  const d = safeDate(ts);
  if (!d) return '—';
  return d.toLocaleString('en-AU', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
}

export function relativeTime(ts: string | Date | undefined | null): string {
  if (!ts) return '—';
  const d = typeof ts === 'string' ? safeDate(ts) : ts;
  if (!d) return '—';
  const diff = Date.now() - d.getTime();
  if (diff < 0) return 'in the future';
  const secs = Math.floor(diff / 1000);
  if (secs < 5)     return 'just now';
  if (secs < 60)    return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60)    return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)     return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)    return `${days}d ago`;
  return d.toLocaleDateString('en-AU');
}

// Severity rules:
//  - config_change is always CRITICAL — a write to inverter settings is the
//    SIEM equivalent of a privileged config change and warrants investigation.
//  - anomalies are graded by how far the value sits outside the safe band.
export function severityFor(alert: DERAlert): Severity {
  if (alert.alert_type === 'config_change') return 'critical';

  const v = alert.value;
  const bounds = alert.threshold;
  if (v == null || !bounds) return 'medium';

  const span = bounds.max - bounds.min;
  if (span <= 0) return 'medium';

  // Distance outside the band, as a fraction of the band width.
  const overshoot =
    v > bounds.max ? (v - bounds.max) / span :
    v < bounds.min ? (bounds.min - v) / span :
    0;

  if (overshoot >= 0.25) return 'high';
  if (overshoot >= 0.05) return 'medium';
  return 'low';
}

export const SEVERITY_COLOR: Record<Severity, string> = {
  critical: 'red',
  high:     'red',
  medium:   'orange',
  low:      'yellow',
  info:     'gray',
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'CRITICAL',
  high:     'HIGH',
  medium:   'MEDIUM',
  low:      'LOW',
  info:     'INFO',
};

export function isWithin24h(ts: string | undefined | null): boolean {
  const d = safeDate(ts);
  return d ? Date.now() - d.getTime() < DAY_MS : false;
}

// Build the per-device view: takes the raw arrays from the API and rolls them
// up into a tidy list keyed by device_id. Devices that have appeared in any
// alert OR any telemetry record are included — so a device that's currently
// down still shows up (with status = offline) instead of vanishing.
export function summariseDevices(
  alerts: DERAlert[],
  telemetry: DERTelemetry[],
): DeviceSummary[] {
  const byId = new Map<string, DeviceSummary>();

  const newSummary = (id: string): DeviceSummary => ({
    device_id: id,
    manufacturer: undefined,
    device_type: undefined,
    protocol: undefined,
    device_host: undefined,
    lastTelemetry: null,
    lastSeenIso: null,
    status: 'unknown',
    statusReason: 'No telemetry observed yet.',
    knownIssue: undefined,
    awaitingFirstContact: true,
    anomaliesLast24h: 0,
    tamperLast24h: 0,
  });

  const ensure = (id: string): DeviceSummary => {
    let entry = byId.get(id);
    if (!entry) {
      entry = newSummary(id);
      byId.set(id, entry);
    }
    return entry;
  };

  // Seed from the canonical fleet so devices that have never reported still
  // appear in the panel. Carries through manufacturer/host/protocol metadata
  // and any documented known issue (Modbus disabled, IP changed, etc.).
  for (const fleet of KNOWN_FLEET) {
    const entry = ensure(fleet.device_id);
    entry.manufacturer = fleet.manufacturer;
    entry.device_type  = fleet.device_type;
    entry.protocol     = fleet.protocol;
    entry.device_host  = fleet.device_host;
    entry.knownIssue   = fleet.knownIssue;
  }

  // Telemetry overlays the seed — the freshest reading wins, and an
  // observation means this device has been contacted at least once.
  for (const t of telemetry) {
    if (!t.device_id) continue;
    const entry = ensure(t.device_id);
    entry.manufacturer ??= t.manufacturer;
    entry.device_type  ??= t.device_type;
    entry.protocol     ??= t.protocol;
    entry.device_host  ??= t.device_host;

    const tsMs = safeDate(t.timestamp)?.getTime() ?? -Infinity;
    const prevMs = safeDate(entry.lastSeenIso ?? undefined)?.getTime() ?? -Infinity;
    if (tsMs > prevMs) {
      entry.lastTelemetry = t;
      entry.lastSeenIso = t.timestamp ?? null;
    }
    entry.awaitingFirstContact = false;
  }

  // Alerts — backfill metadata if the seed was missing and count 24-hour
  // anomaly/tamper totals per device.
  for (const a of alerts) {
    if (!a.device_id) continue;
    const entry = ensure(a.device_id);
    entry.manufacturer ??= a.manufacturer;
    entry.device_type  ??= a.device_type;
    entry.protocol     ??= a.protocol;
    entry.device_host  ??= a.device_host;
    entry.awaitingFirstContact = false;

    if (isWithin24h(a.timestamp)) {
      if (a.alert_type === 'anomaly')       entry.anomaliesLast24h += 1;
      if (a.alert_type === 'config_change') entry.tamperLast24h += 1;
    }
  }

  // Compute final status + a human-readable reason.
  const now = Date.now();
  for (const entry of byId.values()) {
    const lastMs = safeDate(entry.lastSeenIso)?.getTime() ?? null;
    if (lastMs == null) {
      // No telemetry ever — if we know exactly why, say so; otherwise just
      // report that we're waiting for the first reading.
      entry.status = entry.knownIssue ? 'offline' : 'unknown';
      entry.statusReason = entry.knownIssue
        ?? 'No telemetry received yet — awaiting first contact from this device.';
      continue;
    }
    const age = now - lastMs;
    if (age <= ONLINE_WINDOW_MS) {
      entry.status = 'online';
      entry.statusReason = `Last telemetry ${Math.round(age / 1000)}s ago.`;
    } else if (age <= STALE_WINDOW_MS) {
      entry.status = 'stale';
      entry.statusReason =
        `No update for ${Math.round(age / 1000)}s — device may be slow ` +
        `to respond or the poll cycle has been missed.`;
    } else {
      entry.status = 'offline';
      const mins = Math.floor(age / 60_000);
      entry.statusReason = entry.knownIssue
        ?? `No telemetry received for ${mins} minute${mins === 1 ? '' : 's'} — ` +
           `device may be unreachable, powered down, or have Modbus/HTTP disabled.`;
    }
  }

  // Sort: offline + unknown first (these need attention), then by id.
  const order: Record<DeviceStatus, number> = {
    offline: 0, unknown: 1, stale: 2, online: 3,
  };
  return Array.from(byId.values()).sort((a, b) => {
    const s = order[a.status] - order[b.status];
    return s !== 0 ? s : a.device_id.localeCompare(b.device_id);
  });
}

export const STATUS_COLOR: Record<DeviceStatus, string> = {
  online:  'green',
  stale:   'yellow',
  offline: 'red',
  unknown: 'gray',
};

export const STATUS_LABEL: Record<DeviceStatus, string> = {
  online:  'Online',
  stale:   'Stale',
  offline: 'Offline',
  unknown: 'Unknown',
};
