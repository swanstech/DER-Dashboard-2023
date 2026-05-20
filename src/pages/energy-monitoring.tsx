import { Tabs } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import dynamic from 'next/dynamic';

const DailyEnergyUsage = dynamic(() => import('../components/EnergyCharts/DailyEnergyUsage'), { ssr: false });
const WeeklyEnergyUsage = dynamic(() => import('../components/EnergyCharts/WeeklyEnergyUsage'), { ssr: false });
const MonthlyEnergyUsage = dynamic(() => import('../components/EnergyCharts/MonthlyEnergyUsage'), { ssr: false });
const YearlyEnergyUsage = dynamic(() => import('../components/EnergyCharts/YearlyEnergyUsage'), { ssr: false });
const VoltageReadingChart = dynamic(() => import('n/components/EnergyCharts/VoltageReading'), { ssr: false });
const FrequencyChart = dynamic(() => import('n/components/EnergyCharts/FrequencyReading'), { ssr: false });

export async function getServerSideProps() {
  return { props: {} };
}

export default function EnergyMonitor() {
  return (
    <body>
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

      <Tabs defaultValue='voltage-reading'>
        <Tabs.List>
          <Tabs.Tab value="voltage-reading">Voltage</Tabs.Tab>
          <Tabs.Tab value="frequency-reading">Frequency</Tabs.Tab>
          <Tabs.Tab value="current-reading">Current</Tabs.Tab>

          <Tabs.Panel value="voltage-reading" pt="xs">
            <VoltageReadingChart/>
          </Tabs.Panel>
          <Tabs.Panel value="frequency-reading" pt="xs">
            <FrequencyChart/>
          </Tabs.Panel>

        </Tabs.List>
      </Tabs>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px"  alt="Swanforesight Logo" /></p>
      </div>

      <style jsx>{`
        .logo-container {
          margin-right: 16px;
          align-self: center;
        }
        .footer {
          text-align: center;
          padding: 8px;
          background-color: #f5f5f5;
         }
        .page-layout {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100vh;
          padding: 8px;
          box-sizing: border-box;
        }
        .top {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: stretch;
          padding: 8px;
        }
        .bottom {
          display: flex;
          flex: 1;
          padding: 2px;
          justify-content: space-between;
        }
        .left, .right {
          flex: 1;
          margin: 8px;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        .left-heading, .bottom-heading, .right-heading {
          display: flex;
          align-items: center;
          font-size: 24px;
          color: #555555;
          margin-bottom: 16px;
        }
      `}</style>
    </body>
  );
}