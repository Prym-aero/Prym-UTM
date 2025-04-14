const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');
const User = require('../models/UserModel');
const nodeMailer = require('nodemailer');
require('dotenv').config();

const otpStorage = {};

// verify email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStorage[email] = { otp, expiresAt: Date.now() + 300000 };

        console.log("Generated OTP:", otp);

        // Debugging .env variables
        console.log("Email:", process.env.EMAIL);
        console.log("Email Password:", process.env.EMAIL_PASSWORD);

        // Nodemailer setup
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: { 
                user: process.env.EMAIL, 
                pass: process.env.EMAIL_PASSWORD 
            },
        });
        
        transporter.verify((error, success) => {
            if (error) {
                console.error("Transporter Error:", error);
            } else {
                console.log("Mail Server is Ready to Send Messages:", success);
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "OTP for password reset",
            text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
        };

        // Send Email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending OTP", error: error.message });
            }
            console.log("Email sent successfully:", info.response);
            console.log("Email details:", mailOptions);
            res.json({ message: "OTP sent successfully" });
        });

        res.json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        console.log("Received request for OTP verification:", { email, otp });

        if (!otpStorage[email]) {
            console.log("OTP not found for:", email);
            return res.status(404).json({ message: "OTP not found" });
        }

        const storedOtp = otpStorage[email];

        if (Date.now() > storedOtp.expiresAt) {
            delete otpStorage[email];
            console.log("OTP expired for:", email);
            return res.status(400).json({ message: "OTP expired" });
        }

        if (String(storedOtp.otp) !== String(otp)) {
            console.log("Invalid OTP. Stored:", storedOtp.otp, "Received:", otp);
            return res.status(400).json({ message: "Invalid OTP" });
        }

        console.log("OTP verified successfully for:", email);
        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put('/reset-password', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) return res.status(404).json({message: "User not found"});

        const hashedPassword = await bycrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error resetting password: ", error);
        res.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;