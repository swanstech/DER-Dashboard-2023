import React from 'react';
import { Tabs } from '@mantine/core';
import { Activity, CloudStorm, Map2 } from 'tabler-icons-react';
import GoogleMapComponent from '../components/GenericAPIComponents/GoogleMapsComponent';
import WeatherComponent from '../components/GenericAPIComponents/WeatherComponent';
import DailyEnergyUsage from '../components/EnergyCharts/DailyEnergyUsage';
import MonthlyEnergyUsage from '../components/EnergyCharts/MonthlyEnergyUsage';
import WeeklyEnergyUsage from '../components/EnergyCharts/WeeklyEnergyUsage';
import YearlyEnergyUsage from '../components/EnergyCharts/YearlyEnergyUsage';
import AssetManagerPieChart from 'n/components/HomePageComponents/AssetManagerPieChart';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";

const Home: React.FC = () => {
  return (
    <div className="page-layout">
      <div className="top">
        <div className="left">
          <div className="left-heading">
            <Activity size="3rem" color='green'/>
            <h6>DER Asset Manager</h6>
          </div>
          <AssetManagerPieChart/>
        </div>
        <div className="right">
          {/* Top-right section with Tabs */}
          <div className="right-heading">
            <Activity size="3rem" color='green'/>
            <h6>Energy Charts</h6>
          </div>
          <Tabs defaultValue='daily'>
            <Tabs.List>
              <Tabs.Tab value="daily">Daily</Tabs.Tab>
              <Tabs.Tab value="monthly">Monthly</Tabs.Tab>
              <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
              <Tabs.Tab value="yearly">Yearly</Tabs.Tab>
            </Tabs.List>
          <Tabs.Panel value="daily" pt="xs">
            <div className="chart-container"><DailyEnergyUsage /></div>
          </Tabs.Panel>
          <Tabs.Panel value="weekly" pt="xs">
            <div className="chart-container"><WeeklyEnergyUsage /></div>
          </Tabs.Panel>
          <Tabs.Panel value="monthly" pt="xs">
            <div className="chart-container"><MonthlyEnergyUsage /></div>
          </Tabs.Panel>
          <Tabs.Panel value="yearly" pt="xs">
            <div className="chart-container"><YearlyEnergyUsage /></div>
          </Tabs.Panel>
 
          </Tabs>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          {/* Bottom-left section (Weather API data) */}
          <div className="left-heading">
            <CloudStorm size="3rem" color='green'/>
            <h6>Weather Forecast</h6>
          </div>
          <WeatherComponent latitude={-33.833} longitude={150.52808} />
        </div>
        <div className="right">
          {/* Bottom-right section (Google Maps) */}
          <div className="right-heading">
            <Map2 size="3rem" color='green'/>
            <h6>Google Maps</h6>
          </div>
          <GoogleMapComponent
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={10}
            googleMapsApiKey={googleMapsApiKey}
            markers={[
              { lat: 37.7749, lng: -122.4194, label: 'A' },
            ]}
          />
        </div>
      </div>
      {/* Styles */}
      <style jsx>{`
        .page-layout {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100vh;
          padding: 8px;
          box-sizing: border-box;
        }
        .top, .bottom {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: stretch;
          padding: 8px;
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
        .right {
          width: 50%; // Adjust the width of the right section
        }
        .left-heading, .right-heading {
          display: flex;
          align-items: center;
          font-size: 24px;
          color: #555555;
          margin-bottom: 16px;
        }
        .chart-container {
          width: 100%; // Chart container takes full width of its parent
          max-height: 400px;
          margin: 0 auto;
          overflow: hidden; // Ensures the chart does not overflow its container
        }
      `}</style>
    </div>
  );
}

export default Home;
