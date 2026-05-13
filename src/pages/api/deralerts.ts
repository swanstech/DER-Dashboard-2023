// Proxy to Lambda Function URL — keeps the URL server-side only
import { NextApiRequest, NextApiResponse } from 'next';

const LAMBDA_URL = process.env.LAMBDA_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!LAMBDA_URL) {
    return res.status(500).json({ error: 'LAMBDA_URL not configured' });
  }

  try {
    const response = await fetch(LAMBDA_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Lambda request failed' });
    }

    const raw = await response.json();

    // Lambda may return body as a JSON string
    const data = typeof raw.body === 'string' ? JSON.parse(raw.body) : raw;

    return res.status(200).json({
      alerts: Array.isArray(data.alerts) ? data.alerts : [],
      telemetry: Array.isArray(data.telemetry) ? data.telemetry : [],
    });
  } catch (err) {
    console.error('DER alerts fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch alerts' });
  }
}
