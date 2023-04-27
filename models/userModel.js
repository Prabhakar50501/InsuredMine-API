const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstname: String,
    account_name: String,
    city: String,
    account_type: {
        type: String,
        enum : ['commercial','personal'],
        default: 'NEW'
    },
    gender: {
        type: String,
        enum : ['','male', 'female'],
        default: ''
    },
    email: {type: String, unique: true}
})

module.exports = mongoose.model('users', schema);