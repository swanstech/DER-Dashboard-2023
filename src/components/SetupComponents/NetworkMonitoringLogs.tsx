import React, { useState, useEffect } from 'react';
import { useMantineTheme, Container, Pagination } from '@mantine/core'; // Import Pagination component from Mantine

export default function NetworkMonitoringLogs({derId}) {
  const theme = useMantineTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Adjust the number of items per page as needed
  const [totalPages, setTotalPages] = useState(1);
  const [rowsData, setRowsData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/networklogs?page=${currentPage}&pageSize=${pageSize}&derId=${derId}`);
      if (response.ok) {
        const { data, totalPages } = await response.json();
        setRowsData(data);
        setTotalPages(totalPages);
      } else {
        console.error('Failed to fetch data from the API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) => {
      const isExpanded = prev.includes(index);
      return isExpanded ? prev.filter((item) => item !== index) : [...prev, index];
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container style={{ marginTop: '-30px', marginLeft: '-10px' }}>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Source IP</th>
              <th>Destination IP</th>
              <th>Source Port</th>
              <th>Destination Port</th>
              <th>Protocol</th>
              <th>Data</th>
              <th>TimeStamp</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.map((rowData, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr>
                  <td>{rowData.sourceIP}</td>
                  <td>{rowData.destinationIP}</td>
                  <td>{rowData.sourcePort}</td>
                  <td>{rowData.destinationPort}</td>
                  <td>{rowData.protocol}</td>
                  <td style={{ cursor: 'pointer' }} onClick={() => toggleRow(rowIndex)}>
                    {expandedRows.includes(rowIndex) ? '▲' : '▼'}
                  </td>
                  <td>{rowData.timeStamp}</td>
                </tr>
                {expandedRows.includes(rowIndex) && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'left', padding: '10px' }}>
                      {rowData.data}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={handlePageChange}
          size="lg"
          withControls
        />
      </div>
      </div>
    </Container>
  );
}
