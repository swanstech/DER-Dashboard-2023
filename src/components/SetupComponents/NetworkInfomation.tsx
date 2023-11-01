import React, { useState, useEffect } from 'react';
import { Table } from '@mantine/core';

interface DeviceData {
  status?: boolean;
  nic_id?: number;
  connectionType?: string;
  macaddress?: string;
  ipaddress?: string;
}

interface NetworkData {
  data: Array<{[key: string]: [number, number, string, string, string, string]}>;
}

export default function NetworkInfoTable() {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const deviceId = "1"; // Replace with the actual method you are using to retrieve the device_id

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/networkInfo');
        if (!response.ok) {
          console.error("HTTP error", response.status);
          return;
        }
        const rawData = await response.json();
        const parsedData = JSON.parse(rawData.body);  // Parsing the 'body' string to JSON
        setNetworkData(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  

  useEffect(() => {
    if (networkData && networkData.data) {
      console.log(networkData.data);
      const filtered = networkData.data.filter(item => {
        const rowData = Object.values(item)[0];
        if (rowData === undefined) {
          return false; // Skip this iteration if rowData is undefined
        }
        // Now TypeScript knows rowData is not undefined, and you can cast it to the desired type
        const typedRowData = rowData as [number, number, string, string, string, string];
        return typedRowData && typedRowData[1] === parseInt(deviceId, 10);
      });
  
      if (filtered.length > 0) {
        const firstFilteredItem = filtered[0];
        const rowData = firstFilteredItem ? Object.values(firstFilteredItem)[0] : null;
  
        if (rowData) {
          const [_, device_id, location, mac_address, connection, ip_address] = rowData as [number, number, string, string, string, string];
          setDeviceData({
            status: true, // Assuming it means 'connected'
            nic_id: device_id,
            connectionType: connection,
            macaddress: mac_address,
            ipaddress: ip_address,
          });
        }
      }
    }
  }, [networkData]);
  
  

  const rows = deviceData ? [
    ['Network ID', deviceData.nic_id],
    ['Connection Type', deviceData.connectionType],
    ['Mac Address', deviceData.macaddress],
    ['Network Address', deviceData.ipaddress],
  ].map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  )) : null;

  return (
    <Table>
      <tbody>{rows}</tbody>
    </Table>
  );
}
