import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const FrequencyChart = () => {
  const chartRef = useRef(null);

  const generateRandomData = () => {
    return Array.from({ length: 6 }, () => Math.random() * 5 + 48); // Generates random values around 50 Hz
  };

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        title: {
          text: 'Frequency Fluctuations Over 24 Hours',
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
            formatter: '{value} Hz',
          },
        },
        series: [{
          data: generateRandomData(),
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#FF6B6B',
          },
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

export default FrequencyChart;
