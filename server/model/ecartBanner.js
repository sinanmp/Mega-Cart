const mongoose = require("mongoose");

const EcartBanner = new mongoose.Schema({
    imageUrl:String 
});

const EBanner = new mongoose.model("Ebanner",EcartBanner);
module.exports = EBanner;