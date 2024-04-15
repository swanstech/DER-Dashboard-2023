import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';
import { IconLogin } from '@tabler/icons-react';
import HeaderComponent from 'n/components/Header';
import { BatteryAutomotive, ChartCandle } from 'tabler-icons-react';
import { Title } from '@mantine/core';


export default function DemoEncryption() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);
  const [keycloakInstance, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);
  let lastUserActivityTimestamp = Date.now();

  // Update the user activity timestamp whenever there is user interaction
  const updateUserActivityTimestamp = () => {
    lastUserActivityTimestamp = Date.now();
  };

  useEffect(() => {
    document.addEventListener("mousemove", updateUserActivityTimestamp);
    document.addEventListener("keydown", updateUserActivityTimestamp);

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
          const roles = keycloak.tokenParsed?.realm_access?.roles || [];
          setUserRoles(roles);
          setKeycloak(keycloak);
          const fullName = keycloak.tokenParsed?.name || "";
          const email = keycloak.tokenParsed?.email || "";
          setUserProfile({ fullName, email });

          if (roles.includes('General Manager') || roles.includes('Security Admin')) {
            // User is authenticated
            setIsAuth(true);
          }
        }

      } catch (error) {
        console.error('Keycloak initialization error:', error);
        // Handle the error appropriately 
      }
    };

    initializeKeycloak();

    return () => {
      document.removeEventListener("mousemove", updateUserActivityTimestamp);
      document.removeEventListener("keydown", updateUserActivityTimestamp);
    };

  }, []);

  const handleStartEncryption = () => {
    // Handle start encryption logic
  };

  const handleSave = () => {
    // Handle save logic
  };

  if (!isAuth) {
    return (
      <div className="page-layout">
        <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />
        <div className="auth-error-message">
          <p>You are not authenticated.</p>
          <p>You do not have the required role to access this page.</p>
          <p>Please login with the correct role by clicking on the <IconLogin size={45} /> icon at the right hand side of the Header.</p>
        </div>
      </div>
    );
  }

  return (
    <><Title order={1} align="center" mb={20}>
    <ChartCandle size="2.5rem" color='green' />Demo Encryption
  </Title>
    <div className="page-layout">
          <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />
          <div className="top">
              <div className="left">
                  <div className="start-reading">
                      <h2>Start Reading</h2>
                      <textarea placeholder="Enter text to read..." rows={20}></textarea>
                      <button onClick={handleStartEncryption}>Start</button>

                  </div>
              </div>
              <div className="right">
                  <div className="encryption">
                      <h2>Encrypt</h2>
                      <textarea placeholder="Enter text to encrypt..." rows={20}></textarea>
                      <button onClick={handleStartEncryption}>Encrypt</button>

                      <button onClick={handleStartEncryption}>Save</button>
                  </div>
              </div>
          </div>
          <div className="bottom">
              {/* <div className="bottom-heading">
      <h2>Save</h2>
    </div>
    <div className='bottom-b'>
      <button onClick={handleSave}>Save</button>
    </div> */}

              <div className="footer">
                  <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px" alt="Swanforesight Logo" /></p>
              </div>
          </div>
          <style jsx>{`
        /* Your existing styles go here */

        /* Styles for Start Reading and Encrypt sections */
        .start-reading, .encryption {
          margin-bottom: 20px;
        }

        .start-reading textarea, .encryption textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          resize: vertical;
        }

        .start-reading h2, .encryption h2 {
          margin-bottom: 10px;
          color: #333;
        }

        .start-reading button, .encryption button {
          display: block;
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .start-reading button:hover, .encryption button:hover {
          background-color: #0056b3;
        }
        .page-layout {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;
                      height: 100vh; /* full height of the viewport */
                      padding: 8px;
                      box-sizing: border-box;
                    }
                    .footer {
                      text-align: center;
                      padding: 8px;
                      background-color: #f5f5f5; /* Add a background color to the footer */
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
                    .bottom-b{
                      margin: 2px;
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

        /* End of Start Reading and Encrypt section styles */
      `}</style>
      </div></>
  );
}


