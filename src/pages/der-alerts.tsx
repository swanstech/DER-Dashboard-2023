import React, { useEffect, useState, useCallback } from 'react';
import {
  Badge,
  Card,
  Group,
  Loader,
  SimpleGrid,
  Table,
  Text,
  Title,
  ThemeIcon,
  Stack,
  Box,
  ActionIcon,
  Tooltip,
  Paper,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconSettings,
  IconActivity,
  IconRefresh,
  IconClock,
  IconBolt,
  IconTemperature,
  IconBattery,
  IconWifi,
} from '@tabler/icons-react';

// Types
interface DERAlert {
  alert_type: 'anomaly' | 'config_change';
  event_type?: string;
  device_id?: string;
  timestamp: string;
  message: string;
  field?: string;
  value?: number;
  threshold?: { min: number; max: number };
  checksum?: string;
  old_checksum?: string;
}

interface DERTelemetry {
  device_id?: string;
  timestamp?: string;
  grid_voltage_v?: number;
  frequency_hz?: number;
  battery_soc_pct?: number;
  ac_power_w?: number;
  temperature_c?: number;
  battery_voltage_v?: number;
}

interface AlertData {
  alerts: DERAlert[];
  telemetry: DERTelemetry[];
}

// Helpers
function formatTime(ts: string) {
  try {
    return new Date(ts).toLocaleString('en-AU', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  } catch { return ts; }
}

function relativeTime(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const FIELD_ICONS: Record<string, React.ReactNode> = {
  grid_voltage_v:    <IconBolt size={14} />,
  frequency_hz:      <IconWifi size={14} />,
  temperature_c:     <IconTemperature size={14} />,
  battery_soc_pct:   <IconBattery size={14} />,
  battery_voltage_v: <IconBattery size={14} />,
  ac_power_w:        <IconActivity size={14} />,
};

// Stat card
function StatCard({
  label, value, unit, color, icon, sub,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <Paper radius="md" p="md" withBorder style={{ borderLeft: `3px solid var(--mantine-color-${color}-6, #228be6)` }}>
      <Group position="apart" mb={4}>
        <Text size="xs" color="dimmed" weight={600} transform="uppercase" style={{ letterSpacing: '0.04em' }}>
          {label}
        </Text>
        <ThemeIcon color={color} variant="light" size="sm" radius="sm">
          {icon}
        </ThemeIcon>
      </Group>
      <Group align="baseline" spacing={4}>
        <Text size="xl" weight={700} style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</Text>
        {unit && <Text size="xs" color="dimmed">{unit}</Text>}
      </Group>
      {sub && <Text size="xs" color="dimmed" mt={2}>{sub}</Text>}
    </Paper>
  );
}

// Main page
export default function DERAlerts() {
  const [data, setData] = useState<AlertData>({ alerts: [], telemetry: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/deralerts');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: AlertData = await res.json();
      setData(json);
      setLastFetch(new Date());
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load and auto-refresh every 30 s
  useEffect(() => {
    fetchData();
    const id = setInterval(() => fetchData(true), 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  // Derived metrics
  const anomalies    = data.alerts.filter(a => a.alert_type === 'anomaly');
  const configChanges = data.alerts.filter(a => a.alert_type === 'config_change');
  const latest       = data.telemetry[0] ?? null;

  // Last 24 h
  const cutoff = Date.now() - 86_400_000;
  const last24h = data.alerts.filter(a => new Date(a.timestamp).getTime() > cutoff);

  // Render
  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Stack align="center" spacing="xs">
          <Loader size="md" />
          <Text size="sm" color="dimmed">Loading alerts…</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box p="md">
      {/* Header */}
      <Group position="apart" mb="lg" align="flex-end">
        <div>
          <Title order={2} weight={700}>DER Alert Monitor</Title>
          <Text size="sm" color="dimmed" mt={2}>
            FoxESS H3-15 · Swan Foresight Smart Energy Lab
          </Text>
        </div>
        <Group spacing="xs">
          {lastFetch && (
            <Group spacing={4}>
              <IconClock size={13} color="gray" />
              <Text size="xs" color="dimmed">
                Updated {relativeTime(lastFetch.toISOString())}
              </Text>
            </Group>
          )}
          <Tooltip label="Refresh now">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => fetchData(true)}
              loading={refreshing}
              radius="md"
            >
              <IconRefresh size={15} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {error && (
        <Paper p="sm" mb="md" withBorder radius="md"
          style={{ borderLeft: '3px solid #fa5252', background: '#fff5f5' }}>
          <Group spacing="xs">
            <IconAlertTriangle size={15} color="#fa5252" />
            <Text size="sm" color="red">{error}</Text>
          </Group>
        </Paper>
      )}

      {/* Stat cards */}
      <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'xs', cols: 1 }]} mb="lg">
        <StatCard
          label="Anomalies (24 h)"
          value={last24h.filter(a => a.alert_type === 'anomaly').length}
          color="red"
          icon={<IconAlertTriangle size={14} />}
          sub={`${anomalies.length} total`}
        />
        <StatCard
          label="Config changes (24 h)"
          value={last24h.filter(a => a.alert_type === 'config_change').length}
          color="orange"
          icon={<IconSettings size={14} />}
          sub={`${configChanges.length} total`}
        />
        <StatCard
          label="Battery SoC"
          value={latest?.battery_soc_pct != null ? Math.round(latest.battery_soc_pct) : '—'}
          unit="%"
          color={
            latest?.battery_soc_pct != null
              ? latest.battery_soc_pct < 10 ? 'red'
              : latest.battery_soc_pct < 30 ? 'orange'
              : 'green'
              : 'gray'
          }
          icon={<IconBattery size={14} />}
          sub={latest?.timestamp ? `as of ${relativeTime(latest.timestamp)}` : 'no data'}
        />
        <StatCard
          label="Grid voltage"
          value={latest?.grid_voltage_v != null ? latest.grid_voltage_v.toFixed(1) : '—'}
          unit="V"
          color={
            latest?.grid_voltage_v != null
              ? (latest.grid_voltage_v < 210 || latest.grid_voltage_v > 260) ? 'red' : 'green'
              : 'gray'
          }
          icon={<IconBolt size={14} />}
          sub="Safe: 210–260 V"
        />
      </SimpleGrid>

      {/* Live telemetry strip */}
      {latest && (
        <Paper radius="md" p="sm" withBorder mb="lg">
          <Group spacing="xl">
            <Text size="xs" color="dimmed" weight={600} transform="uppercase" style={{ letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              Latest reading
            </Text>
            {[
              { label: 'Freq', value: latest.frequency_hz?.toFixed(2), unit: 'Hz', safe: latest.frequency_hz != null && latest.frequency_hz >= 49 && latest.frequency_hz <= 51 },
              { label: 'AC power', value: latest.ac_power_w != null ? (latest.ac_power_w / 1000).toFixed(2) : null, unit: 'kW' },
              { label: 'Temperature', value: latest.temperature_c?.toFixed(1), unit: '°C', safe: latest.temperature_c != null && latest.temperature_c <= 75 },
              { label: 'Batt voltage', value: latest.battery_voltage_v?.toFixed(1), unit: 'V', safe: latest.battery_voltage_v != null && latest.battery_voltage_v >= 40 && latest.battery_voltage_v <= 60 },
            ].map(({ label, value, unit, safe }) => value != null && (
              <Group key={label} spacing={4}>
                <Text size="xs" color="dimmed">{label}</Text>
                <Text size="sm" weight={600} color={safe === false ? 'red' : undefined}>
                  {value} <Text span size="xs" color="dimmed">{unit}</Text>
                </Text>
              </Group>
            ))}
          </Group>
        </Paper>
      )}

      {/* Alerts table */}
      <Card radius="md" withBorder p={0}>
        <Box px="md" py="sm" style={{ borderBottom: '1px solid #e9ecef' }}>
          <Group position="apart">
            <Text weight={600} size="sm">Alert history</Text>
            <Badge color="gray" variant="light" size="sm">
              {data.alerts.length} total
            </Badge>
          </Group>
        </Box>

        {data.alerts.length === 0 ? (
          <Box py="xl" style={{ textAlign: 'center' }}>
            <Text size="sm" color="dimmed">No alerts recorded yet.</Text>
          </Box>
        ) : (
          <Box style={{ overflowX: 'auto' }}>
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              fontSize="sm"
              striped
              highlightOnHover
            >
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 12, color: '#868e96' }}>TYPE</th>
                  <th style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 12, color: '#868e96' }}>SENSOR / EVENT</th>
                  <th style={{ fontWeight: 600, fontSize: 12, color: '#868e96' }}>MESSAGE</th>
                  <th style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 12, color: '#868e96' }}>VALUE</th>
                  <th style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 12, color: '#868e96' }}>TIME</th>
                </tr>
              </thead>
              <tbody>
                {[...data.alerts]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 100)
                  .map((alert, i) => (
                    <tr key={i}>
                      <td>
                        <Badge
                          size="sm"
                          radius="sm"
                          color={alert.alert_type === 'anomaly' ? 'red' : 'orange'}
                          variant="light"
                        >
                          {alert.alert_type === 'anomaly' ? '⚠ Anomaly' : '⚙ Config'}
                        </Badge>
                      </td>
                      <td>
                        {alert.field ? (
                          <Group spacing={4}>
                            {FIELD_ICONS[alert.field]}
                            <Text size="xs" style={{ fontFamily: 'monospace' }}>{alert.field}</Text>
                          </Group>
                        ) : (
                          <Text size="xs" color="dimmed">—</Text>
                        )}
                      </td>
                      <td>
                        <Text size="xs" lineClamp={2} style={{ maxWidth: 320 }}>
                          {alert.message}
                        </Text>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {alert.value != null ? (
                          <Text size="xs" weight={500} color="red">
                            {alert.value}
                            {alert.threshold && (
                              <Text span size="xs" color="dimmed">
                                {' '}({alert.threshold.min}–{alert.threshold.max})
                              </Text>
                            )}
                          </Text>
                        ) : (
                          <Text size="xs" color="dimmed">—</Text>
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Tooltip label={formatTime(alert.timestamp)} withArrow>
                          <Text size="xs" color="dimmed">{relativeTime(alert.timestamp)}</Text>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
}
