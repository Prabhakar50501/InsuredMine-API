const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstname: String,
    account_name: String,
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agent"
    },
    active_policy: {
        type: Boolean,
    },
    dob: {
        type: Date
    },
    phone: String,
    address: String,
    producer: String,
    csr: String,
    gender: {
        type: String,
        enum : ['','male', 'female'],
        default: ''
    },
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'policy'
    },
    type: {
        type: String,
        enum : ['','active'],
        default: ''
    },
    email: {type: String, unique: true}
})

module.exports = mongoose.model('user', schema);