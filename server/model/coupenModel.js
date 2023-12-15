const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  createdAt: {       
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  expired:{
    type: Boolean,
    default: false,
  }
});

const CouponDb = new mongoose.model("CouponDb", CouponSchema);
module.exports = CouponDb;