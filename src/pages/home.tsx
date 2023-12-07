import React from 'react';
import { Container, Paper, Box, Button, Title, Text } from '@mantine/core';
import { Activity, CloudStorm, Map2, ChartBar } from 'tabler-icons-react';
import WeatherComponent from '../components/GenericAPIComponents/WeatherComponent';
import EnergyMonitoringChart from '../components/EnergyCharts/DailyEnergyUsage'; // Your energy monitoring chart component
import GoogleMapComponent from '../components/GenericAPIComponents/GoogleMapsComponent'; // Your Google Maps component

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

const Home: React.FC = () => {
  return (
    <div className="page-layout">
      {/* Grid Layout */}
      <div className="grid-layout">
        {/* Energy Monitoring Card */}
        <Paper className="card energy-monitoring-card" shadow="sm" p="md">
          <Box className="card-header">
            <Activity size="3rem" color='green'/>
            <Title order={3} className="card-title">Energy Monitoring</Title>
          </Box>
          <EnergyMonitoringChart />
          <Button variant="outline" color="green" component="a" href="/energy-monitoring">
            View Details
          </Button>
        </Paper>

        {/* System Analytics Card */}
        <Paper className="card system-analytics-card" shadow="sm" p="md">
          <Box className="card-header">
            <ChartBar size="3rem" color='green'/>
            <Title order={3} className="card-title">System Analytics</Title>
          </Box>
          
          <Button variant="outline" color="green" component="a" href="/analytics">
            View Details
          </Button>
        </Paper>

        {/* Weather Forecast Card */}
        <Paper className="card weather-forecast-card" shadow="sm" p="md">
          <Box className="card-header">
            <CloudStorm size="3rem" color='green'/>
            <Title order={3} className="card-title">Weather Forecast</Title>
          </Box>
          <WeatherComponent latitude={-33.833} longitude={150.52808} />
        </Paper>

        {/* Google Maps Card */}
        <Paper className="card google-maps-card" shadow="sm" p="md">
          <Box className="card-header">
            <Map2 size="3rem" color='green'/>
            <Title order={3} className="card-title">Google Maps</Title>
          </Box>
          <GoogleMapComponent
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={10}
            googleMapsApiKey={googleMapsApiKey}
            markers={[{ lat: 37.7749, lng: -122.4194, label: 'A' }]}
          />
        </Paper>
      </div>

      {/* Styles */}
      <style jsx>{`
        .page-layout {
          height: 100vh;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* Two columns */
          grid-gap: 16px;
          padding: 16px;
          height: 100%;
        }
        .card {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          height: calc(50vh - 20px); /* 50% of the viewport height minus gap */
          box-sizing: border-box;
        }
        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-left: 8px;
        }
        .energy-monitoring-card, .system-analytics-card {
          grid-column: span 2; /* Make these cards span two columns */
        }
      `}</style>
    </div>
  );
}

export default Home;
