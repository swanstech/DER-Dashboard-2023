import React, { useEffect, useState } from 'react';
import { BatteryAutomotive, ChartCandle, Activity } from 'tabler-icons-react';
import VoltageInformation from 'n/components/VoltageDataComponents/VoltageInfoComponent';
import InverterCommandCenter from '../components/CommandCenterComponents/CommandCenter';
import InformationAccordion from '../components/SetupComponents/DeviceInformation';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';
import HeaderComponent from 'n/components/Header';
import { IconLogin } from '@tabler/icons-react';
import axios from 'axios';



export default function Settings() {
  const router = useRouter();
  const { derId } = router.query;
  const [isAuth, setIsAuth] = useState(false);
  const [userRolesList, setUserRoles] = useState<string[]>([]);
  const [scopesArrayList, setScopes] = useState<string[]>([]);
  const [userProfileName, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);
  const [keycloakInstanceObject, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);
  let lastUserActivityTimestamp = Date.now();

  // Update the user activity timestamp whenever there is user interaction
  const updateUserActivityTimestamp = () => {
    lastUserActivityTimestamp = Date.now();
  };
  useEffect(() => {

    document.addEventListener("mousemove", updateUserActivityTimestamp);
    document.addEventListener("keydown", updateUserActivityTimestamp);
    // const refreshToken = async (keycloak: Keycloak.KeycloakInstance) => {
    //   try {
    //     const isSessionActive = !keycloak.isTokenExpired(5); // Check if the session is active for the next 5 seconds

    //     if (isSessionActive) {
    //       await keycloak.updateToken(5); // 5 seconds before the token expires
    //       const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    //       setUserRoles(roles);

    //       // You can update user profile or take other actions if needed

    //       console.log('Token refreshed successfully.');
    //     }
    //   } catch (error) {
    //     console.error('Error refreshing token:', error);
    //     // Handle the error appropriately, e.g., redirect to login
    //   }
    // };
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
          const fullName = keycloak.tokenParsed?.name || "";
          const email = keycloak.tokenParsed?.email || "";
          setUserProfile({ fullName, email });
          if (roles.includes('Engineer') || roles.includes('General Manager')) {

            // Extract user profile information
            // User is authenticated
            setIsAuth(true);

            // Make API call to your backend api with access token
            
            try {
              const response = await axios.post('/api/settings', {
                // other request data
              }, {
                headers: {
                  'Authorization': `Bearer ${keycloak.token}`
                }
              });
              console.log("called");
              console.log('API Response:', response.data);
              // Assuming response.data is an array of objects with 'scopes' property
              let scopesArray = response.data
                .map(item => item.scopes.map(scope => scope.replace('scopes:', '')))
                .flat();
              setScopes(scopesArray);

              // Now, scopesArray contains all the scopes from the response.data array
              console.log('All Scopes:', scopesArray);

              // Do something with the API response
            } catch (apiError) {
              console.error('API Error:', apiError);
              // Handle API error appropriately
            }
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
          userRoles={userRolesList}
          userProfile={userProfileName}
          keycloakInstance={keycloakInstanceObject} />
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
      <HeaderComponent userRoles={userRolesList} userProfile={userProfileName} keycloakInstance={keycloakInstanceObject} />
      <div className="top">
        <div className="left">
          <div className="left-heading">
            <BatteryAutomotive size="3rem" color='green' />
            <h2>DER Information</h2>
          </div>
          <InformationAccordion derId={derId} />
        </div>
        <div className="right">
          <div className="right-heading">
            <Activity size="3rem" color='green' />
            <h3>DER Critical Points</h3>
          </div>
          <VoltageInformation />
        </div>
        <div className="logo-container">
          <img src="/path/to/smart-energy-lab-logo.png" alt="Smart Energy Lab Logo" />
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-heading">
          <ChartCandle size="3rem" color='green' />
          <h2>Command Centre</h2>
        </div>
        <InverterCommandCenter scopesArray={scopesArrayList} />
      </div>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px" alt="Swanforesight Logo" /></p>
      </div>
      <style jsx>{`
        /* Your existing styles go here */
        .logo-container {
          margin-right: 16px;
          align-self: center;
        }
        .footer {
          text-align: center;
          padding: 8px;
          background-color: #f5f5f5; /* Add a background color to the footer */
        }
        .page-layout {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100vh; /* full height of the viewport */
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
          flex-direction: column;
          flex: 1;
          padding: 2px;
          justify-content: space-between;
        }
        .left, .right {
          flex: 1;
          margin: 8px;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
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
    </div>
  );
}
