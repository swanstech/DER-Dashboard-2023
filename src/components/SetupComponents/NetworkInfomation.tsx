import React, { useState, useEffect } from 'react';
import { Table } from '@mantine/core';

interface NetworkStatus {
  netstat_id: string;
  der_id: string;
  ip_address: string;
  mac_address: string;
  network_name: string;
  port_number: number;
  connection_type: string;
}

export default function NetworkInfoTable() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);

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

        // Assuming we're taking the first item in the array
        if (parsedData.data.length > 0) {
          const firstItemData = parsedData.data[0].row0;
          setNetworkStatus({
            netstat_id: firstItemData[0],
            der_id: firstItemData[1],
            ip_address: firstItemData[2],
            mac_address: firstItemData[3],
            network_name: firstItemData[4],
            port_number: firstItemData[5],
            connection_type: firstItemData[6]
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const rows = networkStatus ? Object.entries(networkStatus).map(([key, value]) => (
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
