const express = require('express');
const router = express.Router();
const Airport = require('../models/AirportModel');

router.get('/', async (req, res) => {  // this function is for getting all the airports from the database
    try {
        const airports = await Airport.find();
        res.status(200).json(airports);
    }
    catch (error) {
        res.status(500).json({error: "Error fetching airports"});
    }
});

module.exports = router;