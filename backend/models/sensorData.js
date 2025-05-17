const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
    droneId: { type: String, required: true, index: true }, // References Drone.uin
    timestamp: { type: Date, default: Date.now, index: true },
    // Your sensor fields
    accelX: Number,
    accelY: Number,
    accelZ: Number,
    roll: Number,
    pitch: Number,
    yaw: Number,
    bmpTemp: Number,
    pressure: Number,
    latitude: Number,
    longitude: Number,
    altitude: Number,
    battery: Number
});

// Auto-expire data after 30 days
sensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("SensorData", sensorDataSchema);