import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const derId = router.query.derId || 'DER_1'; // Get der_id from the URL
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/networkInfo?derId=${derId}`);
        if (!response.ok) {
          console.error("HTTP error", response.status);
          return;
        }
        const rawData = await response.json();
        const parsedData = JSON.parse(rawData.body); // Parsing the 'body' string to JSON

        // Filter data based on der_id
        const filteredData = parsedData.data.find(item => item.row0[1] === derId);
        if (filteredData) {
          setNetworkStatus({
            netstat_id: filteredData.row0[0],
            der_id: filteredData.row0[1],
            ip_address: filteredData.row0[2],
            mac_address: filteredData.row0[3],
            network_name: filteredData.row0[4],
            port_number: filteredData.row0[5],
            connection_type: filteredData.row0[6]
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (derId) {
      fetchData();
    }
  }, [derId]); // Dependency array includes derId to re-fetch when it changes

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
