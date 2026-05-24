import React, { useMemo } from 'react';
import {
  Badge,
  Box,
  Code,
  Drawer,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconHash,
  IconShieldLock,
} from '@tabler/icons-react';

import type { DERAlert, DeviceSummary } from './types';
import {
  SEVERITY_COLOR,
  SEVERITY_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
  relativeTime,
  severityFor,
} from './helpers';

interface DeviceDetailDrawerProps {
  device: DeviceSummary | null;
  alerts: DERAlert[];
  open: boolean;
  onClose: () => void;
}

export function DeviceDetailDrawer({
  device, alerts, open, onClose,
}: DeviceDetailDrawerProps) {
  const deviceAlerts = useMemo(() => {
    if (!device) return [];
    return alerts
      .filter(a => a.device_id === device.device_id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }, [device, alerts]);

  if (!device) return null;
  const color = STATUS_COLOR[device.status];

  return (
    <Drawer
      opened={open}
      onClose={onClose}
      position="right"
      size="xl"
      padding={0}
      withCloseButton={false}
      overlayProps={{ opacity: 0.35, blur: 2 }}
    >
      <Box
        p="lg"
        style={{
          background: `linear-gradient(180deg, var(--mantine-color-${color}-0) 0%, transparent 100%)`,
          borderBottom: '1px solid #e9ecef',
        }}
      >
        <Group position="apart" align="flex-start" mb="sm" noWrap>
          <Stack spacing={2} style={{ minWidth: 0 }}>
            <Group spacing={8} noWrap>
              <StatusDot status={device.status} />
              <Title order={3} weight={700} style={{ letterSpacing: '-0.01em' }}>
                {device.device_id}
              </Title>
            </Group>
            <Text size="xs" color="dimmed">
              {[device.manufacturer, device.device_type, device.device_host, device.protocol]
                .filter(Boolean).join(' · ')}
            </Text>
          </Stack>
          <Badge
            size="lg"
            radius="md"
            color={color}
            variant="filled"
            style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}
          >
            {STATUS_LABEL[device.status]}
          </Badge>
        </Group>

        <Text size="sm" color="dark.4">
          {device.statusReason}
        </Text>
      </Box>

      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        <Box p="lg">
          {/* Known device-side issue banner — shown only when populated. */}
          {device.knownIssue && (device.status === 'offline' || device.status === 'unknown') && (
            <Paper
              radius="md"
              p="md"
              mb="lg"
              withBorder
              style={{
                borderLeft: '3px solid var(--mantine-color-red-6)',
                background: 'linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)',
              }}
            >
              <Group spacing={8} align="flex-start" noWrap>
                <IconAlertTriangle size={18} color="#fa5252" style={{ marginTop: 2 }} />
                <Stack spacing={2}>
                  <Text size="sm" weight={600} color="red.9">
                    Device-side issue
                  </Text>
                  <Text size="xs" color="dark.5">
                    {device.knownIssue}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          )}

          {/* Per-device alert history */}
          <SectionHeader
            icon={<IconShieldLock size={14} />}
            title="Recent alerts"
            badge={deviceAlerts.length}
          />
          {deviceAlerts.length === 0 ? (
            <Text size="sm" color="dimmed" mt="xs">
              No alerts recorded for this device.
            </Text>
          ) : (
            <Stack spacing="xs" mt="xs">
              {deviceAlerts.map((a, i) => (
                <AlertMiniRow key={`${a.timestamp}-${i}`} alert={a} />
              ))}
            </Stack>
          )}
        </Box>
      </ScrollArea>
    </Drawer>
  );
}

function SectionHeader({
  icon, title, badge,
}: { icon: React.ReactNode; title: string; badge?: number }) {
  return (
    <Group spacing={6} mb="xs">
      {icon}
      <Text
        size="xs"
        weight={700}
        transform="uppercase"
        color="dark.4"
        style={{ letterSpacing: '0.08em' }}
      >
        {title}
      </Text>
      {badge != null && badge > 0 && (
        <Badge size="xs" color="gray" variant="light">{badge}</Badge>
      )}
    </Group>
  );
}

function AlertMiniRow({ alert }: { alert: DERAlert }) {
  const sev = severityFor(alert);
  const isTamper = alert.alert_type === 'config_change';
  return (
    <Paper radius="md" p="xs" withBorder>
      <Group position="apart" align="flex-start" noWrap>
        <Group spacing={6} align="flex-start" noWrap style={{ minWidth: 0 }}>
          <Badge color={SEVERITY_COLOR[sev]} variant="filled" size="xs" radius="sm">
            {SEVERITY_LABEL[sev]}
          </Badge>
          <Stack spacing={0} style={{ minWidth: 0 }}>
            <Group spacing={6} noWrap>
              {isTamper
                ? <IconShieldLock size={12} color="#fa5252" />
                : <IconAlertTriangle size={12} color="#fd7e14" />}
              <Text size="xs" weight={600} truncate>
                {alert.field ?? (isTamper ? 'configuration change' : 'event')}
              </Text>
            </Group>
            <Text size="xs" color="dimmed" lineClamp={2} style={{ maxWidth: 320 }}>
              {alert.message}
            </Text>
            {isTamper && alert.checksum && alert.old_checksum && (
              <Group spacing={4} mt={2}>
                <IconHash size={10} color="#868e96" />
                <Code style={{ fontSize: 10 }}>
                  {alert.old_checksum.slice(0, 8)} → {alert.checksum.slice(0, 8)}
                </Code>
              </Group>
            )}
          </Stack>
        </Group>
        <Text size="xs" color="dimmed" style={{ whiteSpace: 'nowrap' }}>
          {relativeTime(alert.timestamp)}
        </Text>
      </Group>
    </Paper>
  );
}

function StatusDot({ status }: { status: DeviceSummary['status'] }) {
  const color = STATUS_COLOR[status];
  const isLive = status === 'online';
  return (
    <Box
      style={{
        width: 10, height: 10, borderRadius: '50%',
        background: `var(--mantine-color-${color}-6)`,
        boxShadow: isLive
          ? `0 0 0 3px var(--mantine-color-${color}-1)`
          : 'none',
        animation: isLive ? 'derAlertPulse 1.6s infinite' : 'none',
      }}
    />
  );
}
