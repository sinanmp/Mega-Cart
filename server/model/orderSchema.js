const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username:String,
  email: {
    type: String,
    required: true,
  },
  products: {
    type:Array
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    Address: {
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true
    },
    house_no:{
        type: Number,
        required: true
    },
    postcode:{
        type: Number,
        required: true
    },
    AlternateNumber:{
        type: Number,
        required: true
    }
},

  status: {
    type: String,
    enum: ['pending', 'Shipped', 'Delivered','Canceled','Returned'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  PaymentMethod: {
    type: String,
    required: true,
  },
  singlePrdCount:Number,
    reasonCorR:{
    type: String,
    default:'none'
   },
   takingFromWallet:Number
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
