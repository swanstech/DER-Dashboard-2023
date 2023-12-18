import VoltageInformation from 'n/components/VoltageDataComponents/VoltageInfoComponent';
import React from 'react';
import { BatteryAutomotive, Bolt, ChartCandle, FileAnalytics } from 'tabler-icons-react';
import InverterCommandCenter from '../components/CommandCenterComponents/CommandCenter';
import TechnicalSpecifications from '../components/SetupComponents/TechnicalSpecifications';
import NetworkMonitoringLogs from 'n/components/SetupComponents/NetworkMonitoringLogs';
import ComplianceInfoTable from 'n/components/SetupComponents/ComplianceInformation';
import { useRouter } from 'next/router';
import PenTest from 'n/components/PenetrationTestingComponent/penTest';

export default function penetrationTesting() {
  const router = useRouter();
  const { derId } = router.query;
  return (
    <div className="page-layout">
      <div className="top">
        <div className="left">
          <div className="left-heading">
            <Bolt size="3rem" color='green' />
            <h3>Scope for Penetration Testing and Vulnerability Scanning  </h3>
          </div>
          <PenTest derId={derId ? (derId as string) : 'DER_1'} />
        </div>
       
      </div>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg"  width="70px" height="60px" alt="./Swanforesight Logo" /></p>
      </div>
      <style jsx>{`
        .page-layout {
          display: flex;
          flex-direction: column;
          justify-content: space-between;a
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
      `}</style>
    </div>
  );
}
