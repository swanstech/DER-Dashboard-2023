// Importing required dependencies and components
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
  data: { [key: string]: [string, string, string, string, string, string, string, string, string, string, string, string, string, string,string,string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] }[];
}

// Main function component
export default function HardwareInfoTable() {
  // Using React Hooks to manage state
  const [hardwareData, setHardwareData] = useState<HardwareData | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const deviceId = "DER_1";  // Placeholder for actual device ID

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
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

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
          manufacturer_hw_version,
          manufacturer_info,
          manufacturer_model_number,
          latest_sw_version,
          latest_sw_release_date,
          latest_firmware_version,
          latest_firmware_release_date, location,setting_id, der_id_set, set_max_ac_current, set_max_usable_energy_storage, set_minpf_overexcited_limit, set_minpf_underexcited_limit, set_max_apparent_power, set_max_reactive_power_tx, set_max_reactive_power_rx, set_max_active_power_tx, set_max_energy_storage, set_min_ac_voltage, set_max_ac_voltage, current_sw_version, sw_last_update_date, current_firmware_version, firmware_last_update_date] = filteredData[Object.keys(filteredData)[0]];

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

  // Return JSX for rendering
  return (
    <div>
      {deviceData.der_id ? (
        <>
          <p><strong>DER ID:</strong> {deviceData.der_id}</p>
          <p><strong>Name:</strong> {deviceData.der_name}</p>
          <p><strong>Type:</strong> {deviceData.der_type}</p>
          <p><strong>MFG Model No.:</strong> {deviceData.manufacturer_model_number}</p>
          <p><strong>MFG Serial No.:</strong> {deviceData.manufacturer_serial_number}</p>
          <p><strong>HW Version:</strong> {deviceData.manufacturer_hw_version}</p>
          <p><strong>Location:</strong> {deviceData.location}</p>
        </>
      ) : (
        <p>No data available for the specified device ID.</p>
      )}
    </div>
  );
}
