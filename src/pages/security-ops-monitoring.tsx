import React, { useEffect, useState } from 'react';
import { BatteryAutomotive, ChartCandle, FileAnalytics } from 'tabler-icons-react';
import InverterCommandCenter from '../components/CommandCenterComponents/CommandCenter';
import TechnicalSpecifications from '../components/SetupComponents/TechnicalSpecifications';
import NetworkMonitoringLogs from 'n/components/SetupComponents/NetworkMonitoringLogs';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';
import HeaderComponent from 'n/components/Header';
import { IconLogin } from '@tabler/icons-react';
import ComplianceInfoTable from 'n/components/SetupComponents/ComplianceInfoTable';

export default function SecOpsMonitoring() {
  const router = useRouter();
  const { derId } = router.query;
  const [isAuth, setIsAuth] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);
  const [keycloakInstance, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);
  const [derLiveData, setDerLiveData] = useState<any[]>([]); // State to hold DER live data records
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6); // Number of records per page

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
            fetchDerLiveData();

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
        }

      }
      catch (error) {
        console.error('Keycloak initialization error:', error);
        // Handle the error appropriately 
      }

    }

    const fetchDerLiveData = async () => {
      try {
        const response = await fetch('https://a71kn6une4.execute-api.ap-southeast-2.amazonaws.com/dev/device/liveData');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDerLiveData(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    initializeKeycloak();
  }, []);

  if (!isAuth) {
    return (
      <>
        <div className="page-layout">
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
        `}</style>
      </>
    );
  }

  // Logic for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = derLiveData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(derLiveData.length / recordsPerPage);

  // Functions for pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="page-layout">
      <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />
      <div className="top">
        <div className="left">
          <div className="left-heading">
            <BatteryAutomotive size="3rem" color='green' />
            <h3>DER Technical Specifications</h3>
          </div>
          <TechnicalSpecifications derId={derId} />
        </div>
        <div className="right">
          <div className="right-heading">
            <FileAnalytics size="3rem" color='green' />
            <h3>DER Live Data Records</h3>
          </div>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && (
            <>
              <ComplianceInfoTable data={currentRecords} />
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-heading">
          <ChartCandle size="3rem" color='green' />
          <h2>Network Monitoring and logs</h2>
        </div>
        <div className='bottom-b'>
          <NetworkMonitoringLogs derId={derId ? (derId as string) : 'DER_1'} />
        </div>
        <div className="footer">
          <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px" alt="Swanforesight Logo" /></p>
        </div>
      </div>
      <style jsx>{`
        /* Your existing styles go here */
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
        .left, .right {
          flex: 0 0 40%; /* 40% width for left panel */
          margin: 8px;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
          display: flex;
          flex-direction: column;
        }
        .right {
          flex: 0 0 60%; /* 60% width for right panel */
        }
        .left-heading, .bottom-heading, .right-heading {
          display: flex;
          align-items: center;
          font-size: 24px;
          color: #555555;
          margin-bottom: 16px;
        }
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
        .pagination button {
          margin: 0 5px;
          padding: 5px 10px;
          cursor: pointer;
        }
        .pagination button.active {
          background-color: #007bff;
          color: #fff;
          border: none;
        }
      `}</style>
    </div>
  );
}
