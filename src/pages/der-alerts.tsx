import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Global,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconClock,
  IconRefresh,
} from '@tabler/icons-react';

import { AlertAuditLog } from '../components/AlertComponents/AlertAuditLog';
import { DeviceDetailDrawer } from '../components/AlertComponents/DeviceDetailDrawer';
import { DeviceFleetPanel } from '../components/AlertComponents/DeviceFleetPanel';
import { KpiStrip } from '../components/AlertComponents/KpiCards';
import {
  isWithin24h,
  relativeTime,
  summariseDevices,
} from '../components/AlertComponents/helpers';
import type {
  AlertApiResponse,
} from '../components/AlertComponents/types';

const REFRESH_INTERVAL_MS = 30_000;
const ALERTS_ENDPOINT = '/api/deralerts';

interface FetchState {
  data: AlertApiResponse;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastFetch: Date | null;
}

const INITIAL_STATE: FetchState = {
  data: { alerts: [], telemetry: [] },
  loading: true,
  refreshing: false,
  error: null,
  lastFetch: null,
};

async function fetchAlerts(): Promise<AlertApiResponse> {
  const res = await fetch(ALERTS_ENDPOINT);
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      if (body?.error) detail = `: ${body.error}`;
    } catch { /* body not JSON — leave detail empty */ }
    throw new Error(`HTTP ${res.status}${detail}`);
  }
  const json = await res.json();
  return {
    alerts:    Array.isArray(json.alerts)    ? json.alerts    : [],
    telemetry: Array.isArray(json.telemetry) ? json.telemetry : [],
  };
}

export default function DERAlerts() {
  const [state, setState] = useState<FetchState>(INITIAL_STATE);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [drawerDeviceId, setDrawerDeviceId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    setState(s => ({
      ...s,
      loading: silent ? s.loading : true,
      refreshing: silent,
      error: null,
    }));
    try {
      const data = await fetchAlerts();
      setState({
        data,
        loading: false,
        refreshing: false,
        error: null,
        lastFetch: new Date(),
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load alerts';
      setState(s => ({
        ...s,
        loading: false,
        refreshing: false,
        error: message,
      }));
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => load(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  const { data, loading, refreshing, error, lastFetch } = state;
  const { alerts, telemetry } = data;

  // Heavy-ish derivations — memoise so re-renders don't redo them.
  const devices = useMemo(
    () => summariseDevices(alerts, telemetry),
    [alerts, telemetry],
  );

  const anomalies      = useMemo(() => alerts.filter(a => a.alert_type === 'anomaly'),       [alerts]);
  const configChanges  = useMemo(() => alerts.filter(a => a.alert_type === 'config_change'), [alerts]);
  const anomalies24h   = useMemo(() => anomalies.filter(a => isWithin24h(a.timestamp)).length,     [anomalies]);
  const tamper24h      = useMemo(() => configChanges.filter(a => isWithin24h(a.timestamp)).length, [configChanges]);

  const drawerDevice = useMemo(
    () => devices.find(d => d.device_id === drawerDeviceId) ?? null,
    [devices, drawerDeviceId],
  );

  if (loading) {
    return (
      <Box style={LOADING_WRAP}>
        <Stack align="center" spacing="xs">
          <Loader size="md" />
          <Text size="sm" color="dimmed">Loading alerts…</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      {/* Page-scoped keyframes for the live status pulse. */}
      <Global styles={{
        '@keyframes derAlertPulse': {
          '0%':   { boxShadow: '0 0 0 0 rgba(64, 192, 87, 0.55)' },
          '70%':  { boxShadow: '0 0 0 6px rgba(64, 192, 87, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(64, 192, 87, 0)' },
        },
      }} />

      <Box p="md" style={{ background: '#fafbfc', minHeight: '100%' }}>
        <PageHeader
          lastFetch={lastFetch}
          refreshing={refreshing}
          onRefresh={() => load(true)}
          devicesOnline={devices.filter(d => d.status === 'online').length}
          devicesTotal={devices.length}
        />

        {error && (
          <ErrorBanner
            message={error}
            stale={lastFetch != null}
            lastFetch={lastFetch}
            onRetry={() => load()}
          />
        )}

        <KpiStrip
          anomalies24h={anomalies24h}
          anomaliesTotal={anomalies.length}
          tamper24h={tamper24h}
          tamperTotal={configChanges.length}
          devices={devices}
        />

        <DeviceFleetPanel
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onSelect={setSelectedDeviceId}
          onOpenDetail={setDrawerDeviceId}
        />

        <AlertAuditLog
          alerts={alerts}
          selectedDeviceId={selectedDeviceId}
        />

        <DeviceDetailDrawer
          device={drawerDevice}
          alerts={alerts}
          open={drawerDeviceId != null}
          onClose={() => setDrawerDeviceId(null)}
        />
      </Box>
    </>
  );
}

interface PageHeaderProps {
  lastFetch: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
  devicesOnline: number;
  devicesTotal: number;
}

function PageHeader({
  lastFetch, refreshing, onRefresh, devicesOnline, devicesTotal,
}: PageHeaderProps) {
  return (
    <Group position="apart" mb="lg" align="flex-end">
      <Box>
        <Group spacing="xs" align="center">
          <Title order={2} weight={800} style={{ letterSpacing: '-0.02em' }}>
            DER Security &amp; Alert Monitor
          </Title>
          <LivePill online={devicesOnline > 0} />
        </Group>
        <Text size="sm" color="dimmed" mt={2}>
          SIEM-style audit log for the Swan Foresight Smart Energy Lab fleet —
          threshold breaches and unauthorised inverter configuration changes.
        </Text>
      </Box>
      <Group spacing="md">
        <Group spacing={4}>
          <Badge
            color={devicesOnline > 0 ? 'green' : 'gray'}
            variant="light"
            size="sm"
            radius="sm"
          >
            {devicesOnline} / {devicesTotal} online
          </Badge>
          {lastFetch && (
            <Group spacing={4}>
              <IconClock size={13} color="gray" />
              <Text size="xs" color="dimmed">
                Updated {relativeTime(lastFetch)}
              </Text>
            </Group>
          )}
        </Group>
        <Tooltip label="Refresh now" withArrow>
          <ActionIcon
            variant="filled"
            color="dark"
            onClick={onRefresh}
            loading={refreshing}
            radius="md"
            size="lg"
            aria-label="Refresh alerts"
          >
            <IconRefresh size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}

function LivePill({ online }: { online: boolean }) {
  return (
    <Box
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 10px',
        borderRadius: 999,
        background: online ? 'rgba(64, 192, 87, 0.08)' : 'rgba(134, 142, 150, 0.08)',
        border: `1px solid ${online ? 'rgba(64, 192, 87, 0.35)' : 'rgba(134, 142, 150, 0.35)'}`,
      }}
    >
      <Box
        style={{
          width: 6, height: 6, borderRadius: '50%',
          background: online ? '#40c057' : '#adb5bd',
          animation: online ? 'derAlertPulse 1.6s infinite' : 'none',
        }}
      />
      <Text size="xs" weight={600} color={online ? 'green.7' : 'dimmed'}>
        {online ? 'LIVE' : 'IDLE'}
      </Text>
    </Box>
  );
}

interface ErrorBannerProps {
  message: string;
  stale: boolean;
  lastFetch: Date | null;
  onRetry: () => void;
}

function ErrorBanner({ message, stale, lastFetch, onRetry }: ErrorBannerProps) {
  return (
    <Paper
      p="sm"
      mb="md"
      withBorder
      radius="md"
      style={{
        borderLeft: '3px solid #fa5252',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)',
      }}
    >
      <Group position="apart" align="center" noWrap>
        <Group spacing="xs" align="flex-start" noWrap>
          <IconAlertTriangle size={16} color="#fa5252" style={{ marginTop: 2 }} />
          <Stack spacing={2}>
            <Text size="sm" color="red.9" weight={600}>
              Unable to reach the alerts service
            </Text>
            <Text size="xs" color="dimmed">{message}</Text>
            {stale && lastFetch && (
              <Text size="xs" color="dimmed">
                Showing cached data from {relativeTime(lastFetch)}.
              </Text>
            )}
          </Stack>
        </Group>
        <Button size="xs" variant="light" color="red" onClick={onRetry}>
          Retry
        </Button>
      </Group>
    </Paper>
  );
}

const LOADING_WRAP: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60vh',
};
