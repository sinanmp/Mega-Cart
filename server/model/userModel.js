const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const addressSchema = new Schema({
//     street: String,
//     city: String,
//     state: String,
//     pinCode: String,
//     country: String,
//   });

var schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: String,
    password: String,
    confirmpassword: String,
    block: String,
    status: {
        type: String
    },
    verified: Boolean,
    address: {
        type: [{
            locality: String,
            country: String,
            house_No:Number,
            district: String,
            state: String,
            city: String,
            altr_number: Number,
            postcode: Number
        }]
    },
    wallet: {
        totalAmount: {
            type: Number,
            default: 0
        },
        transactions: [
            {
                date: { type: Date, default: Date.now },
                category: String,
                amount: Number,
                description:String
            }
        ]
    }
    

});

const userDb = mongoose.model("userdb", schema);

module.exports = userDb;
