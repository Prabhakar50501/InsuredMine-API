const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    ptype: String,
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
    account_type: String,
    mode: Number,
    company_name: String,
    company_cat: String
})

module.exports = mongoose.model('policy', schema);