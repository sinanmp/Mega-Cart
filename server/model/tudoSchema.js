const mongoose = require("mongoose");

const objectId=mongoose.Types.ObjectId

const Schema = new mongoose.Schema({
    text: {
        type:String , 
        unique: true
    },
    checked:{
        type:Boolean,
        default:false
    }
});


const tudoDb = mongoose.model("tudo", Schema);

module.exports = tudoDb;