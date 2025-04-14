const express = require('express');
const Drone = require('../models/DroneModel');
const router = express.Router();
const authMiddleware = require('../controllers/authMiddleware');

router.get('/', async (req, res) => {  // this route is for getting all the drones from the database 
    try {
        const drones = await Drone.find();
        res.status(200).json(drones);
    } catch (error) {
         console.log("Error fetching drones:", error);
    }
});

router.get('/:id', async (req, res) => { // this route is for getting a drone information by id from the database
    try {
        const {droneId} = req.params;
        const drone = await Drone.findById(droneId);
        if (!drone) {
            return res.status(404).json({message: "Drone not found"});
        }

        res.status(200).json(drone);
    } catch (error) {
        console.log("Error fetching drone:", error);
        res.status(500).json({message: "Internal server error"});
    }
      
});

router.post('/add-drone',authMiddleware, async (req, res) => { // this route is for adding drone in the database 
    try {
        const { uin, droneSerialNumber, image } = req.body;

        const existedDrone = await Drone.findOne({uin});

        if (existedDrone) {
            return res.status(400).json({message: "Drone already exists"});
        }

        if (!image || !image.startsWith('data:image/')) {
            return res.status(400).json({message: "Invalid image format"});
        }

        const newDrone = new Drone(req.body);
        if (!newDrone) {
            return res.status(400).json({message: "Drone not created"});
        }
        await newDrone.save();
        res.status(201).json({message: "Drone added successfully", drone: newDrone});
    } catch (error) {
        console.error("Error adding drone:", error);
    }
});

module.exports = router;

