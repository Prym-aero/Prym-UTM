const express = require('express');
const router = express.Router();
const Zone = require('../models/zoneModel');

router.use(express.json());

router.get('/', async (req, res)=> {
    try {
        const zones = await Zone.find();
        // console.log("this is the zones", zones);
        res.json(zones);
    } catch (error) {
        res.status(500).json({error: "Error fetching zones"});
    }
});

router.post('/register', async (req, res)=> {
    try {
        const zone = new Zone(req.body);
        const savedZone = await zone.save();
        console.log("this is the saved zone", savedZone);
        res.status(201).json(savedZone);
    } catch (error) {
        res.status(500).json({error: "Error creating zone"});
    }
});


module.exports = router;




