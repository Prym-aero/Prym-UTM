const express = require('express');
const router = express.Router();
const FlightPlan = require('../models/FlightPlanModel');
const authMiddleware = require('../controllers/authMiddleware');


router.get('/', async (req, res) => {
    try {
        const flighPlans = await FlightPlan.find();   // is this for the getting all the flightPlans from the database
        res.status(200).json(flighPlans);
    } catch (error) {
        res.status(500).json({ error: "Error fetching flight plans" });
    }
});

router.post("/addFlight", authMiddleware, async (req, res) => {
    try {
        const { 
            flightName, locationName, center, radius, altitude, speed, duration, flightDate, 
            regulatoryApproval, safetyChecks, droneId, droneModel, batteryLevel, 
            pilotId, pilotName, status, waypoints, weatherConditions, emergencyFailsafe 
        } = req.body;

        // ✅ Ensure the userId is added from authMiddleware
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        // ✅ Log request body for debugging
        console.log("Incoming request body:", req.body);

        // ✅ Validate required fields
        if (!flightName || !locationName || !center || !center.lat || !center.lon || !flightDate || !droneId) {
            return res.status(400).json({ message: "Missing required flight details" });
        }

        // ✅ Convert numerical fields properly
        const newFlightPlan = new FlightPlan({
            userId, 
            flightName,
            locationName,
            center: { lat: Number(center.lat), lon: Number(center.lon) }, // Ensure correct format
            radius: Number(radius),
            altitude: Number(altitude),
            speed: Number(speed),
            duration: Number(duration),
            flightDate,
            regulatoryApproval,
            safetyChecks,

            // ✅ Drone Details
            droneId,
            droneModel,
            batteryLevel: Number(batteryLevel) || 100, // Default 100% if not provided

            // ✅ Pilot Information (Allow empty ID)
            pilotId: pilotId || "N/A",
            pilotName,

            // ✅ Waypoints (if provided)
            waypoints: waypoints || [],

            // ✅ Status Management
            status: status || "pending",

            // ✅ Environmental & Safety Fields
            weatherConditions: weatherConditions || "Unknown",
            emergencyFailsafe: emergencyFailsafe || false,
        });

        await newFlightPlan.save();
        res.status(201).json({ message: "Flight plan added successfully", flightPlan: newFlightPlan });
    } catch (error) {
        console.error("Error adding flight plan:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});





module.exports = router;
