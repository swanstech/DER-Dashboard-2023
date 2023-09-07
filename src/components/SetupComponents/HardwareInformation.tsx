// Importing required dependencies and components
import React, { useState, useEffect } from 'react';
import { Table } from '@mantine/core';

// Declare interfaces for types
interface DeviceData {
  device_id?: number;
  nameplate_id?: number;
  device_name?: string;
  device_model_number?: string;
  device_location?: string;
}

interface HardwareData {
  data: Array<{[key: string]: [number, number, string, string, string, string]}>;
}

// Main function component
export default function HardwareInfoTable() {
  // Using React Hooks to manage state
  const [HardwareData, setHardwareData] = useState<HardwareData | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const deviceId = "1";  // Placeholder for actual device ID

  // Fetching data with useEffect (Runs when the component mounts)
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetching data from the API
        const response = await fetch('/api/deviceInfo');
        
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
          setHardwareData(parsedData);
        } else {
          // If no parsing is needed, set rawData directly
          setHardwareData(rawData);
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
    if (HardwareData && HardwareData.data) {
      const filtered = HardwareData.data.filter(item => {
        const rowData = Object.values(item)[0];
        
        // Type checking and casting
        if (rowData) {
          const typedRowData = rowData as [number, number, string, string, string, string];
          return typedRowData[1] === parseInt(deviceId, 10);
        }
        return false;
      });
      
      // Updating the deviceData state based on filtered data
      if (filtered.length > 0) {
        const firstFilteredItem = filtered[0];
        const rowData = firstFilteredItem ? Object.values(firstFilteredItem)[0] : null;
      
        if (rowData) {
          const [device_id, nameplate_id, device_name, device_model_number, device_location] = rowData as [number, number, string, string, string, string];
          setDeviceData({
            nameplate_id: nameplate_id,
            device_name: device_name,
            device_model_number: device_model_number,
            device_location: device_location,
          });
        }
      }
    }
  }, [HardwareData]); // Re-run when HardwareData changes

  // Preparing table rows
  const rows = deviceData ? [
    ["Nameplate ID", deviceData.nameplate_id],
    ["Device Name", deviceData.device_name],
    ["Device Model Number", deviceData.device_model_number],
    ["Device Location", deviceData.device_location],
  ].map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  )) : null;

  // Return JSX for rendering
  return (
    <Table>
      <tbody>{rows}</tbody>
    </Table>
  );
}














