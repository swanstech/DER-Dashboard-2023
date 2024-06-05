// pages/api/start.ts

// This page is responsible for running the python script responsible for starting the encryption and decryption
// This is written by Sakshi 

import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const currentDir = process.cwd();
        
        const absolutePathToPythonScript = '/usr/src/app/python_files/get_der_data.py';
        

        // Execute the Python script
        exec(`python3 ${absolutePathToPythonScript}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing encryption script: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            // Process the output (stdout) if needed
            console.log(`Encryption script output: ${stdout}`);
            res.status(200).json({ success: true, output: stdout });
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
