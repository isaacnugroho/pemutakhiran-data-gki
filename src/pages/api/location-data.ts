import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the absolute path to the location data file
    const filePath = path.join(process.cwd(), 'public', 'location-data.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: 'Location data file not found' });
    }
    
    // Read the file contents
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse JSON (in a try-catch to handle malformed JSON)
    try {
      const data = JSON.parse(fileContents);
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      
      // Return the data
      return res.status(200).json(data);
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return res.status(500).json({ error: 'Invalid JSON format in location data file' });
    }
  } catch (error) {
    console.error('Error serving location data:', error);
    return res.status(500).json({ error: 'Failed to load location data', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
