import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';

interface DataItem {
  sourceIP: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  data: string;
  timeStamp: string;
}

const getDataFromCSV = async (
  page: number ,
  pageSize: number ,
  derId :string
): Promise<{ data: DataItem[]; totalPages: number }> => {
  const filePath = path.join(process.cwd(), `logs/${derId}_nwlogs.csv`);
  console.log(filePath);

  return new Promise((resolve, reject) => {
    const data: DataItem[] = [];

    const stream = fs.createReadStream(filePath, { encoding: 'latin1' });
    Papa.parse(stream, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data;

        rows.forEach((row) => {
          try {
            const item: DataItem = {
              sourceIP: row['Source IP'],
              destinationIP: row['Destination IP'],
              sourcePort: parseInt(row['Source Port']),
              destinationPort: parseInt(row['Destination Port']),
              protocol: row['Protocol'],
              data: row['Data'],
              timeStamp: row['Timestamp'],
            };

            data.push(item);
          } catch (error) {
            console.error('Error parsing row:', error);
            console.error('Row content:', row);
          }
        });

        // Calculate pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = data.slice(start, end);

        // Calculate total pages
        const totalPages = Math.ceil(data.length / pageSize);

        resolve({ data: paginatedData, totalPages });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { page =1, pageSize =10, derId = "DER_1"} = req.query;

    try {
      const { data, totalPages } = await getDataFromCSV(Number(page), Number(pageSize),derId as string);
      res.status(200).json({ data, totalPages });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
