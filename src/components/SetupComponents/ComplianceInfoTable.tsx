import React, { CSSProperties } from 'react';

interface ComplianceInfoTableProps {
  data: any[]; // Replace YourDataType with the type of your data
}

const ComplianceInfoTable: React.FC<ComplianceInfoTableProps> = ({ data }) => {
  const tableStyle: CSSProperties = {
    borderCollapse: 'collapse',
    width: '90%',
    border: '1px solid #ddd',
    margin: '2px'
  };

  const headerCellStyle: CSSProperties = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    padding: '4px', // Reduced padding to make header cells smaller
    textAlign: 'left'
  };

  // Adjusted width for the "Created On" header cell
  const createdOnHeaderCellStyle: CSSProperties = {
    ...headerCellStyle,
    width: '20%' // Adjust the width as needed
  };

  const cellStyle: CSSProperties = {
    border: '1px solid #ddd',
    padding: '4px',
    textAlign: 'left'
  };

  // Function to truncate text to 6 characters
  const truncateText = (text: string) => {
    return text.length > 6 ? text.substring(0, 6) : text;
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={createdOnHeaderCellStyle}>Created On</th>
            <th style={headerCellStyle}>Active Power</th>
            <th style={headerCellStyle}>Reactive Power</th>
            <th style={headerCellStyle}>Power Factor</th>
            <th style={headerCellStyle}>Voltage</th>
            <th style={headerCellStyle}>Apparent Power</th>
            <th style={headerCellStyle}>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
              <td style={cellStyle}>{record.CreatedOn.S}</td>
              <td style={cellStyle}>{truncateText(record.DERActivePower.S)}</td>
              <td style={cellStyle}>{truncateText(record.DerReactivePower.S)}</td>
              <td style={cellStyle}>{truncateText(record.DerPowerFactor.S)}</td>
              <td style={cellStyle}>{truncateText(record.DerVoltage.S)}</td>
              <td style={cellStyle}>{truncateText(record.DerApparentPower.S)}</td>
              <td style={cellStyle}>{truncateText(record.DerFrequency.S)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplianceInfoTable;
