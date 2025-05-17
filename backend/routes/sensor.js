const express = require('express');
const Sensor = require('../models/sensorData');
const authMiddleware = require('../middleware/authMiddleware');
const sensorController = require("../controllers/sensorController");
const router = express.Router();

router.get('/', sensorController.getSensorData);
router.post('/add', sensorController.addSensorData);

module.exports = router;


