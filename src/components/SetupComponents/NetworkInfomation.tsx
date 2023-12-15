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
  const derId = router.query.derId; // Get der_id from the URL
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
        const parsedData = JSON.parse(rawData.body); // Parsing the 'body' string to JSON

        const allRows = parsedData.data.flatMap(item => Object.values(item));
        const matchedRow = allRows.find(row => row[1] === derId);

        if (matchedRow) {
          setNetworkStatus({
            netstat_id: matchedRow[0],
            der_id: matchedRow[1],
            ip_address: matchedRow[2],
            mac_address: matchedRow[3],
            network_name: matchedRow[4],
            port_number: matchedRow[5],
            connection_type: matchedRow[6]
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (derId) {
      fetchData();
    }
  }, [derId]);

  // Prepare table rows from networkStatus
  const rows = networkStatus ? [
    ['Netstat ID', networkStatus.netstat_id],
    ['DER ID', networkStatus.der_id],
    ['IP Address', networkStatus.ip_address],
    ['MAC Address', networkStatus.mac_address],
    ['Network Name', networkStatus.network_name],
    ['Port Number', networkStatus.port_number],
    ['Connection Type', networkStatus.connection_type],
  ].map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  )) : null;

  return (
    <div>
      <Table>
        <tbody>{rows}</tbody>
      </Table>
      {!networkStatus && <p>No network data available for the specified DER ID.</p>}
    </div>
  );
}
