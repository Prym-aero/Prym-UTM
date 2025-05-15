const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
    droneId: { type: String, required: true, index: true }, // References Drone.uin
    timestamp: { type: Date, default: Date.now, index: true },
    // Your sensor fields
    acelX: Number,
    acelY: Number,
    acelZ: Number,
    roll: Number,
    pitch: Number,
    yaw: Number,
    bmpTemp: Number,
    pressure: Number,
    latitude: Number,
    longitude: Number,
    altitude: Number,
    battery: Number
}, { timestamps: true }
);

// Auto-expire data after 30 days
sensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("SensorData", sensorDataSchema);