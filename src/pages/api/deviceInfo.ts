import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.API_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(`${API_URL}/device`, {
      headers: {
        'x-api-key': "4BjKWhneKq2byqMJ7bT3R89G39P9FqpS6xGZORre"
      }
    });
    return res.status(200).json(response.data);
  } 
  catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unknown error occurred' });
  }
}
