const Sensor = require('../models/sensorData');
const Drone = require('../models/DroneModel');


exports.getSensorData = async (req, res) => {
    try {
        const sensors = await Sensor.find();

        if (!sensors) return res.status(400).json({message:"not sensor data found"});

        res.status(200).json({message: "sensor data send successfully", sensors});
    } catch (err) {
        console.error("the error is : ", err);
        res.status(500).json({message:"internal server error", error:err});
    }
};


exports.addSensorData = async (req, res) => {
    try {
        const {droneId,accelX, accelY, accelZ, roll, pitch, yaw,bmpTemp, pressure, latitude, longitude, altitude, battery } = req.body;

        if (!droneId && !accelX && !accelY && !accelZ && !roll && !pitch && !yaw && !bmpTemp && !pressure && !latitude && !longitude && !altitude && !battery) 
            return res.status(400).json({message:"filed required"});

        // const drone = await Drone.findById(droneId);
        // if(!drone) return res.status(400).json({message: "the drone not found "});

        const sensorData = new Sensor({droneId,accelX, accelY, accelZ, roll, pitch, yaw,bmpTemp, pressure, latitude, longitude, altitude, battery});
        console.log(sensorData);

        await sensorData.save();

        res.status(200).json({message:"sensor data saved successfully", sensorData});

        
    } catch (err) {
        console.error('the error is : ', err);
        res.status(500).json({message:"internal server error", error: err});
    }
};
