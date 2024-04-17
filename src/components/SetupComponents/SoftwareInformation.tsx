import { Table } from '@mantine/core';
import { AuthContext } from 'n/contexts/AuthContext';
import React, { useState, useEffect, useContext } from 'react';

interface DeviceData {
  der_id?: string;
  software_version?: string;
  software_activation_date? : string;
  firmware_version?: string;
  firmware_activation_date? : string;
  uptodate?: boolean;
  last_update?: string;
  next_update?: string;
  
}

interface SoftwareData {
  data: { [key: string]: [string,string, string, string, string, string, string, string, string, string, string, string, string, string, string,string,string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] }[];
}

export default function SoftwareInfoTable({derId}) {
  const [softwareData, setSoftwareData] = useState<SoftwareData| null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const [isUpToDate, setIsUpToDate] = useState<boolean | null>(null);
  const deviceId = derId || "DER_1";
  
  const { userRoles } = useContext(AuthContext);
  const isSecurityAdmin = userRoles.includes('der-security-admin');

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
  }, [derId]);

  useEffect(() => {
    if (softwareData && softwareData.data) {
      const filteredData = softwareData.data.find(item => {
        const [derId] = Object.values(item);
        return derId[0] === deviceId;
      });

      if (filteredData) {
        const [der_id,
          der_name,
          der_type,
          manufacturer_id,
          manufacturer_serial_number,
          manufacture_date,
          manufacturer_info,
          manufacturer_model_number,
          manufacturer_hw_version,
          latest_sw_version,
          latest_sw_release_date,
          latest_firmware_version,
          latest_firmware_release_date, location,status,setting_id, der_id_set, set_max_ac_current, set_max_usable_energy_storage, set_minpf_overexcited_limit, set_minpf_underexcited_limit, set_max_apparent_power, set_max_reactive_power_tx, set_max_reactive_power_rx, set_max_active_power_tx, set_max_energy_storage, set_min_ac_voltage, set_max_ac_voltage, current_sw_version, sw_last_update_date, current_firmware_version, firmware_last_update_date] = filteredData[Object.keys(filteredData)[0]];

        const isVersionsMatch = latest_sw_version === current_sw_version;
        
        setDeviceData({
          der_id: der_id,
          software_version: latest_sw_version,
          software_activation_date: latest_sw_release_date,
          firmware_version: latest_firmware_version,
          firmware_activation_date: latest_sw_release_date,
          uptodate: isVersionsMatch,
          last_update: "11/06/2023",
          next_update: "25/07/2023",
        });

        setIsUpToDate(isVersionsMatch);
      }
    }
  }, [softwareData, deviceId]);

  const handleIconClick = () => {
    if (!isSecurityAdmin || !isUpToDate) {
      const confirmInstall = window.confirm('Do you want to install the latest version?');

      if (confirmInstall) {
        // Handle the installation logic here, e.g., redirect to the installation page or perform an action
        alert('Installing latest version...');
      } else {
        alert('Installation canceled.');
      }
    }
  };

  // Preparing table rows
  const rows = deviceData ? [
    ['DER ID', deviceData.der_id],
    ['S/W Version', deviceData.software_version, deviceData.uptodate],
    ['Release', deviceData.software_activation_date],
    ['F/W Version', deviceData.firmware_version],
    ['Release', deviceData.firmware_activation_date],
  ].map(([key, value, isUpToDate]) => (
    <tr key={key + "-row"}>
      <td>{key}</td>
      <td>
        {value}
        {key === 'S/W Version' && isUpToDate !== undefined ? (
          isUpToDate ? (
            <span style={{ color: 'green', fontSize: '1.5em', marginLeft: '5px' }}>🟢</span>
          ) : (
            isSecurityAdmin && (
              <a onClick={handleIconClick}>
                <span style={{ color: 'red', fontSize: '1.5em', marginLeft: '5px', cursor: 'pointer' }}>⚠️</span>
              </a>
            )
          )
        ) : null}
      </td>
    </tr>
  )) : null;


  return (
    <div>
      <Table>
        <tbody>{rows}</tbody>
      </Table>
      {!deviceData.der_id && <p>No data available for the specified device ID.</p>}
    </div>
  );
  }