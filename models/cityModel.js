const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    state: String,
    zip: [String],
})

module.exports = mongoose.model('city', schema);