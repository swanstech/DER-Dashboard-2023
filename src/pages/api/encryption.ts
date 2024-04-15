// pages/api/encryption.js

import { spawn } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch the content of the Python script from GitHub
      const response = await fetch('https://raw.githubusercontent.com/swanstech/der-dashboard-demo/enc-aws-dec/encryption.py');
      const scriptContent = await response.text();

      // Execute the Python script without any arguments
      const pythonProcess = spawn('python', ['-c', scriptContent]);

      // Handle data from Python script
      pythonProcess.stdout.on('data', (data) => {
        // Send response back to client
        return res.status(200).json({ result: data.toString() });
      });

      // Handle error from Python script
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        return res.status(500).json({ error: 'An error occurred during script execution' });
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'An internal server error occurred' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
