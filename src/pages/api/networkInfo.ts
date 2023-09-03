// pages/api/proxy.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.API_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(`${API_URL}?device_id=${1}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500);
  }
}
