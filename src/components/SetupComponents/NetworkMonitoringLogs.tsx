import React from 'react';
import { useMantineTheme, rem } from '@mantine/core';
import { Tool, Apps } from 'tabler-icons-react';

// Assume these are your data values
const rowsData = [
  {
    sourceIP: '192.168.1.1',
    destinationIP: '192.168.1.2',
    sourcePort: '12345',
    destinationPort: '54321',
    protocol: 'TCP',
    data: 'Lorem ipsum',
    timeStamp: '2023-12-05 12:34:56',
  },
  {
    sourceIP: '192.168.2.1',
    destinationIP: '192.168.2.2',
    sourcePort: '54321',
    destinationPort: '12345',
    protocol: 'UDP',
    data: 'Dolor sit amet',
    timeStamp: '2023-12-05 13:45:00',
  },
];

export default function NetworkMonitoringLogs() {
  const theme = useMantineTheme();
  const getColor = (color) => {
    return theme.colors?.[color]?.[theme.colorScheme === 'dark' ? 5 : 7] ?? 'inherit';
  };

  return (
    <div style={{ marginTop: '-250px' }}>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Source IP</th>
              <th>Destination IP</th>
              <th>Source Port</th>
              <th>Destination Port</th>
              <th>Protocol</th>
              <th>Data</th>
              <th>TimeStamp</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowData.sourceIP}</td>
                <td>{rowData.destinationIP}</td>
                <td>{rowData.sourcePort}</td>
                <td>{rowData.destinationPort}</td>
                <td>{rowData.protocol}</td>
                <td>{rowData.data}</td>
                <td>{rowData.timeStamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
