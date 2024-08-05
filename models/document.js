const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    managementType: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },

    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    records: {
        type: Number,
    },
    status:{
        type: String,
        default: 'unanalyzed'
    },
    

}, {
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);

