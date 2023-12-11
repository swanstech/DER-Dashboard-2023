import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AssetManagerPieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

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
            radius: '75%',
            data: [
              { value: 15, name: 'Total Asset' },
              { value: 9, name: 'Up', itemStyle: { color: 'green' } },
              { value: 2, name: 'Down', itemStyle: { color: 'red' } },
              { value: 3, name: 'Maintenance', itemStyle: { color: '#FFBF00' } }, // Amber color
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

      chartInstance.setOption(option);

      // Attach the click event listener
      chartInstance.on('click', () => {
        // Redirect to the 'der-list' page on any pie chart section click
        window.location.href = '/asset-security'; // Or use your routing method here
      });
    }
  }, []);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
  );
};

export default AssetManagerPieChart;
