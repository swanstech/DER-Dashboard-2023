import React from 'react';
import { Container, Paper } from '@mantine/core';
import GoogleMapComponent from '../components/GenericAPIComponents/GoogleMapsComponent';
import { Activity, CloudStorm, Map2 } from 'tabler-icons-react';
import WeatherComponent from 'n/components/GenericAPIComponents/WeatherComponent';

const googleMapsApiKey: string = "AIzaSyBUDint2L3vIZI9juEw2ecSG37Frt5aT24" || "";  

const Home: React.FC = () => {
  return (
    <div className="page-layout">
      <div className="top">
        <div className="left">
          {/* Top-left section (Blank for now) */}
          <div className="left-heading">
            <Activity size="3rem" color='green'/>
            <h6>Placeholder Title</h6>
          </div>
        </div>
        <div className="right">
          {/* Top-right section (Blank for now) */}
          <div className="right-heading">
            <Activity size="3rem" color='green'/>
            <h6>Placeholder Title</h6>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          {/* Bottom-left section (BOM API data) */}
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
        .left-heading, .right-heading {
          display: flex;
          align-items: center;
          font-size: 24px;
          color: #555555;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}

export default Home;
