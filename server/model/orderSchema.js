const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
  },
  products: [{
    prId:String,
    pname: {
      type: String,
    },
    prd_images: {
      type: [String],
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    additional_info: String,
    discount: {
      type: Number,
    },
    brand: String,
    price: {
      type: Number,
    },
    purchase: {
      type: Number,
    },
    reviews: [{
      feedback: String,
      rating: Number,
    }],
    active: {
      type: Boolean,
      default: true,
    },
    unlist: {
      type: Boolean,
      default: false,
    },
    catStatus: {
      type: Boolean,
      default: true,
    },
    Ofprice: Number,
    cartQuantity: {
      type: Number,
      default: 1,
    },
    discountedPrice: {
      type: Number,
    },
    IndividualStatus: {
      type: String,
      enum: ['pending', 'Shipped', 'Delivered', 'Canceled', 'Returned'],
      default: 'pending',
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    Address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    house_no: {
      type: Number,
      required: true,
    },
    postcode: {
      type: Number,
      required: true,
    },
    AlternateNumber: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'Shipped', 'Delivered', 'Canceled', 'Returned'],
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  PaymentMethod: {
    type: String,
    required: true,
  },
  singlePrdCount: Number,
  reasonCorR: {
    type: String,
    default: 'none',
  },
  takingFromWallet: {
    type:Number,
    default:0
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
