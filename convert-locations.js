// Script to convert location-data.js to JSON format
const fs = require('fs');
const path = require('path');

// Read the location-data.js file
const locationDataPath = path.join(__dirname, 'public', 'location-data.js');
const locationDataContent = fs.readFileSync(locationDataPath, 'utf8');

// Extract the array of location strings
const regex = /LOCATION_DATA\s*=\s*\[([\s\S]*?)\];/;
const match = locationDataContent.match(regex);

if (!match) {
  console.error('Could not find LOCATION_DATA array in the file');
  process.exit(1);
}

// Get the array content
const arrayContent = match[1];

// Split by commas and clean up each entry
const locationStrings = arrayContent
  .split(',\n')
  .map(line => line.trim())
  .filter(line => line.startsWith('"') && line.endsWith('"'));

// Convert each string to a location object
const locationObjects = locationStrings.map(locationString => {
  // Remove quotes and split by pipe character
  const parts = locationString.substring(1, locationString.length - 1).split('|');
  
  return {
    province: parts[0] || '',
    city: parts[1] || '',
    district: parts[2] || '',
    subDistrict: parts[3] || '',
    postalCode: parts[4] || ''
  };
});

// Write to JSON file
const outputPath = path.join(__dirname, 'public', 'location-data.json');
fs.writeFileSync(outputPath, JSON.stringify(locationObjects, null, 2), 'utf8');

console.log(`Converted ${locationObjects.length} locations to JSON format`);
console.log(`Output saved to ${outputPath}`);
