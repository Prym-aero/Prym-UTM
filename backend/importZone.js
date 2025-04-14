require('dotenv').config();
const mongoose = require('./db'); // Existing connection
const fs = require('fs');
const Zone = require('./models/zoneModel'); // Ensure correct path to your Zone schema

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync('zones.json', 'utf8'));

async function importZones() {
    try {
        for (const zoneData of jsonData) {
            const existingZone = await Zone.findOne({ name: zoneData.name, location: zoneData.location });

            if (!existingZone) {
                await Zone.create(zoneData);
                console.log(`✅ Zone "${zoneData.name}" added successfully.`);
            } else {
                console.log(`⚠️ Zone "${zoneData.name}" already exists. Skipping.`);
            }
        }
        console.log('🚀 Import completed.');
    } catch (err) {
        console.error('❌ Error importing zones:', err);
    } finally {
        mongoose.connection.close(); // Close connection after import
    }
}

importZones();
