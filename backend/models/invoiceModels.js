const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const invoiceSchema= new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    items: {
        type: Array,
        required: false
    }
},

{timestamps: true}
)

invoiceSchema.plugin(uniqueValidator)

module.exports = mongoose.model("invoiceSchema", invoiceSchema)