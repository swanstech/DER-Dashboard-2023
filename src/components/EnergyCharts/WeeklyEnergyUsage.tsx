import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const WeeklyEnergyUsage = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        title: {
          text: 'Weekly Distribution of Electricity',
          subtext: 'Fake Data',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          data: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} W',
          },
        },
        series: [
          {
            name: 'Electricity',
            type: 'line',
            smooth: true,
            data: Array.from({length: 7}, () => Math.floor(Math.random() * 1000)),
            markPoint: {
              data: [
                  {type: 'max', name: 'Max'},
                  {type: 'min', name: 'Min'}
              ]
          },
          markLine: {
              data: [
                  {type: 'average', name: 'Average'}
              ]
          },
          },
        ],
      };

      chartInstance.setOption(option);

            // Resize chart on window resize
            const resizeChart = () => {
              chartInstance.resize();
            };
            window.addEventListener('click', resizeChart);
      
            // Cleanup
            return () => window.removeEventListener('resize', resizeChart);
    }
  }, []);

  return (
<div
      ref={chartRef}
      style={{
        width: '100%', // Adjusted width to be 100% of the parent container
        height: '400px',
      }}
    />
  );
};

export default WeeklyEnergyUsage;