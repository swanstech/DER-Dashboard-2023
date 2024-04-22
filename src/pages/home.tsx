import React, { useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import { Activity, CloudStorm, Map2 } from 'tabler-icons-react';
import GoogleMapComponent from '../components/GenericAPIComponents/GoogleMapsComponent';
import WeatherComponent from '../components/GenericAPIComponents/WeatherComponent';
import DailyEnergyUsage from '../components/EnergyCharts/DailyEnergyUsage';
import MonthlyEnergyUsage from '../components/EnergyCharts/MonthlyEnergyUsage';
import WeeklyEnergyUsage from '../components/EnergyCharts/WeeklyEnergyUsage';
import YearlyEnergyUsage from '../components/EnergyCharts/YearlyEnergyUsage';
import AssetManagerPieChart from 'n/components/HomePageComponents/AssetManagerPieChart';
import UserMenu from '../components/UserMenu';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';
import HeaderComponent from 'n/components/Header';
import { IconLogin } from '@tabler/icons-react';
import axios from 'axios';


const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";

const Home: React.FC = () => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);
  const [keycloakInstance, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);
  let lastUserActivityTimestamp = Date.now();
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

  // Update the user activity timestamp whenever there is user interaction
  const updateUserActivityTimestamp = () => {
    lastUserActivityTimestamp = Date.now();
  };

  useEffect(() => {

    document.addEventListener("mousemove", updateUserActivityTimestamp);
    document.addEventListener("keydown", updateUserActivityTimestamp);
    fetchDerData();

    const initializeKeycloak = async () => {
      try {
        // Initialize Keycloak
        const keycloak = initKeycloak();


        if (!keycloak) {
          console.error('Keycloak object is null');
          return;
        }

        await keycloak.init({ onLoad: 'check-sso' });

        if (!keycloak.authenticated) {
          // If not authenticated, redirect to Keycloak login
          keycloak.login({ redirectUri: window.location.origin + router.pathname });
        } else {
          // Extract user roles from the Keycloak token
          const roles = keycloak.tokenParsed?.realm_access?.roles || [];
          setUserRoles(roles);
          setKeycloak(keycloak);
          // Extract user profile information

          const fullName = keycloak.tokenParsed?.name || "";
          const email = keycloak.tokenParsed?.email || "";
          setUserProfile({ fullName, email });
          if (roles.includes('Engineer') || roles.includes('General Manager') || roles.includes("Auditor") || roles.includes("Security Admin")) {
            // User is authenticated
            setIsAuth(true);

            // You can now use the roles as needed
            console.log('User roles:', roles);
            // Redirect to Keycloak login every 10 minutes
            const inactivityCheckInterval = setInterval(() => {
              const currentTime = Date.now();
              const inactiveDuration = currentTime - lastUserActivityTimestamp;

              // Set the inactivity timeout to 10 minutes (10 * 60 * 1000 milliseconds)
              const inactivityTimeout = 10 * 60 * 1000;

              if (inactiveDuration >= inactivityTimeout) {
                // If the user has been inactive for more than 10 minutes, log them out
                keycloak.logout();
                clearInterval(inactivityCheckInterval); // Stop checking for inactivity
              }
            }, 60 * 1000);

            // Cleanup function to clear the interval when the component is unmounted
            return () => {
              document.removeEventListener("mousemove", updateUserActivityTimestamp);
              document.removeEventListener("keydown", updateUserActivityTimestamp);
              clearInterval(inactivityCheckInterval);
            };
          }
          console.log('User roles:', roles);

        }

      }
      catch (error) {
        console.error('Keycloak initialization error:', error);
        // Handle the error appropriately 
      }

    }
    initializeKeycloak();
  }, []);
 
  if (!isAuth) {
    return (
      <><div className="page-layout">
        <HeaderComponent
          userRoles={userRoles}
          userProfile={userProfile}
          keycloakInstance={keycloakInstance} />
        <div className="auth-error-message">
          <p>You are not authenticated.</p>
          <p>You do not have the required role to access this page.</p>
          <p>Pls Login with the correct role by clicking on the <IconLogin size={45} /> icon at the right hand side of the Header.</p>
        </div>
      </div>
        <style jsx>{`

.page-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50vh; /* full height of the viewport */
  padding: 8px;
  box-sizing: border-box;
}
  .auth-error-message {
    text-align: center;
    margin: auto;
    max-width: 400px;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f8d7da;
    color: #721c24;
  }
`}</style></>
    );
  }
  return (
    <div className="page-layout">
      {/* Pass userRoles to MainLinks component */}

      <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />
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
        {/* Pass userRoles and userProfile to UserMenu */}
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




