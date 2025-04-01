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
// const droneRoutes = require('./routes/drone');

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use('/api/zones', zoneRoutes);
app.use('/api/user', userRoutes);
app.use('/api/flightPlan', flightPlanRoutes);
app.use('/api/airports', AirportsRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/drones', droneRoutes);

app.get('/', (req, res)=> {
    res.send("welcome to the prym utm api");
})


app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
})
