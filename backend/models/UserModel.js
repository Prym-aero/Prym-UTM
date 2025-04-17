const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // Excluded from queries by default
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isVerified: { type: Boolean, default: false }, // Tracks if email is verified
    refreshToken: { type: String, default: null }, // Stores the refresh token
    image: { type: String }, //to store the iamge in base64 form
    phone: {type: String, unique: true}, //to store the phone number of the user
    country: {type: String}, //to store the country of the user
    city: {type: String}, //to store the city of the user
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
