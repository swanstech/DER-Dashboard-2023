import VoltageInformation from 'n/components/VoltageDataComponents/VoltageInfoComponent';
import React from 'react';
import { BatteryAutomotive, ChartCandle, Activity } from 'tabler-icons-react';
import InverterCommandCenter from '../components/CommandCenterComponents/CommandCenter';
import InformationAccordion from '../components/SetupComponents/DerTechnicalSpecifications';
import DerCompliance from 'n/components/SetupComponents/DerCompliance';
import NetworkMonitoringLogs from 'n/components/SetupComponents/NetworkMonitoringLogs';

export default function Settings() {
  return (
    <div className="page-layout">
      <div className="top">
        <div className="left">
          <div className="left-heading">
            <BatteryAutomotive size="3rem" color='green' />
            <h3>DER Technical Specifications</h3>
          </div>
          <InformationAccordion />
        </div>
        <div className="right">
          <div className="right-heading">
            <Activity size="3rem" color='green' />
            <h3>Compliance Specifications</h3>
          </div>
          <DerCompliance />
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-heading">
          <ChartCandle size="3rem" color='green' />
          <h2>Network Monitoring and logs</h2>
        </div>
        <div className='bottom-b'>
          <NetworkMonitoringLogs />
        </div>
      </div>
      <style jsx>{`
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
