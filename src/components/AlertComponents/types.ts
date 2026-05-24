// Shared types for the DER Alerts dashboard. Kept in one place so the page,
// fleet panel, audit log and helpers all agree on the wire shape served by
// /api/deralerts.

export type AlertType = 'anomaly' | 'config_change';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface DERAlert {
  alert_type: AlertType;
  event_type?: string;
  device_id?: string;
  device_host?: string;
  manufacturer?: string;
  device_type?: string;
  protocol?: string;
  timestamp: string;
  message: string;
  field?: string;
  label?: string;
  value?: number;
  threshold?: { min: number; max: number };
  // config_change-specific — present when alert_type === 'config_change'
  checksum?: string;
  old_checksum?: string;
  config?: Record<string, number | string>;
}

export interface DERTelemetry {
  device_id?: string;
  device_host?: string;
  manufacturer?: string;
  device_type?: string;
  protocol?: string;
  timestamp?: string;
  grid_voltage_v?: number;
  grid_voltage_2_v?: number;
  ac_voltage_v?: number;
  frequency_hz?: number;
  battery_soc_pct?: number;
  battery_voltage_v?: number;
  battery_current_a?: number;
  dc_bus_v?: number;
  ac_power_w?: number;
  temperature_c?: number;
}

export interface AlertApiResponse {
  alerts: DERAlert[];
  telemetry: DERTelemetry[];
}

export type DeviceStatus = 'online' | 'stale' | 'offline' | 'unknown';

export interface DeviceSummary {
  device_id: string;
  manufacturer?: string;
  device_type?: string;
  protocol?: string;
  device_host?: string;
  lastTelemetry: DERTelemetry | null;
  lastSeenIso: string | null;
  status: DeviceStatus;
  statusReason: string;
  // Known device-side issue from the canonical fleet definition — e.g.
  // "Modbus TCP needs to be re-enabled at the inverter". Set only when the
  // device is in the canonical fleet AND fleet.ts has documented the cause.
  knownIssue?: string;
  // True when this device exists in the canonical fleet but no telemetry
  // or alerts have ever been observed in the current data window.
  awaitingFirstContact: boolean;
  anomaliesLast24h: number;
  tamperLast24h: number;
}
