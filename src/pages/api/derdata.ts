import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.API_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch data from the device endpoint
    const response = await axios.get(`${API_URL}/device`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    // Check if response.data contains the expected structure
    if (!Array.isArray(response.data?.data)) {
      throw new Error("Unexpected data structure received from API");
    }

    // Process the data and add operational status
    const processedData = response.data.data.map((item: any) => {
      // Extract values from the 'row' keys
      const values = Object.values(item)[0];

  return {
    der_id: values[0],
    der_name: values[1],
    der_type: values[2],
    manufacturer_id: values[3],
    manufacturer_serial_number: values[4],
    manufacture_date: values[5],
    manufacturer_info: values[6],
    manufacturer_model_number: values[7],
    manufacturer_hw_version: values[8],
    sw_version: values[9],
    sw_activation_date: values[10],
    location: values[13],
    operationalStatus: values[14]
  };
    });

    // Send the processed data as the response
    return res.status(200).json(processedData);
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unknown error occurred' });
  }
}

// Define a function to generate random operational status
const getRandomOperationalStatus = () => {
  const statuses = ['up', 'down', 'amber'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
