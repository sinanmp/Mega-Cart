const mongoose = require("mongoose");

const objectId=mongoose.Types.ObjectId

const Schema = new mongoose.Schema({
    email:String,
    title:String,
    productId:{
        type:objectId,
        ref: "product"
    },
    rating:{
        type:Number,
        default:1
    },
    description:String
});


const reviewDb = mongoose.model("reviews", Schema);

module.exports = reviewDb;