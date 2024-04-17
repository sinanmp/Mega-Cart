const mongoose = require("mongoose");

const EcartSchema = new mongoose.Schema({
      pname : {
        type: String
      },
      price:Number,
      dicPrice:Number,
      imageUrl:String,
      discription:String,
      catogery:String,
      quantity:Number
});

const ecartDb = new mongoose.model("ecartDb", EcartSchema);
module.exports = ecartDb;