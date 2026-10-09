// This page is responsible for showing the data in the HOME page
// Some parts are modified by Sakshi such as adding Google Map API and making pie chart dynamic

import React, { useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import { Activity, CloudStorm, Map2 } from 'tabler-icons-react';
import GoogleMapComponent from '../components/GenericAPIComponents/GoogleMapsComponent';
import WeatherComponent from '../components/GenericAPIComponents/WeatherComponent';
import dynamic from 'next/dynamic';
const DailyEnergyUsage = dynamic(() => import('../components/EnergyCharts/DailyEnergyUsage'), { ssr: false });
const MonthlyEnergyUsage = dynamic(() => import('../components/EnergyCharts/MonthlyEnergyUsage'), { ssr: false });
const WeeklyEnergyUsage = dynamic(() => import('../components/EnergyCharts/WeeklyEnergyUsage'), { ssr: false });
const YearlyEnergyUsage = dynamic(() => import('../components/EnergyCharts/YearlyEnergyUsage'), { ssr: false });
const AssetManagerPieChart = dynamic(() => import('n/components/HomePageComponents/AssetManagerPieChart'), { ssr: false });
import HeaderComponent from 'n/components/Header';
import axios from 'axios';


const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";

export async function getServerSideProps() {
  return { props: {} };
}

const Home: React.FC = () => {
  const [derData, setDerData] = useState<any[]>([]); // State to store DER data

  // Function to fetch DER data from the API
  const fetchDerData = async () => {
    try {
      const response = await axios.get('/api/derdata'); // Assuming this is the correct API endpoint
      setDerData(response.data); // Set the DER data in state
    } catch (error) {
      console.error('Error fetching DER data:', error);
    }
  };

  useEffect(() => {
    fetchDerData();
  }, []);
  return (
    <div className="page-layout">
      <HeaderComponent />
      <div className="top">
        <div className="left">
          <div className="left-heading">
            <Activity size="3rem" color='green' />
            <h6>DER Asset Manager</h6>
          </div>
          <AssetManagerPieChart derData ={derData}/>
        </div>
        <div className="right">
          {/* Top-right section with Tabs */}
          <div className="right-heading">
            <Activity size="3rem" color='green' />
            <h6>DER Energy Monitoring</h6>
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
            <CloudStorm size="3rem" color='green' />
            <h6>DER Weather Forecast</h6>
          </div>
          <WeatherComponent latitude={-33.833} longitude={150.52808} />
        </div>
        <div className="right">
          {/* Bottom-right section (Google Maps) */}
          <div className="right-heading">
            <Map2 size="3rem" color='green' />
            <h6>DER Maps</h6>
          </div>
          <GoogleMapComponent
        center={{ lat: -37.72135400149699, lng: 145.57058723375837 }}
        zoom={19} // Default zoom level
      />
        </div>
      </div>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px" alt="Swanforesight Logo" /></p>
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
        .footer {
          text-align: center;
          padding: 8px;
          background-color: #f5f5f5; /* Add a background color to the footer */
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




