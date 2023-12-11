import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
const API_KEY = process.env.API_KEY || "";

type DERData = {
  der_id: string;
  der_name: string;
  der_type: string;
  manufacturer_id: string;
  manufacturer_serial_number: string;
  manufacture_date: string;
  manufacturer_info: string;
  manufacturer_model_number: string;
  manufacturer_hw_version: string;
  sw_version: string;
  sw_activation_date: string;
  location: string;
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString();
};

const getColorForDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
  
  if (date < currentDate) return 'red';
  if (date < threeMonthsAgo) return 'amber';
  return '';
};

const styles = {
    red: {
      color: 'red',
    },
    amber: {
      color: 'orange',
    },
  };

export const DERTable: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<DERData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/deviceInfo', {
          headers: {'x-api-key': API_KEY}
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
      <td>
        <Link
          href={{
            pathname: '/settings',
            query: {
              derId: row.der_id,
            },
          }}
          passHref
        >
          <span onClick={() => router.push(`/settings?derId=${row.der_id}`)}>{row.der_id}</span>
        </Link>
      </td>
      <td>
        <Link
          href={{
            pathname: '/security-ops-monitoring',
            query: {
              derId: row.der_id,
            },
          }}
          passHref
        >
          <span onClick={() => router.push(`/security-ops-monitoring?derId=${row.der_id}`)}>{row.der_name}</span>
        </Link>
      </td>
      <td>{row.der_type}</td>
      <td>{row.manufacturer_id}</td>
      <td>{row.manufacturer_serial_number}</td>
      <td>{formatDate(row.manufacture_date)}</td>
      <td>{row.manufacturer_hw_version}</td>
      <td>{row.manufacturer_info}</td>
      <td>{row.manufacturer_model_number}</td>
      <td style={{ color: getColorForDate(row.sw_activation_date) }}>
        {formatDate(row.sw_activation_date)}
      </td>
      <td>{row.sw_version}</td>
      <td>{row.location}</td>
    </tr>
  ));

  return (
    <Table width={700}>
      <thead>
        <tr>
          <th>DER ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Manufacturer ID</th>
          <th>Serial Number</th>
          <th>Manufacture Date</th>
          <th>HW Version</th>
          <th>Manufacturer Info</th>
          <th>Model Number</th>
          <th>SW Activation Date</th>
          <th>SW Version</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default DERTable;
