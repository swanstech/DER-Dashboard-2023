                                                                                                                                                                                                                                                                                                                                                                                // Importing required dependencies and components
import { Table } from '@mantine/core';
import React, { useState, useEffect } from 'react';

// Declare interfaces for types
interface DeviceData {
  der_id?: string;
  der_name?: string;
  der_type?: string;
  manufacturer_model_number?: string;
  manufacturer_serial_number?: string;
  manufacturer_hw_version?: string;
  location?: string;
}

interface HardwareData {
  data: { [key: string]: [string, string, string, string, string, string, string, string, string, string, string, string, string, string,string,string, string, string, string, string, string, string, string,string, string, string, string, string, string, string, string, string] }[];
}

// Main function component
export default function HardwareInfoTable({derId}) {
  // Using React Hooks to manage state
  const [hardwareData, setHardwareData] = useState<HardwareData | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const deviceId = derId || "DER_1";  // Placeholder for actual device ID

  // Fetching data with useEffect (Runs when the component mounts)
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetching data from the API
        const response = await fetch('/api/deviceInfo');

        // Handling HTTP errors
        if (!response.ok) {
          console.error("HTTP error", response.status);
          return;
        }

        // Parsing the JSON response
        const rawData = await response.json();

        // Check if rawData.body is a string that needs to be parsed
        if (typeof rawData.body === 'string') {
          const parsedData = JSON.parse(rawData.body);
          setHardwareData(parsedData);
        } else {
          // If no parsing is needed, set rawData directly
          setHardwareData(rawData);
        }
      } catch (error) {
        // Handling fetch or parsing errors
        console.error("Error fetching data:", error);
      }
    }

    // Execute the fetch function
    fetchData();
  }, [derId]); // Empty dependency array means this useEffect runs once when the component mounts

  // Filtering the fetched data based on device ID
  useEffect(() => {
    if (hardwareData && hardwareData.data) {
      const filteredData = hardwareData.data.find(item => {
        const [derId] = Object.values(item);
        return derId[0] === deviceId;
      });

      // Updating the deviceData state based on filtered data
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

        setDeviceData({
          der_id: der_id,
          der_name: der_name,
          der_type: der_type,
          manufacturer_model_number: manufacturer_model_number,
          manufacturer_serial_number: manufacturer_serial_number,
          manufacturer_hw_version: manufacturer_hw_version,
          location: location,
        });
      }
    }
  }, [hardwareData, deviceId]);

  // Prepare table rows from deviceData
  const rows = deviceData ? [
    ['DER ID', deviceData.der_id],
    ['Name', deviceData.der_name],
    ['Type', deviceData.der_type],
    ['MFG Model No.', deviceData.manufacturer_model_number],
    ['MFG Serial No.', deviceData.manufacturer_serial_number],
    ['HW Version', deviceData.manufacturer_hw_version],
    ['Location', deviceData.location],
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
      {!deviceData.der_id && <p>No data available for the specified device ID.</p>}
    </div>
  );
}