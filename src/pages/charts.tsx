import React, { useState } from 'react';
import DailyEnergyUsageChart from '../components/EnergyCharts/DailyEnergyUsage';

const ChartsPage: React.FC = () => {
  const [selectedDER, setSelectedDER] = useState('');

  const handleDERSelect = (der: string) => {
    setSelectedDER(der);
  };

  return (
    <div>
      <h1>DER Live Data</h1>
      <div>
        <select value={selectedDER} onChange={(e) => handleDERSelect(e.target.value)}>
          <option value="">Select DER</option>
          <option value="DER_1">DER_1</option>
          <option value="DER_2">DER_2</option>
          {/* Add more options for other DERs if needed */}
        </select>
      </div>
      {selectedDER && (
        <div>
          <DailyEnergyUsageChart derId={selectedDER} />
        </div>
      )}
    </div>
  );
};

export default ChartsPage;
