import React, { useState, useEffect } from 'react';

interface DeviceData {
  der_id?: string;
  software_version?: string;
  software_activation_date? : string;
  uptodate?: boolean;
  last_update?: string;
  next_update?: string;
  
}

interface SoftwareData {
  data: { [key: string]: [string, string, string, string, string, string, string, string, string, string, string, string] }[];
}

export default function SoftwareInfoTable() {
  const [softwareData, setSoftwareData] = useState<SoftwareData| null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const deviceId = "DER_1";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/deviceInfo');

        if (!response.ok) {
          console.error("HTTP error", response.status);
          return;
        }

        const rawData = await response.json();

        if (typeof rawData.body === 'string') {
          const parsedData = JSON.parse(rawData.body);
          setSoftwareData(parsedData);
        } else {
          setSoftwareData(rawData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (softwareData && softwareData.data) {
      const filteredData = softwareData.data.find(item => {
        const [derId] = Object.values(item);
        return derId[0] === deviceId;
      });

      if (filteredData) {
        const [der_id ,der_name ,
          der_type ,
          manufacturer_id,
          manufacturer_serial_number ,
          manufacture_date ,
          manufacturer_hw_version ,
          manufacturer_info ,
          manufacturer_model_number ,
          sw_activation_date ,
          sw_version, location] = filteredData[Object.keys(filteredData)[0]];
       
        // Using the softwareData values for demonstration
       
        
        setDeviceData({
          der_id: der_id,
          software_version: sw_version,
          software_activation_date: sw_activation_date,
          uptodate: true,
          last_update: "11/06/2023",
          next_update: "25/07/2023",
        });
      }
    }
  }, [softwareData, deviceId]);

  return (
    <div>
      {deviceData.der_id ? (
        <>
          <p><strong>DER ID:</strong> {deviceData.der_id}</p>
          {/* Display only softwareData values */}
          <p><strong>Software Version:</strong> {deviceData.software_version}</p>
          <p><strong>Up-to-date:</strong> {deviceData.uptodate ? 'Yes' : 'No'}</p>
          <p><strong>Last Update Run:</strong> {deviceData.last_update}</p>
          <p><strong>Next Update Due:</strong> {deviceData.next_update}</p>
        </>
      ) : (
        <p>No data available for the specified device ID.</p>
      )}
    </div>
  );
}
