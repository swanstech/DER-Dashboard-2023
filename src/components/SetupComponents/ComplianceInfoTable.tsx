import React, { CSSProperties } from 'react';

interface ComplianceInfoTableProps {
  data: any[]; // Replace YourDataType with the type of your data
}

const ComplianceInfoTable: React.FC<ComplianceInfoTableProps> = ({ data }) => {
  const tableStyle: CSSProperties = {
    borderCollapse: 'collapse',
    width: '80%',
    border: '1px solid #ddd',
    margin: '2px'
  };

  const headerCellStyle: CSSProperties = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    padding: '4px', // Reduced padding to make header cells smaller
    textAlign: 'left',
    width: '10%' // Adjusted width of header cells
  };

  const cellStyle: CSSProperties = {
    border: '1px solid #ddd',
    padding: '4px',
    textAlign: 'left'
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            {/* <th style={headerCellStyle}>ID</th> */}
            <th style={headerCellStyle}>Created On</th>
            <th style={headerCellStyle}>Active Power</th>
            <th style={headerCellStyle}>Reactive Power</th>
            <th style={headerCellStyle}>Power Factor</th>
            <th style={headerCellStyle}>Voltage</th>
            {/* <th style={headerCellStyle}>Current</th> */}
            <th style={headerCellStyle}>Apparent Power</th>
            <th style={headerCellStyle}>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
              {/* <td style={cellStyle}>{record.DerID.S}</td> */}
              <td style={cellStyle}>{record.CreatedOn.S}</td>
              <td style={cellStyle}>{record.DERActivePower.S}</td>
              <td style={cellStyle}>{record.DerReactivePower.S}</td>
              <td style={cellStyle}>{record.DerPowerFactor.S}</td>
              <td style={cellStyle}>{record.DerVoltage.S}</td>
              {/* <td style={cellStyle}>{record.DerCurrent.S}</td> */}
              <td style={cellStyle}>{record.DerApparentPower.S}</td>
              <td style={cellStyle}>{record.DerFrequency.S}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplianceInfoTable;
