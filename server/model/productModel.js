const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
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
  stock: {
    type: Number,
    default: 0,
  },
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
  cartQhantity:{
    type:Number,
    default:1
  },
  discountedPrice:{
    type:Number,
  },
  orderStatus:{
    type:String,
    enum: ['pending', 'Shipped', 'Delivered','Canceled','Returned'],
    default: 'pending'
  }

});

productsSchema.pre('save', function (next) {
  if (this.price && this.discount) {
      const curruntdiscount = (this.price * this.discount) / 100;
      this.discountedPrice =this.price-curruntdiscount
  }
  next();
})




productsSchema.index({ pname: 'text' });
const productdb = mongoose.model('product', productsSchema);

module.exports = productdb;
