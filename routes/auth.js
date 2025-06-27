// routes/auth.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { generateOtp, sendOtpSms } = require('../utils/otpService');
// const jwt = require('jsonwebtoken'); // For real authentication
// const config = require('../config/config'); // For JWT secret
const otpExpiryMinutes = 5; // OTP valid for 5 minutes

// @route   POST /api/auth/send_otp
// @desc    Sends OTP to the provided phone number
// @access  Public
router.post('/send_otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = new User({ phoneNumber });
        }

        const otp = generateOtp();
        user.otp = otp;
        user.otpGeneratedAt = new Date();
        await user.save();

        // In real app, check send success/failure
        await sendOtpSms(phoneNumber, otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Server error during OTP sending' });
    }
});

// @route   POST /api/auth/verify_otp
// @desc    Verifies the provided OTP
// @access  Public
router.post('/verify_otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user || user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Check OTP expiry
        const now = new Date();
        const otpTime = user.otpGeneratedAt;
        if (!otpTime || (now - otpTime) / (1000 * 60) > otpExpiryMinutes) {
            return res.status(401).json({ message: 'OTP expired' });
        }

        // OTP verified successfully, clear OTP for security
        user.otp = null;
        user.otpGeneratedAt = null;
        await user.save();

        // In a real application, you'd generate and send a JWT token here
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'OTP verified successfully',
            userId: user._id, // Send userId for frontend to use
            token: "fake-jwt-token-" + user._id // Placeholder token
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
});

module.exports = router;
