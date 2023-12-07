import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const VoltageReadingChart = () => {
  const chartRef = useRef(null);

  const generateRandomData = () => {
    return Array.from({ length: 6 }, () => Math.random() * 100 + 100); // Generates random values between 100 and 200
  };

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        title: {
          text: 'Voltage Reading Over 24 Hours',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], // 24-hour day divided into 6 parts
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} V',
          },
        },
        series: [{
          data: generateRandomData(),
          type: 'line',
          smooth: true,
          areaStyle: {},
        }],
      };

      chartInstance.setOption(option);
    }
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: '80vw',
        height: '400px',
      }}
    />
  );
};

export default VoltageReadingChart;
