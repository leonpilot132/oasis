// utils/otpService.js
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendOtpSms = async (phoneNumber, otp) => {
    // In a real application, you would integrate with a third-party SMS service
    // like Twilio, Nexmo, or Firebase Authentication.
    console.log(`SMS: Sending OTP ${otp} to ${phoneNumber}`);

    // Example using Twilio (requires twilio npm package and credentials)
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);

    // try {
    //     await client.messages.create({
    //         body: `Your LeoPizza OTP is: ${otp}`,
    //         to: phoneNumber,
    //         from: process.env.TWILIO_PHONE_NUMBER
    //     });
    //     console.log('OTP SMS sent successfully via Twilio.');
    //     return true;
    // } catch (error) {
    //     console.error('Error sending OTP via Twilio:', error);
    //     return false;
    // }

    return true; // Simulate success for demonstration
};

module.exports = { generateOtp, sendOtpSms };
