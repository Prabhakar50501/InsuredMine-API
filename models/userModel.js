const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstname: String,
    account_name: String,
    zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'zone'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agent"
    },
    dob: {
        type: Date
    },
    active_policy: Boolean,
    phone: String,
    address: String,
    producer: String,
    csr: String,
    gender: String,
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'policy'
    },
    type: String,
    email: {
        type: String,
        unique: false,
    },
})

module.exports = mongoose.model('user', schema);