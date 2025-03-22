const mongoose = require('mongoose');

const AirportSchema = new mongoose.Schema({
    airport_id: String,
    name: { type: String, required: true }, 
    city: String,
    country: String,
    iata: { type: String, sparse: true },  // ❌ Removed unique
    icao: { type: String, sparse: true },  // ❌ Removed unique
    latitude: Number,
    longitude: Number,
    altitude: Number,
    timezone: Number,
    dst: { type: String, enum: ['E', 'A', 'S', 'O', 'Z', 'N', 'U'], default: 'U' },
    tz_database_time_zone: String,
    type: String,
    source: String,
}, { timestamps: true });

const Airport = mongoose.model('Airport', AirportSchema);
module.exports = Airport;
