const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    minimum_fee: {
        type: Number,
    },

    management: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    status: {
        type: String,
        default: 'not reviewed'
    },
    NUMERO_DE_LA_ORDEN: {
        type: Number,
        
    }
}, {
    strict: false
})

module.exports = mongoose.model('Record', recordSchema);
