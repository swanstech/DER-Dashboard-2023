import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';

interface EnergyUsageData {
  event_id: string;
  der_id: string;
  der_voltage: number;
  der_current: number;
  der_frequency: number;
  der_active_power: number;
  der_apparent_power: number;
  der_reactive_power: number;
  createdon: string;
}

interface Props {
  derId: string;
}

const DailyEnergyUsageChart: React.FC<Props> = ({ derId }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<EnergyUsageData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<EnergyUsageData[]>('https://htstnzr9f9.execute-api.ap-southeast-2.amazonaws.com/test/der-live-data');
        const dates = response.data.map(entry => entry.createdon.substring(0, 10)); // Extracting only date part
        const uniqueDates = Array.from(new Set(dates)); // Getting unique dates
        setUniqueDates(uniqueDates);
        setData(response.data.filter(entry => entry.der_id === derId));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [derId]);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const chartInstance = echarts.init(chartRef.current);

      const filteredData = selectedDate ? data.filter(entry => entry.createdon.startsWith(selectedDate)) : data;

      const option = {
        title: {
          text: 'Daily Distribution of Electricity',
          subtext: 'DER Live Data',
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
          data: filteredData.map(entry => entry.createdon),
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} V',
          },
          axisPointer: {
            snap: true,
          },
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [
            { lte: 6, color: 'green' },
            { gt: 6, lte: 8, color: 'red' },
            { gt: 8, lte: 14, color: 'green' },
            { gt: 14, lte: 17, color: 'red' },
            { gt: 17, color: 'green' },
          ],
        },
        series: [
          {
            name: 'Voltage',
            type: 'line',
            smooth: true,
            data: filteredData.map(entry => entry.der_voltage),
          },
        ],
      };

      chartInstance.setOption(option);

      // Dispose the chart instance on component unmount
      return () => {
        chartInstance.dispose();
      };
    }
  }, [data, selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <div>
        <select value={selectedDate || ''} onChange={(e) => handleDateSelect(e.target.value)}>
          <option value="">Select Date</option>
          {uniqueDates.map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </select>
      </div>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};

export default DailyEnergyUsageChart;
