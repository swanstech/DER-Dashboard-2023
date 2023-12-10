// Importing required dependencies and components
import React, { useState, useEffect } from 'react';
import { Table } from '@mantine/core';
import ExpiredNotification from '../UtilComponents/ExpiredNotification';
import CloseExpiryNotification from '../UtilComponents/CloseExpiryNotification';

import { checkDateStatus } from '../../utils/expDateUtils';
import { FileAnalytics } from 'tabler-icons-react';



// Declare interfaces for types
interface DeviceData {
  device_id?: number;
  device_security_id?: number;
  device_security_certificate_number?: string;
  device_security_certificate_expdate?: Date;
}

interface ComplianceData {
  data: Array<{[key: string]: [number, number, string, Date]}>;
}

// Main function component
export default function ComplianceInfoTable() {
  // Using React Hooks to manage state
  const [ComplianceData, setComplianceData] = useState<ComplianceData | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isNearExpiration, setIsNearExpiration] = useState<boolean>(false);
  const deviceId = "1";  // Placeholder for actual device ID

  // Fetching data with useEffect (Runs when the component mounts)
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetching data from the API
        const response = await fetch('/api/complianceInfo');
        
        // Handling HTTP errors
        if (!response.ok) {
          console.error("HTTP error", response.status);
          return;
        }
        
        // Parsing the JSON response
        const rawData = await response.json();
        
        // Check if rawData.body is a string that needs to be parsed
        if (typeof rawData.body === 'string') {
          const parsedData = JSON.parse(rawData.body);
          setComplianceData(parsedData);
        } else {
          // If no parsing is needed, set rawData directly
          setComplianceData(rawData);
        }
      } catch (error) {
        // Handling fetch or parsing errors
        console.error("Error fetching data:", error);
      }
    }

    // Execute the fetch function
    fetchData();
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  // Filtering the fetched data based on device ID
  useEffect(() => {
    if (ComplianceData && ComplianceData.data) {
      const filtered = ComplianceData.data.filter(item => {
        const rowData = Object.values(item)[0];
        
        // Type checking and casting
        if (rowData) {
          const typedRowData = rowData as [number, number, string, Date];
          return typedRowData[1] === parseInt(deviceId, 10);
        }
        return false;
      });
      
      // Updating the deviceData state based on filtered data
      if (filtered.length > 0) {
        const firstFilteredItem = filtered[0];
        const rowData = firstFilteredItem ? Object.values(firstFilteredItem)[0] : null;
      
        if (rowData) {
          const [device_id, device_security_id, device_security_certificate_number, device_security_certificate_expdate] = rowData as [number, number, string, Date];
          setDeviceData({
            device_security_id: device_security_id,
            device_security_certificate_number: device_security_certificate_number,
            device_security_certificate_expdate: device_security_certificate_expdate,
          });
        }
      }
    }
  }, [ComplianceData]); // Re-run when ComplianceData changes


  // Check expiration status based on your utility function
  useEffect(() => {
    if (deviceData.device_security_certificate_expdate) {
      console.log(deviceData.device_security_certificate_expdate);
      const status = checkDateStatus(deviceData.device_security_certificate_expdate.toISOString());
      console.log(status);
      if (status === 'expired') {
        setIsExpired(true);
      } else if (status === 'near') {
        setIsNearExpiration(true);
      } else {
        setIsExpired(false);
        setIsNearExpiration(false);
      }
    }
  }, [deviceData]);


    // Preparing table rows
    const rows = deviceData ? [
        ['Device Security ID', deviceData.device_security_id],
        ['Device Security Certificate Number', deviceData.device_security_certificate_number],
        ['Device Security Certificate Expiration Date', deviceData.device_security_certificate_expdate],
      ].map(([key, value]) => (
        <tr key={String(key)}>
          <td>{String(key)}</td>
          <td> 
            {value instanceof Date ? value.toISOString() : value}
          </td>
        </tr>
      )) : null;

    // Return JSX for rendering
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <FileAnalytics size="1.5rem" color="violet" style={{ marginRight: '8px' }} />
                <div style={{ fontWeight: 'bold', marginRight: '8px' }}>Compliance Information</div>
            </div>
      <Table>
        <tbody>{rows}</tbody>
      </Table>

      {isExpired && <ExpiredNotification />}
      {isNearExpiration && <CloseExpiryNotification/>}

    </div>
    );
}














