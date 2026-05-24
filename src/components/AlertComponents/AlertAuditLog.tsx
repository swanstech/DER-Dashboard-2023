import React, { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Card,
  Code,
  Group,
  SegmentedControl,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconBattery,
  IconBolt,
  IconShieldLock,
  IconTemperature,
  IconActivity,
  IconWifi,
} from '@tabler/icons-react';

import type { DERAlert } from './types';
import {
  SEVERITY_COLOR,
  SEVERITY_LABEL,
  formatTime,
  relativeTime,
  severityFor,
} from './helpers';

const FIELD_ICONS: Record<string, React.ReactNode> = {
  grid_voltage_v:    <IconBolt size={12} />,
  grid_voltage_2_v:  <IconBolt size={12} />,
  ac_voltage_v:      <IconBolt size={12} />,
  frequency_hz:      <IconWifi size={12} />,
  temperature_c:     <IconTemperature size={12} />,
  battery_soc_pct:   <IconBattery size={12} />,
  battery_voltage_v: <IconBattery size={12} />,
  ac_power_w:        <IconActivity size={12} />,
};

type Filter = 'all' | 'anomaly' | 'config_change';

interface AlertAuditLogProps {
  alerts: DERAlert[];
  selectedDeviceId: string | null;
  pageSize?: number;
}

export function AlertAuditLog({
  alerts,
  selectedDeviceId,
  pageSize = 100,
}: AlertAuditLogProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    return [...alerts]
      .filter(a => filter === 'all' ? true : a.alert_type === filter)
      .filter(a => !selectedDeviceId || a.device_id === selectedDeviceId)
      .sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, pageSize);
  }, [alerts, filter, selectedDeviceId, pageSize]);

  const anomalyCount = useMemo(
    () => alerts.filter(a => a.alert_type === 'anomaly').length,
    [alerts]
  );
  const tamperCount = useMemo(
    () => alerts.filter(a => a.alert_type === 'config_change').length,
    [alerts]
  );

  return (
    <Card
      radius="lg"
      withBorder
      p={0}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Box px="md" py="sm" style={{ borderBottom: '1px solid #eef0f3' }}>
        <Group position="apart" align="center">
          <Group spacing="xs" align="center">
            <Text weight={700} size="sm" style={{ letterSpacing: '-0.005em' }}>
              Audit log
            </Text>
            <Badge color="gray" variant="light" size="sm">
              {rows.length} shown · {alerts.length} total
            </Badge>
            {selectedDeviceId && (
              <Badge color="blue" variant="light" size="sm">
                filter: {selectedDeviceId}
              </Badge>
            )}
          </Group>
          <SegmentedControl
            size="xs"
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
            data={[
              { label: 'All',                     value: 'all' },
              { label: `Anomalies (${anomalyCount})`, value: 'anomaly' },
              { label: `Tamper (${tamperCount})`, value: 'config_change' },
            ]}
          />
        </Group>
      </Box>

      {rows.length === 0 ? (
        <Box py="xl" style={{ textAlign: 'center' }}>
          <Text size="sm" color="dimmed">
            {alerts.length === 0
              ? 'No alerts recorded yet — system is quiet.'
              : 'No alerts match the current filter.'}
          </Text>
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
                <Th>SEVERITY</Th>
                <Th>TYPE</Th>
                <Th>DEVICE</Th>
                <Th>SENSOR / EVENT</Th>
                <Th>DETAIL</Th>
                <Th>VALUE</Th>
                <Th>TIME</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => (
                <AlertRow key={`${a.timestamp}-${i}`} alert={a} />
              ))}
            </tbody>
          </Table>
        </Box>
      )}
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        whiteSpace: 'nowrap',
        fontWeight: 600,
        fontSize: 12,
        color: '#868e96',
        letterSpacing: '0.04em',
      }}
    >
      {children}
    </th>
  );
}

function AlertRow({ alert }: { alert: DERAlert }) {
  const sev = severityFor(alert);
  const isTamper = alert.alert_type === 'config_change';

  return (
    <tr>
      <td>
        <Badge color={SEVERITY_COLOR[sev]} variant="filled" size="xs" radius="sm">
          {SEVERITY_LABEL[sev]}
        </Badge>
      </td>
      <td>
        <Badge
          color={isTamper ? 'red' : 'orange'}
          variant={isTamper ? 'filled' : 'light'}
          size="sm"
          radius="sm"
          leftSection={
            isTamper
              ? <IconShieldLock size={10} style={{ verticalAlign: 'middle' }} />
              : <IconAlertTriangle size={10} style={{ verticalAlign: 'middle' }} />
          }
        >
          {isTamper ? 'Config tamper' : 'Threshold breach'}
        </Badge>
      </td>
      <td>
        <Text size="xs" weight={500} style={{ fontFamily: 'monospace' }}>
          {alert.device_id ?? '—'}
        </Text>
      </td>
      <td>
        {alert.field ? (
          <Group spacing={4}>
            {FIELD_ICONS[alert.field]}
            <Text size="xs" style={{ fontFamily: 'monospace' }}>{alert.field}</Text>
          </Group>
        ) : (
          <Text size="xs" color="dimmed">
            {isTamper ? 'inverter configuration' : '—'}
          </Text>
        )}
      </td>
      <td>
        <DetailCell alert={alert} />
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>
        {alert.value != null ? (
          <Text size="xs" weight={500} color="red">
            {alert.value}
            {alert.threshold && (
              <Text component="span" size="xs" color="dimmed">
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
  );
}

function DetailCell({ alert }: { alert: DERAlert }) {
  if (alert.alert_type === 'config_change') {
    return (
      <Stack spacing={2} style={{ maxWidth: 360 }}>
        <Text size="xs" weight={500} color="red">
          Unauthorised configuration change detected
        </Text>
        {alert.config && Object.keys(alert.config).length > 0 && (
          <Group spacing={4}>
            {Object.entries(alert.config).slice(0, 3).map(([k, v]) => (
              <Code key={k} style={{ fontSize: 10 }}>{k}={String(v)}</Code>
            ))}
            {Object.keys(alert.config).length > 3 && (
              <Text size="xs" color="dimmed">
                +{Object.keys(alert.config).length - 3} more
              </Text>
            )}
          </Group>
        )}
        {alert.old_checksum && alert.checksum && (
          <Text size="xs" color="dimmed" style={{ fontFamily: 'monospace' }}>
            {alert.old_checksum.slice(0, 8)} → {alert.checksum.slice(0, 8)}
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <Text size="xs" lineClamp={2} style={{ maxWidth: 360 }}>
      {alert.message}
    </Text>
  );
}
