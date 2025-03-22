const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const Airport = require('./models/AirportModel'); // Adjust path as needed
const db = require('./db');



const results = [];

fs.createReadStream('airports.csv')
  .pipe(csv())
  .on('data', (row) => {
    const { ident, name, municipality, iso_country, iata_code, icao_code, latitude_deg, longitude_deg, elevation_ft, tz_database_time_zone, type } = row;

    const lat = parseFloat(latitude_deg);
    const lon = parseFloat(longitude_deg);
    const alt = parseFloat(elevation_ft);

    if (iso_country === 'IN' && icao_code && !isNaN(lat) && !isNaN(lon) && !isNaN(alt)) { // <- Check if `icao_code` exists
      results.push({
        airport_id: ident,
        name,
        city: municipality,
        country: iso_country,
        iata: iata_code.trim(), // Ensure it's a string and not `null`
        icao: icao_code.trim(), // Ensure it's a string and not `null`
        latitude: lat,
        longitude: lon,
        altitude: alt,
        tz_database_time_zone,
        type,
        source: 'CSV'
      });
    }
  })
  .on('end', async () => {
    try {
      await Airport.insertMany(results);
      console.log('Indian airports successfully added to the database.');
    } catch (err) {
      console.error('Error saving data:', err);
    } finally {
      mongoose.connection.close();
    }
  });
