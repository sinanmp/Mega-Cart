const mongoose = require('mongoose')
const schema = mongoose.Schema

const otpVerification = new mongoose.Schema({
    email: String,
    user: String,
    otp: Number,
    createdAt: Date,
    expiresAt: { type: Date, expires: '5m', default: Date.now + 5 * 60 * 1000 } 
})
const OTPverify = mongoose.model("otpVerification", otpVerification)

module.exports = OTPverify