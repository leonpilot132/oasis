// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        default: null
    },
    otpGeneratedAt: {
        type: Date,
        default: null
    },
    // In a real app, you'd add fields like 'name', 'address', 'cart', etc.
    // orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] // Example of relationship
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

module.exports = mongoose.model('User', UserSchema);
