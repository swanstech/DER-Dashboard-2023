import React from 'react';
import { Box, Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import {
  IconAlertTriangle,
  IconShieldLock,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';

import type { DeviceSummary } from './types';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  icon: React.ReactNode;
  sub?: string;
}

function KpiCard({ label, value, unit, color, icon, sub }: KpiCardProps) {
  return (
    <Paper
      radius="lg"
      p="md"
      withBorder
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Top accent strip — gradient instead of a flat border for 2026 feel */}
      <Box
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, var(--mantine-color-${color}-6) 0%, var(--mantine-color-${color}-3) 100%)`,
        }}
      />
      <Group position="apart" mb={4} mt={4}>
        <Text
          size="xs"
          color="dimmed"
          weight={700}
          transform="uppercase"
          style={{ letterSpacing: '0.06em' }}
        >
          {label}
        </Text>
        <ThemeIcon color={color} variant="light" size="md" radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      <Group align="baseline" spacing={4}>
        <Text
          size={28}
          weight={800}
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {value}
        </Text>
        {unit && <Text size="sm" color="dimmed">{unit}</Text>}
      </Group>
      {sub && <Text size="xs" color="dimmed" mt={4}>{sub}</Text>}
    </Paper>
  );
}

interface KpiStripProps {
  anomalies24h: number;
  anomaliesTotal: number;
  tamper24h: number;
  tamperTotal: number;
  devices: DeviceSummary[];
}

export function KpiStrip({
  anomalies24h, anomaliesTotal, tamper24h, tamperTotal, devices,
}: KpiStripProps) {
  const online  = devices.filter(d => d.status === 'online').length;
  const stale   = devices.filter(d => d.status === 'stale').length;
  const offline = devices.filter(d => d.status === 'offline' || d.status === 'unknown').length;

  return (
    <SimpleGrid
      cols={4}
      breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'xs', cols: 1 }]}
      mb="lg"
    >
      <KpiCard
        label="Threshold breaches (24 h)"
        value={anomalies24h}
        color={anomalies24h > 0 ? 'red' : 'gray'}
        icon={<IconAlertTriangle size={14} />}
        sub={`${anomaliesTotal} total on record`}
      />
      <KpiCard
        label="Tamper events (24 h)"
        value={tamper24h}
        color={tamper24h > 0 ? 'red' : 'gray'}
        icon={<IconShieldLock size={14} />}
        sub={
          tamperTotal === 0
            ? 'No config writes seen'
            : `${tamperTotal} total config writes`
        }
      />
      <KpiCard
        label="Devices online"
        value={online}
        color={online > 0 ? 'green' : 'gray'}
        icon={<IconCircleCheck size={14} />}
        sub={`${devices.length} known device${devices.length === 1 ? '' : 's'}`}
      />
      <KpiCard
        label="Devices needing attention"
        value={offline + stale}
        color={offline > 0 ? 'red' : stale > 0 ? 'orange' : 'gray'}
        icon={<IconCircleX size={14} />}
        sub={`${offline} offline · ${stale} stale`}
      />
    </SimpleGrid>
  );
}
