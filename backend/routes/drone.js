const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const filePath = path.resolve(__dirname, '../data/drone.json'); // Correct path
        // console.log('File path:', filePath); // Debugging line
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Drone data file not found" });
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const drones = JSON.parse(data);
        res.json(drones);
    } catch (error) {
        console.error('Error reading drone data:', error);
        res.status(500).json({ message: 'Error reading drone data' });
    }
});

module.exports = router;
