const express = require('express');
const User = require('../models/UserModel'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../controllers/authMiddleware');
require('dotenv').config(); // Load environment variables

const router = express.Router();

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// User Registration
router.post('/register', async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);
        res.status(200).json({
            message: "Login successful",
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Refresh Token
router.post("/refresh", (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    });
});

// Get User Profile
router.get('/profile', authMiddleware, async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update Profile
router.put('/profile', authMiddleware, async (req, res) => {
    const { userId } = req.user;
    const { name, email } = req.body;

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== userId) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete Profile
router.delete('/profile', authMiddleware, async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
