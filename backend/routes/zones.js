const express = require('express');
const router = express.Router();
const Zone = require('../models/zoneModel');
const authMiddleware = require('../middleware/authMiddleware');

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

router.post('/register',async (req, res)=> {
    try {
        const zone = new Zone(req.body);
        const savedZone = await zone.save();
        console.log("this is the saved zone", savedZone);
        res.status(201).json(savedZone);
    } catch (error) {
        res.status(500).json({error: "Error creating zone"});
    }
});

router.delete('/:id',authMiddleware, async (req, res) => {
    try {
        const zoneId = req.params.id;
        const deletedZone = await Zone.findByIdAndDelete(zoneId);

        if (!deletedZone) {
            res.status(404).json({error: "Zone not found"});
        }

        res.status(200).json({message: "Zone deleted successfully"});

    } catch (error) {
        res.status(500).json({error: "Error deleting zone"});
    }
} )

module.exports = router;




