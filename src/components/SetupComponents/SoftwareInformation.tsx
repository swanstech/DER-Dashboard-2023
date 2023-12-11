import React, { useState, useEffect } from 'react';

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
  data: { [key: string]: [string, string, string, string, string, string, string, string, string, string, string, string, string, string,string,string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] }[];
}

export default function SoftwareInfoTable({derId}) {
  const [softwareData, setSoftwareData] = useState<SoftwareData| null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const [isUpToDate, setIsUpToDate] = useState<boolean | null>(null);
  const deviceId = derId || "DER_1";

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
        const [der_id,
          der_name,
          der_type,
          manufacturer_id,
          manufacturer_serial_number,
          manufacture_date,
          manufacturer_hw_version,
          manufacturer_info,
          manufacturer_model_number,
          latest_sw_version,
          latest_sw_release_date,
          latest_firmware_version,
          latest_firmware_release_date, location,setting_id, der_id_set, set_max_ac_current, set_max_usable_energy_storage, set_minpf_overexcited_limit, set_minpf_underexcited_limit, set_max_apparent_power, set_max_reactive_power_tx, set_max_reactive_power_rx, set_max_active_power_tx, set_max_energy_storage, set_min_ac_voltage, set_max_ac_voltage, current_sw_version, sw_last_update_date, current_firmware_version, firmware_last_update_date] = filteredData[Object.keys(filteredData)[0]];

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
    if (!isUpToDate) {
      const confirmInstall = window.confirm('Do you want to install the latest version?');

      if (confirmInstall) {
        // Handle the installation logic here, e.g., redirect to the installation page or perform an action
        alert('Installing latest version...');
      } else {
        alert('Installation canceled.');
      }
    }
  };

  return (
    <div>
      {deviceData.der_id ? (
        <>
          <p><strong>DER ID:</strong> {deviceData.der_id}</p>
          <p>
            <strong>S/W Version:</strong> {deviceData.software_version}
            {isUpToDate !== null ? (
              <>
                {isUpToDate ? (
                  <span style={{ color: 'green', fontSize: '1.5em', marginLeft: '5px' }}>🟢</span>
                ) : (
                  <a onClick={handleIconClick}>
                    <span style={{ color: 'red', fontSize: '1.5em', marginLeft: '5px', cursor: 'pointer' }}>⚠️</span>
                  </a>
                )}
              </>
            ) : null}
          </p>
          <p><strong>Release:</strong> {deviceData.software_activation_date}</p>
          <p><strong>F/W Version:</strong> {deviceData.firmware_version}</p>
          <p><strong>Release:</strong> {deviceData.firmware_activation_date}</p>
        </>
      ) : (
        <p>No data available for the specified device ID.</p>
      )}
    </div>
  );
}