import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'location-data.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(JSON.parse(fileContents));
  } catch (error) {
    console.error('Error serving location data:', error);
    res.status(500).json({ error: 'Failed to load location data' });
  }
}
