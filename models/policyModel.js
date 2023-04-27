const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    policy_type: {
        type: String,
        enum : ['single','package'],
        default: 'single'
    },
    pstart: {
        type: Date,
        // min: '1987-09-28',
        // max: '1994-05-23'
    },
    pend: {
        type: Date,
        // min: '1987-09-28',
        // max: '1994-05-23'
    },
    pnumber: {
        type: String,
        unique: true, 
    },
    premium_amount: {
        type: Number,
    },
    premium_amount_written: {
        type: Array
    },
    account_type: {
        type: String,
        enum : ['commercial','personal'],
        default: 'personal'
    },
    mode: Number,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    }
})

module.exports = mongoose.model('policy', schema);