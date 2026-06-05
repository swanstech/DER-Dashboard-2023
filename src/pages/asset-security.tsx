import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';
import HeaderComponent from 'n/components/Header';
import { IconLogin, IconDownload } from '@tabler/icons-react';

export async function getServerSideProps() {
  return { props: {} };
}

// ============================================================================
// Registry data - currently static, will be replaced with live API calls
// ============================================================================
const LOCAL_NETWORK_DATA = [
  { ip: '192.168.55.191', hostname: 'US-24-250W [Blue Room]', manufacturer: 'US 24 PoE 250W' },
  { ip: '192.168.55.52', hostname: 'US-8-60W [Boys Room]', manufacturer: 'US 8 60W' },
  { ip: '192.168.55.84', hostname: 'USW-Lite-16-PoE [T2]', manufacturer: 'USW Lite 16 PoE' },
  { ip: '192.168.55.233', hostname: 'USW-Lite-16-PoE [Boatshed]', manufacturer: 'USW Lite 16 PoE' },
  { ip: '192.168.55.175', hostname: 'USW-Flex-Mini [Under Office Desk]', manufacturer: 'USW Flex Mini' },
  { ip: '192.168.1.73', hostname: 'UDM-Pro', manufacturer: 'UDM Pro' },
  { ip: '192.168.55.37', hostname: '[Dacha] U6-Lite', manufacturer: 'U6 Lite' },
  { ip: '192.168.55.58', hostname: '[Boys Room] UAP-AC-Lite', manufacturer: 'AC Lite' },
];

const REGISTRY_DATA = [
  { ip: '192.168.11.1', hostname: 'gateway', manufacturer: 'Unknown', type: 'unknown', protocol: 'DNS, HTTP, HTTPS, HTTP-alt, HTTPS-alt', open_ports: '53,80,443,8080,8443', device_id: '', register_count: 0, device_key: '', first_seen: '2026-05-13 10:57:36', last_seen: '2026-05-14 09:07:52', times_seen: 2, last_status: 'online' },
  { ip: '192.168.11.18', hostname: 'ColorController GX', manufacturer: 'Texas Instruments / Victron', type: 'multi_device_monitor', protocol: 'Modbus FC3', open_ports: '22,80,443,502,8000', device_id: '100', register_count: 10, device_key: 'victron_colorcontrol_18', first_seen: '2026-05-11 10:39:13', last_seen: '2026-05-14 09:07:52', times_seen: 5, last_status: 'online' },
  { ip: '192.168.11.81', hostname: 'FoxESS H3-15', manufacturer: 'Espressif Inc.', type: 'inverter', protocol: 'Modbus FC3', open_ports: '443,502', device_id: '247', register_count: 22, device_key: 'foxess_h3_15', first_seen: '2026-05-11 10:39:13', last_seen: '2026-05-14 09:07:52', times_seen: 5, last_status: 'online' },
  { ip: '192.168.11.97', hostname: 'Wallbox Cooper SB', manufacturer: 'Murata Manufacturing', type: 'ev_charger', protocol: 'Modbus FC3', open_ports: '22', device_id: '1', register_count: 0, device_key: 'wallbox_cooper', first_seen: '2026-05-13 10:57:36', last_seen: '2026-05-14 09:07:52', times_seen: 2, last_status: 'online' },
  { ip: '192.168.11.111', hostname: '3931368531', manufacturer: 'SolaX Power', type: 'unknown', protocol: 'HTTP', open_ports: '80', device_id: '', register_count: 0, device_key: '', first_seen: '2026-05-13 10:57:36', last_seen: '2026-05-14 09:07:52', times_seen: 2, last_status: 'online' },
  { ip: '192.168.11.118', hostname: 'Solis 50kW Hybrid', manufacturer: 'Espressif Inc.', type: 'inverter', protocol: 'Modbus FC4', open_ports: '80', device_id: '1', register_count: 8, device_key: 'solis_hybrid_118', first_seen: '2026-05-11 10:39:13', last_seen: '2026-05-14 09:07:52', times_seen: 5, last_status: 'online' },
  { ip: '192.168.11.194', hostname: 'ocpp510', manufacturer: 'Espressif Inc.', type: 'ev_charger', protocol: 'Modbus FC3', open_ports: '22', device_id: '1', register_count: 0, device_key: 'ocpp_charger_194', first_seen: '2026-05-13 10:57:36', last_seen: '2026-05-14 09:07:52', times_seen: 2, last_status: 'online' },
  { ip: '192.168.11.223', hostname: 'SolaX X3-Hybrid-G4', manufacturer: 'SolaX Power', type: 'inverter', protocol: 'Modbus FC3', open_ports: '80', device_id: '1', register_count: 0, device_key: 'solax_x3_223', first_seen: '2026-05-13 10:57:36', last_seen: '2026-05-14 09:07:52', times_seen: 2, last_status: 'online' },
  { ip: '192.168.11.239', hostname: 'espressif', manufacturer: 'Unknown', type: 'inverter', protocol: 'Modbus FC3', open_ports: '80,443,502', device_id: '1', register_count: 15, device_key: 'inverter_239', first_seen: '2026-05-11 10:39:13', last_seen: '2026-05-14 09:07:52', times_seen: 5, last_status: 'online' },
];

const LIVE_READINGS_DATA: Record<string, { description: string; value: number; unit: string }> = {
  '11000': { description: 'Grid Voltage Phase A', value: 240.1, unit: 'V' },
  '11001': { description: 'Grid Current Phase A', value: 8.4, unit: 'A' },
  '11002': { description: 'Active Power', value: 2015.0, unit: 'W' },
  '11003': { description: 'Frequency', value: 49.98, unit: 'Hz' },
  '11004': { description: 'PV1 Voltage', value: 380.5, unit: 'V' },
  '11005': { description: 'PV1 Power', value: 1120.0, unit: 'W' },
  '11006': { description: 'Battery SOC', value: 87.0, unit: '%' },
  '11007': { description: 'Inverter Temperature', value: 41.2, unit: '°C' },
};

const TYPE_COLORS: Record<string, string> = {
  inverter: '#2E75B6',
  ev_charger: '#b06ec9',
  multi_device_monitor: '#c97a4e',
  inverter_dongle: '#4e6ec9',
  unknown: '#9aa0a6',
};

const DERAssetReader: React.FC = () => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);
  const [keycloakInstance, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);

  const [activeTab, setActiveTab] = useState<'local' | 'custom' | 'registry'>('registry');
  const [modalDevice, setModalDevice] = useState<{ name: string; ip: string; key: string } | null>(null);

  let lastUserActivityTimestamp = Date.now();
  const updateUserActivityTimestamp = () => { lastUserActivityTimestamp = Date.now(); };

  useEffect(() => {
    document.addEventListener('mousemove', updateUserActivityTimestamp);
    document.addEventListener('keydown', updateUserActivityTimestamp);

    const initializeKeycloak = async () => {
      try {
        const keycloak = initKeycloak();
        if (!keycloak) { console.error('Keycloak object is null'); return; }
        await keycloak.init({ onLoad: 'check-sso' });
        if (!keycloak.authenticated) {
          keycloak.login({ redirectUri: window.location.origin + router.pathname });
        } else {
          const roles = keycloak.tokenParsed?.realm_access?.roles || [];
          setUserRoles(roles);
          setKeycloak(keycloak);
          const fullName = keycloak.tokenParsed?.name || '';
          const email = keycloak.tokenParsed?.email || '';
          setUserProfile({ fullName, email });
          if (roles.includes('Engineer') || roles.includes('General Manager') || roles.includes('Auditor') || roles.includes('Security Admin')) {
            setIsAuth(true);
          }
        }
      } catch (error) {
        console.error('Keycloak initialization error:', error);
      }
    };
    initializeKeycloak();

    return () => {
      document.removeEventListener('mousemove', updateUserActivityTimestamp);
      document.removeEventListener('keydown', updateUserActivityTimestamp);
    };
  }, []);

  if (!isAuth) {
    return (
      <>
        <div className="page-layout">
          <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />
          <div className="auth-error-message">
            <p>You are not authenticated.</p>
            <p>You do not have the required role to access this page.</p>
            <p>Pls Login with the correct role by clicking on the <IconLogin size={45} /> icon at the right hand side of the Header.</p>
          </div>
        </div>
        <style jsx>{`
          .page-layout { display: flex; flex-direction: column; justify-content: space-between; height: 50vh; padding: 8px; box-sizing: border-box; }
          .auth-error-message { text-align: center; margin: auto; max-width: 400px; padding: 30px; border: 1px solid #ddd; border-radius: 8px; background-color: #f8d7da; color: #721c24; }
        `}</style>
      </>
    );
  }

  // Helper: trigger a file download in the browser
  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper: convert array of objects to CSV
  const toCsv = (rows: any[]) => {
    if (rows.length === 0) return '';
    const cols = Object.keys(rows[0]);
    const escape = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [cols.join(','), ...rows.map(r => cols.map(c => escape(r[c])).join(','))].join('\n');
  };

  return (
    <div className="page-layout">
      <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />

      <div className="reader-container">
        <div className="reader-header">
          <img src="/images/SwansForesight.jpg" alt="Swan Foresight" className="reader-logo" />
          <h1 className="reader-title">DER Data Reader</h1>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'local' ? 'active' : ''}`} onClick={() => setActiveTab('local')}>Local Network</button>
          <button className={`tab ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Custom Scan</button>
          <button className={`tab ${activeTab === 'registry' ? 'active' : ''}`} onClick={() => setActiveTab('registry')}>Asset Registry</button>
        </div>

        {/* LOCAL NETWORK TAB */}
        {activeTab === 'local' && (
          <div className="tab-panel">
            <table className="data-table">
              <thead><tr><th>IP Address</th><th>Hostname</th><th>Manufacturer</th></tr></thead>
              <tbody>
                {LOCAL_NETWORK_DATA.map((d) => (
                  <tr key={d.ip}>
                    <td className="mono accent">{d.ip}</td>
                    <td>{d.hostname}</td>
                    <td className="dim">{d.manufacturer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="status-bar success">Loaded {LOCAL_NETWORK_DATA.length} device(s) from UniFi.</div>
          </div>
        )}

        {/* CUSTOM TAB */}
        {activeTab === 'custom' && (
          <div className="tab-panel">
            <table className="data-table">
              <thead>
                <tr><th>IP</th><th>Hostname</th><th>Manufacturer</th><th>Type</th><th>Protocol</th><th>Open Ports</th><th style={{ textAlign: 'right' }}>ID</th><th style={{ textAlign: 'right' }}>Regs</th></tr>
              </thead>
              <tbody>
                {REGISTRY_DATA.map((d) => {
                  const liveCapable = d.register_count > 0;
                  return (
                    <tr key={d.ip} className={liveCapable ? 'clickable' : ''} onClick={() => liveCapable && setModalDevice({ name: d.hostname, ip: d.ip, key: d.device_key })}>
                      <td className="mono accent">{d.ip}</td>
                      <td>{d.hostname}{liveCapable ? <span className="badge">LIVE</span> : <span className="badge muted">no map</span>}</td>
                      <td className="dim">{d.manufacturer}</td>
                      <td><span className="pill" style={{ background: TYPE_COLORS[d.type] || TYPE_COLORS.unknown }}>{d.type}</span></td>
                      <td className="dim">{d.protocol}</td>
                      <td className="mono dim">{d.open_ports}</td>
                      <td className="mono" style={{ textAlign: 'right' }}>{d.device_id || '—'}</td>
                      <td className="mono" style={{ textAlign: 'right' }}>{d.register_count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="status-bar">Found {REGISTRY_DATA.length} device(s). Click a LIVE row for real-time Modbus readings.</div>
          </div>
        )}

        {/* ASSET REGISTRY TAB */}
        {activeTab === 'registry' && (
          <div className="tab-panel">
            <div className="toolbar">
              <button
                className="btn btn-download"
                onClick={() => downloadFile('asset_registry.csv', toCsv(REGISTRY_DATA), 'text/csv')}
              >
                <IconDownload size={16} stroke={2.5} />
                <span>Download CSV</span>
              </button>
              <button
                className="btn btn-download"
                style={{ marginLeft: 8 }}
                onClick={() => downloadFile('asset_registry.json', JSON.stringify(REGISTRY_DATA, null, 2), 'application/json')}
              >
                <IconDownload size={16} stroke={2.5} />
                <span>Download JSON</span>
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>IP</th><th>Hostname</th><th>Type</th><th>Protocol</th><th>Open Ports</th><th>Status</th><th>First Seen</th><th>Last Seen</th><th style={{ textAlign: 'right' }}>Seen #</th>
                </tr>
              </thead>
              <tbody>
                {REGISTRY_DATA.map((d) => (
                  <tr key={d.ip}>
                    <td className="mono accent">{d.ip}</td>
                    <td>{d.hostname}</td>
                    <td><span className="pill" style={{ background: TYPE_COLORS[d.type] || TYPE_COLORS.unknown }}>{d.type}</span></td>
                    <td className="dim">{d.protocol}</td>
                    <td className="mono dim">{d.open_ports}</td>
                    <td><span className={`badge ${d.last_status === 'online' ? '' : 'muted'}`}>{d.last_status}</span></td>
                    <td className="mono dim">{d.first_seen}</td>
                    <td className="mono dim">{d.last_seen}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{d.times_seen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="status-bar success">
              {REGISTRY_DATA.length} device(s) recorded — {REGISTRY_DATA.filter((d) => d.last_status === 'online').length} online.
            </div>
          </div>
        )}
      </div>

      {/* LIVE MODBUS MODAL */}
      {modalDevice && (
        <div className="modal-backdrop" onClick={(e) => { if ((e.target as HTMLElement).className === 'modal-backdrop') setModalDevice(null); }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">{modalDevice.name} — live Modbus</div>
                <div className="modal-subtitle">{modalDevice.ip} · {modalDevice.key}</div>
              </div>
              <button className="modal-close" onClick={() => setModalDevice(null)}>×</button>
            </div>
            <div className="modal-body">
              <table className="readings-table">
                <thead><tr><th style={{ width: 80 }}>Reg</th><th>Description</th><th style={{ textAlign: 'right' }}>Value</th><th>Unit</th></tr></thead>
                <tbody>
                  {Object.entries(LIVE_READINGS_DATA).map(([addr, r]) => (
                    <tr key={addr}>
                      <td className="mono accent">{addr}</td>
                      <td>{r.description}</td>
                      <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>{r.value}</td>
                      <td className="dim">{r.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <span><span className="live-dot" />Polling Modbus every 2s</span>
            </div>
          </div>
        </div>
      )}

      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px" alt="Swanforesight Logo" /></p>
      </div>

      <style jsx>{`
        .page-layout { display: flex; flex-direction: column; min-height: 100vh; padding: 8px; box-sizing: border-box; }
        .reader-container { max-width: 1200px; margin: 24px auto; width: 100%; padding: 0 16px; }
        .reader-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .reader-logo { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; }
        .reader-title { font-size: 32px; font-weight: 700; color: #2c3e50; margin: 0; letter-spacing: -0.5px; }

        .tabs { display: flex; gap: 4px; border-bottom: 2px solid #e3e7eb; }
        .tab { background: #f4f6f8; color: #6b7785; border: none; padding: 12px 24px; cursor: pointer; font-size: 14px; border-radius: 6px 6px 0 0; font-weight: 500; transition: all 0.15s; }
        .tab:hover { background: #e9edf1; color: #2c3e50; }
        .tab.active { background: #2E75B6; color: #fff; font-weight: 600; }

        .tab-panel { padding-top: 20px; }
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: 12px; }
        .btn { background: #2E75B6; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
        .btn:hover { background: #3a85c9; }
        .btn-download { display: inline-flex; align-items: center; gap: 6px; line-height: 1; }
        .btn-download span { line-height: 1; }

        .data-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .data-table thead { background: #2E75B6; }
        .data-table thead th { padding: 12px 14px; text-align: left; font-weight: 600; color: #fff; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .data-table tbody tr { border-bottom: 1px solid #eef1f4; transition: background 0.12s; }
        .data-table tbody tr:nth-child(even) { background: #f9fafb; }
        .data-table tbody tr:hover { background: #eef4fa; }
        .data-table tbody tr.clickable { cursor: pointer; }
        .data-table tbody td { padding: 11px 14px; font-size: 13px; color: #2c3e50; }
        .mono { font-family: "Courier New", monospace; }
        .accent { color: #1a8a6e; }
        .dim { color: #8a929b; }

        .pill { display: inline-block; padding: 2px 9px; border-radius: 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #fff; letter-spacing: 0.3px; }
        .badge { display: inline-block; margin-left: 8px; padding: 2px 8px; font-size: 10px; border-radius: 10px; background: #1a8a6e; color: #fff; font-weight: 600; }
        .badge.muted { background: #c2c8cf; color: #fff; }

        .status-bar { margin-top: 16px; padding: 12px 16px; background: #f4f6f8; border-radius: 4px; font-size: 13px; color: #6b7785; }
        .status-bar.success { color: #1a8a6e; background: #eafaf4; }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; padding: 24px; }
        .modal { background: #fff; border-radius: 8px; max-width: 700px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid #e3e7eb; }
        .modal-title { font-size: 17px; font-weight: 600; color: #2c3e50; }
        .modal-subtitle { font-size: 12px; color: #8a929b; margin-top: 4px; font-family: "Courier New", monospace; }
        .modal-close { background: transparent; border: none; color: #8a929b; font-size: 26px; cursor: pointer; line-height: 1; }
        .modal-close:hover { color: #2c3e50; }
        .modal-body { padding: 0; overflow-y: auto; flex: 1; }
        .readings-table { width: 100%; border-collapse: collapse; }
        .readings-table thead th { padding: 10px 18px; text-align: left; font-size: 11px; color: #8a929b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e3e7eb; }
        .readings-table td { padding: 9px 18px; font-size: 13px; border-bottom: 1px solid #f0f2f4; color: #2c3e50; }
        .readings-table tbody tr:nth-child(even) { background: #f9fafb; }
        .modal-footer { padding: 12px 24px; border-top: 1px solid #e3e7eb; font-size: 12px; color: #8a929b; }
        .live-dot { display: inline-block; width: 8px; height: 8px; background: #1a8a6e; border-radius: 50%; margin-right: 6px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        .footer { text-align: center; padding: 16px; background-color: #f5f5f5; margin-top: auto; }
      `}</style>
    </div>
  );
};

export default DERAssetReader;