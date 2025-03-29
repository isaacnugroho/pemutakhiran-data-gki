import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'location-data.js');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(fileContents);
  } catch (error) {
    console.error('Error serving location data:', error);
    res.status(500).json({ error: 'Failed to load location data' });
  }
}
