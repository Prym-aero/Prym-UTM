const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();
require('./config/db');
const userRoutes = require('./routes/User');
const port = process.env.PORT || 3000;
const zoneRoutes = require('./routes/zones');
const flightPlanRoutes = require('./routes/FlightPlan');
const AirportsRoutes = require('./routes/Airports');
const authRoutes = require('./routes/auth');
const droneRoutes = require('./routes/drone');
const sensorQueue = require("./queues/sensorQueue");
const { initializeQueue, addToQueue } = require('./queues/sensorQueue');

const app = express();
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);

const io = new socketIo.Server({ server });

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/api/zones', zoneRoutes);
app.use('/api/user', userRoutes);
app.use('/api/flightPlan', flightPlanRoutes);
app.use('/api/airports', AirportsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);

app.get('/', (req, res) => {
    res.send("welcome to the prym utm api");
})

const liveDroneData = new Map();

// Initialize during server startup
initializeQueue().then(() => {
    console.log('MongoDB Queue initialized');
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send initial drone states
    socket.emit("initial-state", Object.fromEntries(liveDroneData));

    // Handle drone tracking subscription
    socket.on("track-drone", (droneId) => {
        socket.join(`drone-${droneId}`);
        console.log(`Client ${socket.id} tracking drone ${droneId}`);
    });

    // Process incoming sensor data
    socket.on("sensor-data", async (data) => {
        try {
            const { droneId, ...sensorData } = data;
            const timestamp = new Date();

            // 1. Validate incoming data
            if (!droneId || !sensorData.latitude || !sensorData.longitude) {
                throw new Error("Invalid sensor data format");
            }

            // 2. Update live cache
            const liveData = { ...sensorData, timestamp };
            liveDroneData.set(droneId, liveData);

            // 3. Broadcast to subscribers
            io.to(`drone-${droneId}`).emit("update", liveData);

            // 4. Add to MongoDB queue
            await addToQueue({
                droneId,
                ...sensorData,
                timestamp
            });

            // 5. Update drone document
            await Drone.findOneAndUpdate(
                { uin: droneId },
                {
                    lastKnownPosition: {
                        type: "Point",
                        coordinates: [sensorData.longitude, sensorData.latitude]
                    },
                    currentAltitude: sensorData.altitude,
                    currentBattery: sensorData.battery,
                    droneStatus: "Flying",
                    lastUpdated: timestamp
                },
                { upsert: true } // Create if doesn't exist
            );

            // 6. Geofence check
            const violation = await checkGeofence(
                sensorData.latitude,
                sensorData.longitude
            );

            if (violation) {
                const alert = {
                    droneId,
                    zone: violation.zoneType,
                    location: [sensorData.latitude, sensorData.longitude],
                    timestamp
                };

                // Broadcast to all monitoring clients
                io.emit("alert", alert);

                // Specific alert to drone operator
                io.to(`drone-${droneId}-operator`).emit("priority-alert", alert);
            }

        } catch (error) {
            console.error(`Error processing sensor data: ${error.message}`);
            socket.emit("error", `Data processing failed: ${error.message}`);
        }
    });

    // Handle drone control commands
    socket.on("control-command", async (command) => {
        try {
            // Validate and process control commands
            // (Add your command logic here)
        } catch (error) {
            console.error(`Control command error: ${error.message}`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});


// websocket login goes here 




server.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
    console.log(`websocket server running on ws://localhost:${port}`);
});
