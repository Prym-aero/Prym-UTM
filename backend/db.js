require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
 .then(()=> {
    console.log("Connected to MongoDB Successfully");
 })
 .catch((err)=> {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
 })

 module.exports = mongoose;