import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const MonthlyEnergyUsage = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        title: {
          text: 'Monthly Distribution of Electricity',
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
          data: Array.from({length: 31}, (_, i) => i + 1), // generates an array [1, 2, ..., 31]
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
            data: Array.from({length: 31}, () => Math.floor(Math.random() * 1000)), // generates random data for each day of the month
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
            // markArea: {
            //     itemStyle: {
            //         color: 'rgba(255, 173, 177, 0.4)',
            //       },
            //     data: [
            //       [
            //         {
            //           name: 'Q1',
            //           xAxis: '1'
            //         },
            //         {
            //           xAxis: '10'
            //         }
            //       ],
            //       [
            //         {
            //           name: '2Q',
            //           xAxis: '11'
            //         },
            //         {
            //           xAxis: '20'
            //         }
            //       ],
            //       [
            //         {
            //           name: '3Q',
            //           xAxis: '21'
            //         },
            //         {
            //           xAxis: '31'
            //         }
            //       ],
            //     ],
            //   },
          },
        ],
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

export default MonthlyEnergyUsage;



