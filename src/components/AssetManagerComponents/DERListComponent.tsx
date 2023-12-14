import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from '@mantine/core';
import Link from 'next/link';
import router, { useRouter } from 'next/router';

const API_KEY = process.env.API_KEY || "";

type DERData = {
  der_id: string;
  der_name: string;
  der_type: string;
  manufacture_date: string;
  manufacturer_info: string;
  manufacturer_model_number: string;
  manufacturer_hw_version: string;
  location: string;
  operationalStatus: 'up' | 'down' | 'amber';
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString();
};

const handleStatusClick = (derId: string) => {
  router.push(`/security-ops-monitoring?derId=${derId}`);
};

const handleRowClick = (derId: string) => {
  router.push(`/settings?derId=${derId}`);
};

const getColorForDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  
  if (date < threeMonthsAgo) return 'red';
  if (date >= threeMonthsAgo && date <= currentDate) return 'orange';
  return 'green';
};

const getRandomOperationalStatus = (): 'up' | 'down' | 'amber' => {
  const statuses: ('up' | 'down' | 'amber')[] = ['up', 'down', 'amber'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const OperationalStatusIcon: React.FC<{ status: 'up' | 'down' | 'amber', onClick: () => void }> = ({ status, onClick }) => {
  const style = {
    cursor: 'pointer',
    color: status === 'up' ? 'green' : status === 'down' ? 'red' : 'orange'
  };

  const symbol = status === 'up' ? '↑' : status === 'down' ? '↓' : '●';

  return <span style={style} onClick={onClick}>{symbol}</span>;
};

export const DERTable: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<DERData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/deviceInfo', {
          headers: { 'x-api-key': API_KEY }
        });

        const processedData = response.data.data.map((item: any) => {
          const values = Object.values(item)[0];
          return {
            der_id: values[0],
            der_name: values[1],
            der_type: values[2],
            manufacturer_id: values[3],
            manufacturer_serial_number: values[4],
            manufacture_date: values[5],
            manufacturer_info: values[6],
            manufacturer_model_number: values[7],
            manufacturer_hw_version: values[8],
            sw_version: values[9],
            sw_activation_date: values[10],
            location: values[11],
            operationalStatus: getRandomOperationalStatus(),
          };
        });

        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const rows = data.map((row) => (
    <tr key={row.der_id}>
      <td style={{ cursor: 'pointer' }} onClick={() => handleRowClick(row.der_id)}>
        {row.der_id}
      </td>
      <td>
        <Link
          href={{
            pathname: '/pentetration-testing',
            query: {
              derId: row.der_id,
            },
          }}
          passHref
        >
          <span onClick={() => router.push(`/pentetration-testing?derId=${row.der_id}`)}>{row.der_name}</span>
        </Link>
      </td>
      <td>{row.der_type}</td>
      <td>{formatDate(row.manufacture_date)}</td>
      <td>{row.manufacturer_info}</td>
      <td>{row.manufacturer_model_number}</td>
      <td>{row.manufacturer_hw_version}</td>
      <td>{row.location}</td>
      <td>
        <OperationalStatusIcon status={row.operationalStatus} onClick={() => handleStatusClick(row.der_id)} />
      </td>
    </tr>
  ));

  return (
    <Table width={700} style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
          <th>DER ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Manufacture Date</th>
          <th>Manufacturer Info</th>
          <th>Model Number</th>
          <th>HW Version</th>
          <th>Location</th>
          <th>Operational Status</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Table>
  );
};

export default DERTable;