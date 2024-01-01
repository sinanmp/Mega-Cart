const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
      
    },
    discription:{
        type : String
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    active:{
        type:Boolean,
        default:true
    }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;