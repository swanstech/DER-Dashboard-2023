import React, { useEffect, useState } from 'react';
import { BatteryAutomotive, ChartCandle, Activity } from 'tabler-icons-react';
import VoltageInformation from 'n/components/VoltageDataComponents/VoltageInfoComponent';
import InverterCommandCenter from '../components/CommandCenterComponents/CommandCenter';
import InformationAccordion from '../components/SetupComponents/DeviceInformation';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';
import HeaderComponent from 'n/components/Header';
import { IconLogin } from '@tabler/icons-react';

export default function Settings() {
  const router = useRouter();
  const { derId } = router.query;
  const [isAuth, setIsAuth] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);
  const [keycloakInstance, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);

  useEffect(() => {
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
          if (roles.includes('Engineer') || roles.includes("Auditor") || roles.includes("Security Admin") || roles.includes("General Manager")) {

            // Extract user profile information
            const fullName = keycloak.tokenParsed?.name || "";
            const email = keycloak.tokenParsed?.email || "";
            setUserProfile({ fullName, email });
            // User is authenticated
            setIsAuth(true);
            // You can now use the roles as needed
            console.log('User roles:', roles);
             // Redirect to Keycloak login every 10 minutes
             const redirectInterval = setInterval(() => {
              keycloak.logout(); // Logout and redirect to login page
            }, 10 * 60 * 1000);

            // Cleanup function to clear the interval when the component is unmounted
            return () => clearInterval(redirectInterval);
          }
          console.log('User roles:', roles);
        }
      } catch (error) {
        console.error('Keycloak initialization error:', error);
        // Handle the error appropriately 
      }
    };

    initializeKeycloak();
  }, [router]);

  if (!isAuth ) {
    return (
      <><div className="page-layout">
        <HeaderComponent
          userRoles={userRoles}
          userProfile={userProfile}
          keycloakInstance={keycloakInstance} />
        <div className="auth-error-message">
          <p>You are not authenticated.</p>
          <p>You do not have the required role to access this page.</p>
          <p>Pls Logout and login with the correct role by clicking on the <IconLogin size={45} /> icon at the right hand side of the Header.</p>
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
      <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance}/>
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
        <InverterCommandCenter />
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
