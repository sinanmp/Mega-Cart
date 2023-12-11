const mongoose = require("mongoose");


const Schema = new mongoose.Schema({
  pname:String,
  prId: {
    type: String,
  },
  email: String,
  cartQhantity:Number,
  prd_images:{
    type:[String]
  }
  ,category: {
    type: String
},
description: {
    type: String
},
additional_info: String,    
stock: {
    type: Number,
    default: 0
},
discount: {
    type: Number,
},
price: {
    type: Number,
},
purchase: {
    type: Number,
},
reviews: [{
    feedback: String,
    rating: Number
}],
active: {
    type: Boolean,
    default: true
},
unlist: {
    type: Boolean,
    default: false
},
catStatus: {
    type: Boolean,
    default: true
},
Ofprice:Number,
discountedPrice:Number
});

const cartDb = mongoose.model("cartDb", Schema);

module.exports = cartDb;


