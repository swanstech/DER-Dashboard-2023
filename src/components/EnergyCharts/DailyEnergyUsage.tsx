import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DailyEnergyUsage = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        title: {
          text: ' Daily Distribution of Electricity',
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
          boundaryGap: false,
          data: [
            '00:00',
            '01:15',
            '02:30',
            '03:45',
            '05:00',
            '06:15',
            '07:30',
            '08:45',
            '10:00',
            '11:15',
            '12:30',
            '13:45',
            '15:00',
            '16:15',
            '17:30',
            '18:45',
            '20:00',
            '21:15',
            '22:30',
            '23:45',
          ],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} W',
          },
          axisPointer: {
            snap: true,
          },
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [
            {
              lte: 6,
              color: 'green',
            },
            {
              gt: 6,
              lte: 8,
              color: 'red',
            },
            {
              gt: 8,
              lte: 14,
              color: 'green',
            },
            {
              gt: 14,
              lte: 17,
              color: 'red',
            },
            {
              gt: 17,
              color: 'green',
            },
          ],
        },
        series: [
          {
            name: 'Electricity',
            type: 'line',
            smooth: true,
            data: Array.from({length: 19}, () => Math.floor(Math.random() * 1000)),
            markArea: {
              itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)',
              },
              data: [
                [
                  {
                    name: 'Morning Peak',
                    xAxis: '07:30',
                  },
                  {
                    xAxis: '10:00',
                  },
                ],
                [
                  {
                    name: 'Evening Peak',
                    xAxis: '17:30',
                  },
                  {
                    xAxis: '21:15',
                  },
                ],
              ],
            },
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
        width: '100%', // Adjusted width to be 100% of the parent container
        height: '400px',
      }}
    />
  );
};

export default DailyEnergyUsage;