const mongoose = require("mongoose");


const Schema = new mongoose.Schema({
    prId: {
        type: String
    },
    email: String,
});

const wishdb = mongoose.model("wishdb", Schema);

module.exports = wishdb;