const mongoose = require('mongoose')
const schema = mongoose.Schema

const otpVerification = new mongoose.Schema({
    email: String,
    user: String,
    otp: Number,
    createdAt: Date,
    expiresAt: Date
})
const OTPverify = mongoose.model("otpVerification", otpVerification)

module.exports = OTPverify