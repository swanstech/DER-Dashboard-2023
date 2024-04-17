import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AssetManagerPieChart = ({ derData }) => {
  const chartRef = useRef(null);
  console.log(derData);

  useEffect(() => {
    if (chartRef.current && derData.length > 0) {
      const operationalStatusCounts = {
        up: 0,
        down: 0,
        amber: 0
      };

      // Calculate the counts for each operational status
      derData.forEach((der) => {
        switch (der.operationalStatus) {
          
          case 'up':
            console.log(der.operationalStatus);
            operationalStatusCounts.up++;
            break;
          case 'down':
            console.log(der.operationalStatus);
            operationalStatusCounts.down++;
            break;
          case 'amber':
            console.log(der.operationalStatus);
            operationalStatusCounts.amber++;
            break;
          default:
            console.log(der.operationalStatus);
            break;
        }
      });

      // Initialize ECharts instance
      const chartInstance = echarts.init(chartRef.current);

      // Define chart options
      const option = {
        title: {
          text: 'DER Status',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Assets',
            type: 'pie',
            radius: '70%',
            data: [
              { value: operationalStatusCounts.up, name: 'Up', itemStyle: { color: 'green' } },
              { value: operationalStatusCounts.down, name: 'Down', itemStyle: { color: 'red' } },
              { value: operationalStatusCounts.amber, name: 'Maintenance', itemStyle: { color: '#FFBF00' } }, // Amber color
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // Set chart options
      chartInstance.setOption(option);

      // Attach the click event listener
      chartInstance.on('click', () => {
        // Redirect to the 'asset-security' page on any pie chart section click
        window.location.href = '/asset-security'; // Or use your routing method here
      });
    }
  }, [derData]); // Re-render the chart whenever derData changes

  return (
    <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
  );
};

export default AssetManagerPieChart;
