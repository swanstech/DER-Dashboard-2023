import React from 'react';
import {
  Badge,
  Box,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconChevronRight,
  IconCpu,
  IconPlugConnected,
  IconPlugConnectedX,
  IconShieldLock,
} from '@tabler/icons-react';

import type { DeviceSummary } from './types';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  relativeTime,
} from './helpers';

interface DeviceFleetPanelProps {
  devices: DeviceSummary[];
  selectedDeviceId: string | null;
  onSelect: (deviceId: string | null) => void;
  onOpenDetail: (deviceId: string) => void;
}

export function DeviceFleetPanel({
  devices,
  selectedDeviceId,
  onSelect,
  onOpenDetail,
}: DeviceFleetPanelProps) {
  if (devices.length === 0) {
    return (
      <Card radius="lg" withBorder mb="lg" p="lg" style={CARD_GLASS}>
        <Stack align="center" spacing={4}>
          <IconCpu size={28} color="#adb5bd" />
          <Text size="sm" weight={600}>No devices reporting</Text>
          <Text size="xs" color="dimmed" align="center" style={{ maxWidth: 420 }}>
            The poller has not yet sent any telemetry or alerts. Check that
            <Text component="span" weight={500}> der-poller </Text>
            is running on the lab host and that at least one device is enabled
            in <Text component="span" weight={500}>scripts/devices.yaml</Text>.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card radius="lg" withBorder mb="lg" p={0} style={CARD_GLASS}>
      <Box px="md" py="sm" style={{ borderBottom: '1px solid #eef0f3' }}>
        <Group position="apart">
          <Group spacing="xs" align="center">
            <Text weight={700} size="sm" style={{ letterSpacing: '-0.005em' }}>
              Device fleet
            </Text>
            <Badge color="gray" variant="light" size="sm" radius="sm">
              {devices.length} device{devices.length === 1 ? '' : 's'}
            </Badge>
          </Group>
          {selectedDeviceId && (
            <UnstyledButton onClick={() => onSelect(null)}>
              <Text size="xs" color="blue" weight={500}>Clear filter</Text>
            </UnstyledButton>
          )}
        </Group>
      </Box>

      <Box p="md">
        <SimpleGrid
          cols={3}
          spacing="md"
          breakpoints={[
            { maxWidth: 'lg', cols: 2 },
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          {devices.map(device => (
            <DeviceCard
              key={device.device_id}
              device={device}
              selected={device.device_id === selectedDeviceId}
              onClick={() => {
                const next = device.device_id === selectedDeviceId
                  ? null
                  : device.device_id;
                onSelect(next);
                if (next) onOpenDetail(device.device_id);
              }}
              onOpenDetail={() => onOpenDetail(device.device_id)}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Card>
  );
}

interface DeviceCardProps {
  device: DeviceSummary;
  selected: boolean;
  onClick: () => void;
  onOpenDetail: () => void;
}

function DeviceCard({ device, selected, onClick, onOpenDetail }: DeviceCardProps) {
  const color = STATUS_COLOR[device.status];
  const isReachable = device.status === 'online' || device.status === 'stale';
  const hasIssue = !!device.knownIssue
    && (device.status === 'offline' || device.status === 'unknown');

  return (
    <UnstyledButton
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${device.device_id} — ${STATUS_LABEL[device.status]}`}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        textAlign: 'left',
        borderRadius: theme.radius.lg,
        transition: 'transform 120ms ease, box-shadow 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px -12px rgba(15, 23, 42, 0.18)',
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.colors.blue[5]}`,
          outlineOffset: 2,
        },
      })}
    >
      <Paper
        radius="lg"
        p="md"
        withBorder
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: selected
            ? `linear-gradient(135deg, var(--mantine-color-${color}-0) 0%, #ffffff 60%)`
            : '#ffffff',
          boxShadow: selected
            ? `inset 0 0 0 1.5px var(--mantine-color-${color}-5)`
            : '0 1px 2px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Top accent stripe — gives 2026 status framing without taking real estate */}
        <Box
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, var(--mantine-color-${color}-6) 0%, var(--mantine-color-${color}-3) 100%)`,
          }}
        />

        <Group position="apart" align="flex-start" noWrap mt={4}>
          <Box style={{ minWidth: 0 }}>
            <Group spacing={6} noWrap>
              <StatusDot status={device.status} />
              <Text size="sm" weight={700} truncate style={{ letterSpacing: '-0.005em' }}>
                {device.device_id}
              </Text>
            </Group>
            <Text size="xs" color="dimmed" truncate mt={2}>
              {[device.manufacturer, device.device_type, device.device_host]
                .filter(Boolean).join(' · ') || '—'}
            </Text>
          </Box>
          <Group spacing={4} noWrap>
            <Badge
              color={color}
              variant="filled"
              size="xs"
              radius="sm"
              style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}
              leftSection={
                isReachable
                  ? <IconPlugConnected size={9} style={{ verticalAlign: 'middle' }} />
                  : <IconPlugConnectedX size={9} style={{ verticalAlign: 'middle' }} />
              }
            >
              {STATUS_LABEL[device.status]}
            </Badge>
            <Tooltip label="Open device details" withArrow>
              <Box
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenDetail();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22, height: 22,
                  borderRadius: 6,
                  cursor: 'pointer',
                  color: '#868e96',
                }}
              >
                <IconChevronRight size={14} />
              </Box>
            </Tooltip>
          </Group>
        </Group>

        {/* Issue or freshness line */}
        <Tooltip
          label={device.statusReason}
          multiline
          width={260}
          withinPortal
          position="bottom-start"
        >
          <Group spacing={6} mt={8} noWrap>
            {hasIssue && <IconAlertTriangle size={12} color="#fa5252" style={{ flexShrink: 0 }} />}
            <Text
              size="xs"
              color={hasIssue ? 'red.7' : isReachable ? 'dimmed' : color}
              lineClamp={2}
            >
              {device.statusReason}
            </Text>
          </Group>
        </Tooltip>

        {/* Per-device 24 h counters */}
        {(device.anomaliesLast24h > 0 || device.tamperLast24h > 0) && (
          <Group spacing={6} mt="sm">
            {device.anomaliesLast24h > 0 && (
              <Badge
                color="red" variant="light" size="xs" radius="sm"
                leftSection={<IconAlertTriangle size={10} style={{ verticalAlign: 'middle' }} />}
              >
                {device.anomaliesLast24h} breach{device.anomaliesLast24h === 1 ? '' : 'es'} (24 h)
              </Badge>
            )}
            {device.tamperLast24h > 0 && (
              <Badge
                color="red" variant="filled" size="xs" radius="sm"
                leftSection={<IconShieldLock size={10} style={{ verticalAlign: 'middle' }} />}
              >
                {device.tamperLast24h} tamper (24 h)
              </Badge>
            )}
          </Group>
        )}

        <Text size="xs" color="dimmed" mt="xs">
          {device.lastSeenIso
            ? `Last seen ${relativeTime(device.lastSeenIso)}`
            : 'Never observed'}
        </Text>
      </Paper>
    </UnstyledButton>
  );
}

function StatusDot({ status }: { status: DeviceSummary['status'] }) {
  const color = STATUS_COLOR[status];
  const isLive = status === 'online';
  return (
    <Box
      style={{
        flexShrink: 0,
        width: 8, height: 8, borderRadius: '50%',
        background: `var(--mantine-color-${color}-6)`,
        boxShadow: isLive
          ? `0 0 0 3px var(--mantine-color-${color}-1)`
          : 'none',
        animation: isLive ? 'derAlertPulse 1.6s infinite' : 'none',
      }}
    />
  );
}

const CARD_GLASS: React.CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
};
