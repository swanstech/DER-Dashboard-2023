import VoltageInformation from 'n/components/VoltageDataComponents/VoltageInfoComponent';
import React from 'react';
import {BatteryAutomotive, ChartCandle, Activity} from 'tabler-icons-react';
import InverterCommandCenter from '../components/CommandCenterComponents/CommandCenter';
import InformationAccordion from '../components/SetupComponents/DeviceInformation';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();
  const { derId } = router.query;
  return (
    <div className="page-layout">
      <div className="top">
        <div className="left">
          <div className="left-heading"> 
            <BatteryAutomotive size="3rem" color='green'/>
            <h2>DER Information</h2>
          </div>
          <InformationAccordion derId={derId} />
        </div>
        <div className="right">
        <div className="right-heading"> 
            <Activity size="3rem" color='green'/>
            <h3>DER Critical Points</h3>
          </div>
          <VoltageInformation/>
        </div>
        <div className="logo-container">
          <img src="/path/to/smart-energy-lab-logo.png" alt="Smart Energy Lab Logo" />
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-heading"> 
          <ChartCandle size="3rem" color='green'/>
          <h2>Command Centre</h2>
        </div>
        <InverterCommandCenter/>
      </div>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" alt="Swanforesight Logo" /></p>
      </div>
      <style jsx>{`
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
