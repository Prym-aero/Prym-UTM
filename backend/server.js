const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();
require('./db');
const userRoutes = require('./routes/User');
const port = process.env.PORT || 3000;
const zoneRoutes = require('./routes/zones');
const flightPlanRoutes = require('./routes/FlightPlan');
const AirportsRoutes = require('./routes/Airports');
const authRoutes = require('./routes/auth');
const droneRoutes = require('./routes/drone');

const app = express();
const WebSocket = require('ws');   
const http = require('http');
const server = http.createServer(app);

const wss = new WebSocket.Server({server}); 



app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/api/zones', zoneRoutes);
app.use('/api/user', userRoutes);
app.use('/api/flightPlan', flightPlanRoutes);
app.use('/api/airports', AirportsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);

app.get('/', (req, res)=> {
    res.send("welcome to the prym utm api");
})




// websocket login goes here 
wss.on('connection', (ws) => {
    console.log('✅ WebSocket client connected');

    ws.on('message', (message) => {
        console.log('📨 Received:', message.toString());

        // ✅ Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('❌ WebSocket client disconnected');
    });
});



server.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
    console.log(`websocket server running on ws://localhost:${port}`);
});
