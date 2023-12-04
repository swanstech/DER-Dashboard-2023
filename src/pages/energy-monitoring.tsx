import { Tabs } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';

import DailyEnergyUsage from '../components/EnergyCharts/DailyEnergyUsage'
import WeeklyEnergyUsage from '../components/EnergyCharts/WeeklyEnergyUsage';
import MonthlyEnergyUsage from '../components/EnergyCharts/MonthlyEnergyUsage';
import YearlyEnergyUsage from '../components/EnergyCharts/YearlyEnergyUsage';

export default function EnergyMonitor() {
  return (
    <Tabs defaultValue="daily">
        
      <Tabs.List>
        <Tabs.Tab value="daily" icon={<IconCalendar size="0.8rem" />}>Daily</Tabs.Tab>
        <Tabs.Tab value="weekly" icon={<IconCalendar size="0.8rem" />}>Weekly</Tabs.Tab>
        <Tabs.Tab value="monthly" icon={<IconCalendar size="0.8rem" />}>Monthly</Tabs.Tab>
        <Tabs.Tab value="yearly" icon={<IconCalendar size="0.8rem" />}>Yearly</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="daily" pt="xs">
        <DailyEnergyUsage/>
      </Tabs.Panel>

      <Tabs.Panel value="weekly" pt="xs">
        <WeeklyEnergyUsage/>
      </Tabs.Panel>

      <Tabs.Panel value="monthly" pt="xs">
        <MonthlyEnergyUsage/>
      </Tabs.Panel>

      <Tabs.Panel value="yearly" pt="xs">
        <YearlyEnergyUsage/>
      </Tabs.Panel>

    </Tabs>
  );
}