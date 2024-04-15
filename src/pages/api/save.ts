import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Parse the JSON object from the request body
            const { data } = req.body;
            if (!data) {
                throw new Error('No data provided in the request body');
            }
            
            const currentDir = process.cwd();
            const relativePathToPythonScript = 'Desktop/DER_Dashboard/der-dashboard-demo/cloud_tx.py';
            const absolutePathToPythonScript = path.join(process.env.HOME, relativePathToPythonScript);

            // Execute the Python script with the provided data as command-line arguments
            exec(`python3 ${absolutePathToPythonScript} '${JSON.stringify(data)}'`, (error, stdout, stderr) => {
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
