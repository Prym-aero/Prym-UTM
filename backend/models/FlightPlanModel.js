const mongoose = require("mongoose");

const flightPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who created the flight
    flightName: { type: String, required: true }, // Name of the flight
    locationName: { type: String, required: true }, // Location Name
    center: { 
        lat: { type: Number, required: true },
        lon: { type: Number, required: true }
    },
    radius: { type: Number, required: true }, // Restricted flight radius in meters
    altitude: { type: Number, required: true }, // Altitude in meters
    speed: { type: Number, required: true }, // Speed in m/s
    duration: { type: Number, required: true }, // Duration in minutes
    flightDate: { type: Date, required: true }, // Scheduled Flight Date

    //  Drone Details
    droneId: { type: String, required: true}, // Reference to a Drone Model
    droneModel: { type: String, required: true }, // Model name of the drone
    batteryLevel: { type: Number, default: 100 }, // Battery level (percentage)

    // 🔹 Waypoints (if needed)
    waypoints: [{ lat: Number, lon: Number, altitude: Number }], // List of GPS waypoints

    // 🔹 Pilot Information
    pilotId: {type: String, required:true}, // Assigned pilot (if applicable)
    pilotName: { type: String, required: true }, // Optional, for tracking

    // 🔹 Flight Status
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'in-progress', 'completed', 'cancelled'], 
        default: 'pending' 
    },

    // 🔹 Regulatory & Safety Checks
    regulatoryApproval: { type: Boolean, required: true, default: false },  
    safetyChecks: { type: Boolean, required: true, default: false },        

    // 🔹 Environmental & Emergency Fields
    weatherConditions: { type: String, default: "Unknown" }, // Example: Clear, Windy, Rainy
    emergencyFailsafe: { type: Boolean, default: false }, // Is there an emergency return-to-home?

    // 🔹 Additional Info
    logs: [{ timestamp: Date, message: String }], // Flight logs, can be auto-generated
    notes: { type: String } // Any additional comments

}, { timestamps: true });

module.exports = mongoose.model("FlightPlan", flightPlanSchema);
