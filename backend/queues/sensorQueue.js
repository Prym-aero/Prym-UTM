const { MongoClient } = require('mongodb');
const mongoQueue = require('mongodb-queue');
const SensorData = require('../models/sensorData');

let queue;

async function initializeQueue() {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    const db = client.db('utm'); // Your database name
    
    // Create queue collection
    queue = mongoQueue(db, 'sensor_queue');
    
    // Start processing
    processQueue();
    
    return queue;
}

// Queue processor
async function processQueue() {
    try {
        // Get next message (job)
        const msg = await queue.get();
        
        if (msg) {
            console.log(`Processing sensor data batch`);
            
            // Insert into SensorData collection
            await SensorData.insertMany(msg.payload);
            
            // Acknowledge job completion
            await queue.ack(msg.ack);
            
            // Process next message immediately
            setImmediate(processQueue);
        } else {
            // No messages, check again after 1 second
            setTimeout(processQueue, 1000);
        }
    } catch (err) {
        console.error('Queue processing error:', err);
        setTimeout(processQueue, 5000); // Retry after 5 seconds on error
    }
}

// Add data to queue
async function addToQueue(data) {
    await queue.add(data);
}

module.exports = {
    initializeQueue,
    addToQueue
};