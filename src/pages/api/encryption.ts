import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { encode } from 'punycode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Parse the JSON object from the request body
      const { data } = req.body;
      if (!data) {
        throw new Error('No data provided in the request body');
      }

      const currentDir = process.cwd();
      const absolutePathToPythonScript = '/usr/src/app/python_files/encryption.py';

      // Encode the JSON data to base64

      
      let encodedData = data.replace(/\n/g, '');
      //encodedData = JSON.stringify(encodedData);
      console.log("data ", data);
      console.log("encoded data ", encodedData);

      // Execute the Python script with the provided data as command-line arguments
      exec(`python3 ${absolutePathToPythonScript} "${encodedData}"`, (error, stdout, stderr) => {
      //exec(`python3 /usr/src/app/python_files/encryption.py '{"CreatedOn": "2024-04-16 03:26:36", "DERActivePower": "537.0", "DerApparentPower": "537.0009155273438", "DerCurrent": "2.3499999046325684", "DerFrequency": "51.98999786376953", "DerPowerFactor": "-99.99983215332031", "DerReactivePower": "1.0", "DerVoltage": "180.5"}'`, (error, stdout, stderr) => {
        console.log(`python3 ${absolutePathToPythonScript} "${encodedData}"`);
        if (error) {
          console.error(`Error executing encryption script: ${error}`);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        // Process the output (stdout) if needed
        console.log(`Encryption script output: ${stdout}`);
        res.status(200).json({ success: true, output: stdout });
      });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(400).json({ error: 'Bad Request' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
