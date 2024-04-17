import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from '@mantine/core';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { AuthContext } from 'n/contexts/AuthContext';
import { isGeneratorFunction } from 'util/types';
import AssetManagerPieChart from '../HomePageComponents/AssetManagerPieChart';
import Home from 'n/pages/home';

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

const getRandomLastScanTime = (): string => {
  const date = new Date();
  const randomDays = Math.floor(Math.random() * 30);
  date.setDate(date.getDate() - randomDays);
  return date.toLocaleDateString();
}

const handleStatusClick = (derId: string) => {
  router.push({
    pathname: '/security-ops-monitoring',
    query: { derId: derId },
  });

  
};

const handleRowClick = (derId: string) => {
  router.push({
    pathname: '/settings',
    query: { derId: derId },
  });
};

const handleVulnerabilityScanClick = (derId: string) => {
  router.push({
    pathname: '/penetration-testing',
    query: { derId: derId },
  });
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



const OperationalStatusIcon: React.FC<{ status: 'up' | 'down' | 'amber', onClick: () => void }> = ({ status, onClick }) => {
  const style = {
    cursor: 'pointer',
    color: status === 'up' ? 'green' : status === 'down' ? 'red' : 'orange'
  };

  const symbol = status === 'up' ? '↑' : status === 'down' ? '↓' : '●';

  return <span style={style} onClick={onClick}>{symbol}</span>;
};

export const DERTable: React.FC<{ userRoles: string[] }> = ({ userRoles }) => {
  const router = useRouter();
  const [data, setData] = useState<DERData[]>([]);
 // const { userRoles } = useContext(AuthContext);
  const isSecurityAuditor = userRoles.includes('Security Admin');
  const isEngineer = userRoles.includes('Engineer');
  const GeneralManager = userRoles.includes('General Manager');
  const isAuditor = userRoles.includes('Auditor');
  //console.log('userRoles:', userRoles);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/derdata', {
          headers: { 'x-api-key': API_KEY }
        });

        if (response.data && Array.isArray(response.data)) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const rows = data.map((row) => (
    <tr key={row.der_id}>
       
       {(isEngineer || GeneralManager) ? (
       <>
       <td style={{ cursor: 'pointer' }}>
       <Link  href={`/settings?derId=${row.der_id}`}>
       {row.der_id}
     </Link>
     </td>
     <td style={{ cursor: 'pointer' }}>
       <Link  href={`/settings?derId=${row.der_id}`}>
       {row.der_name}
     </Link>
     </td></>
    ):
    ( <><td style={{ cursor: 'pointer' }} >
    {row.der_id}
  </td><td style={{ cursor: 'pointer' }} >
      {row.der_name}
    </td></>)}
    
      <td>{row.der_type}</td>
      <td>{formatDate(row.manufacture_date)}</td>
      <td>{row.manufacturer_info}</td>
      <td>{row.manufacturer_model_number}</td>
      <td>{row.manufacturer_hw_version}</td>
      <td>{row.location}</td>
      
      {(isSecurityAuditor || GeneralManager) ? (
      <td>
        <OperationalStatusIcon status={row.operationalStatus} onClick={() => handleStatusClick(row.der_id)} />
      </td>
    ):
    (<td>
       {row.operationalStatus} 
    </td>)}
      <td>
      {(isAuditor || GeneralManager) ? (
        <Button onClick={() => handleVulnerabilityScanClick(row.der_id)} size="xs">
          Scan
        </Button>
      ) : (
        getRandomLastScanTime() // Display last scan time for non-security admins
      )}
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
          <th>Vulnerability Scan</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
     
     
    </Table>
    
  );
};

export default DERTable;