// pages/api/weather.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Bom } from 'node-bom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { latitude, longitude } = req.query;

  try {
    const bom = new Bom();
    const data = await bom.getForecastData(Number(latitude), Number(longitude));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
