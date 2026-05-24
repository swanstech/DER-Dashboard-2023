// Canonical fleet — every device the lab is provisioned to talk to, even ones
// that are currently silent. Seeded into the dashboard so the operator can
// see the full estate (not just whoever happened to report telemetry) and so
// each silent device carries a specific reason rather than a generic
// "no data" placeholder.
//
// Keep this list in lockstep with scripts/devices.yaml in der-dashboard-
// infrastructure. When a device is added or removed there, mirror the change
// here and update the `knownIssue` text from the probe-devices.sh output.

export interface FleetEntry {
  device_id: string;
  manufacturer: string;
  device_type: string;
  protocol: string;
  device_host: string;
  // If the device is intentionally offline or needs physical/firmware
  // intervention before it can stream telemetry, describe that here.
  // Surfaced verbatim when status is offline/unknown so the operator
  // sees the actual cause rather than a generic "no telemetry" line.
  knownIssue?: string;
}

export const KNOWN_FLEET: readonly FleetEntry[] = [
  {
    device_id: 'foxess-h3-15-01',
    manufacturer: 'FoxESS',
    device_type: 'inverter',
    protocol: 'Modbus FC3',
    device_host: '192.168.11.81',
    knownIssue:
      'Port 502 accepts TCP but the inverter is silent on every unit ID. ' +
      'Modbus TCP needs to be re-enabled in the FoxESS installer menu.',
  },
  {
    device_id: 'solis-50k-01',
    manufacturer: 'Solis',
    device_type: 'inverter',
    protocol: 'Modbus FC4',
    device_host: '192.168.11.118',
  },
  {
    device_id: 'victron-ccgx-01',
    manufacturer: 'Victron',
    device_type: 'multi_device_monitor',
    protocol: 'Modbus FC3',
    device_host: '192.168.11.18',
  },
  {
    device_id: 'solax-x3-hybrid-g4-01',
    manufacturer: 'SolaX',
    device_type: 'inverter',
    protocol: 'Modbus FC3',
    device_host: '192.168.11.223',
    knownIssue:
      'Port 502 is closed — only the web UI on port 80 responds (HTTP 401). ' +
      'Modbus TCP must be enabled in the SolaX Cloud installer settings.',
  },
  {
    device_id: 'espressif-inverter-01',
    manufacturer: 'Unknown',
    device_type: 'inverter',
    protocol: 'Modbus FC3',
    device_host: '192.168.11.239',
    knownIssue:
      'Modbus TCP responds on unit_id 247, but the telemetry register map ' +
      'is not yet known. Awaiting register survey before enabling polling.',
  },
  {
    device_id: 'wallbox-cooper-sb-01',
    manufacturer: 'Wallbox',
    device_type: 'ev_charger',
    protocol: 'Modbus FC3',
    device_host: '192.168.11.97',
    knownIssue:
      'Port 502 is closed — only SSH on port 22 is reachable. Modbus TCP ' +
      'must be enabled in the myWallbox app (Installer → Configuration).',
  },
  {
    device_id: 'ocpp510-01',
    manufacturer: 'Espressif',
    device_type: 'ev_charger',
    protocol: 'Modbus FC3',
    device_host: '192.168.11.194',
    knownIssue:
      'Device is fully unreachable — both port 22 and 502 are closed. ' +
      'Likely powered down, removed from the network, or IP changed.',
  },
  {
    device_id: 'solax-http-01',
    manufacturer: 'SolaX',
    device_type: 'inverter',
    protocol: 'HTTP',
    device_host: '192.168.11.111',
    knownIssue:
      'Local HTTP API returns 401 Unauthorized. SolaX dataloggers need the ' +
      'inverter serial number in the request body before they reply.',
  },
];

export const FLEET_BY_ID: Readonly<Record<string, FleetEntry>> =
  Object.freeze(
    Object.fromEntries(KNOWN_FLEET.map(e => [e.device_id, e])),
  );
