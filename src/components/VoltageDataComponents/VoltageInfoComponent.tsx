// VoltageInformation.tsx
import React from 'react';
import { Table } from '@mantine/core';

interface IData {
  der_max_input_voltage: number;
  der_max_input_current: number;
  der_max_output_voltage: number;
  der_output_power: number;
  der_output_frequency: number;
  der_max_output_current: number;
  der_operating_temp_range: string;
}

const staticData: IData = {
  der_max_input_voltage: 120.00,
  der_max_input_current: 10.00,
  der_max_output_voltage: 240.00,
  der_output_power: 500.00,
  der_output_frequency: 60.00,
  der_max_output_current: 20.00,
  der_operating_temp_range: "0°C - 40°C"
};

const limitData: Partial<IData> = {
  // Placeholder data for the limits. You can replace these with actual values from the API.
  der_max_input_voltage: 0,
  der_max_input_current: 0,
  der_max_output_voltage: 0,
  der_output_power: 0,
  der_output_frequency: 0,
  der_max_output_current: 0, 
  der_operating_temp_range: "0°C - 40°C"
};

const formatParameterName = (key: string): string => {
    const replacements: { [key: string]: string } = {
      der: " ",
      max: "Max",
      id: "ID",
      temp: "Temperature",
      operating: "Operating"
    };
  
    return key.split('_').map(word => replacements[word] || word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const VoltageInformation: React.FC = () => {
    return (
      <div className="voltage-info">
        <Table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Actual</th>
              <th style={{ color: 'red' }}>Limit</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(staticData).map(key => (
              <tr key={key}>
                <td>{formatParameterName(key)}</td>
                <td>{staticData[key as keyof IData]}</td>
                <td style={{ color: 'red' }}>{limitData[key as keyof IData]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
  
  export default VoltageInformation;
