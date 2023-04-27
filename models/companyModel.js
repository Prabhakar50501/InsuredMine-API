const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    category: [String]
})

module.exports = mongoose.model('company', schema);