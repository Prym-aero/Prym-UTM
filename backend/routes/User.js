const express = require('express');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../controllers/authMiddleware');
require('dotenv').config(); // Load environment variables
const util = require("util");

const router = express.Router();

const generateToken = (userId) => {
    try {
        const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
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
        // console.log("🔹 Login request received for email:", email);

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            console.error("❌ User not found:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("🔹 User found:", user);

        const validPassword = await bcrypt.compare(password, user.password);
        console.log("🔹 Password comparison result:", validPassword);

        if (!validPassword) {
            console.error("❌ Invalid password for user:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("🔹 Generating token...");
        const token = generateToken(user._id);
        console.log("✅ Token generated:", token);

        console.log("🔹 Storing refresh token in database...");
        await User.updateOne({ _id: user._id }, { $set: { refreshToken: token.refreshToken } });
        console.log("✅ Refresh token stored successfully");

        res.status(200).json({
            message: "Login successful",
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        });

    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }


});

const verifyJwt = util.promisify(jwt.verify);

// Refresh Token
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

        // Check if the refresh token exists in the database
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: "Unauthorized" });

        // Verify the refresh token
        const decoded = await verifyJwt(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!decoded) return res.status(403).json({ message: "Unauthorized" });

        // Generate new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
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
router.put('/update', authMiddleware, async (req, res) => {
    const {userId} = req.user;
    const updates = req.body;

    try {
        const UpdatedUser = await User.findByIdAndUpdate(
            userId,
            {$set:updates},
            { new: true, runValidators: true }

        );

        if (!UpdatedUser) return res.status(404).json({message: "User not foundd"});
        res.status(200).json({message: "User updated successfully", user: UpdatedUser});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Internal server error"});
    }
    

})

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
