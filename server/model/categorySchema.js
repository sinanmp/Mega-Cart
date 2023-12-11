const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

const categories = new mongoose.model("categories", categorySchema)

module.exports = categories