import React, { useState, useEffect } from 'react';
import { Table, Loader } from '@mantine/core';

interface WeatherComponentProps {
  latitude: number;
  longitude: number;
}

interface WeatherForecast {
  air_temperature_maximum: { value: number, units: string };
  air_temperature_minimum: { value: number, units: string };
  icon: { description: string };
  probability_of_precipitation: string;
  'start-time-local': string;
}

interface WeatherData {
  name: string;
  forecast: WeatherForecast[];
}

const WeatherComponent: React.FC<WeatherComponentProps> = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
        const data = await response.json();
        setWeatherData(data);
        console.log("Fetching Weather Data");
        console.log(data);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  if (loading) return <div className='loader'><Loader color="blue" type="bars" /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {weatherData && (
        <>
          <h6>Weather Forecasht for {weatherData.name}</h6>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Max Temperature (°C)</th>
                <th>Min Temperature (°C)</th>
                <th>Weather Description</th>
                <th>Probability of Precipitation</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.forecast.slice(0, 3).map((day, index) => (
                <tr key={index}>
                  <td>{new Date(day['start-time-local']).toLocaleDateString()}</td>
                  <td>{day.air_temperature_maximum?.value || 'N/A'}</td>
                  <td>{day.air_temperature_minimum?.value || 'N/A'}</td>
                  <td>{day.icon?.description || 'N/A'}</td>
                  <td>{day.probability_of_precipitation || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
  
};

export default WeatherComponent;
