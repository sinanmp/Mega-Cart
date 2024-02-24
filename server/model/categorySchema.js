const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
})

const categories = new mongoose.model("categories", categorySchema)

module.exports = categories