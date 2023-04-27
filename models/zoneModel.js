const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city'
    },
    zip: String
})

module.exports = mongoose.model('zone', schema);