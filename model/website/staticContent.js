const mongoose = require('mongoose');
const staticContent = mongoose.Schema({
    terms: {
        type: String,
    },
    privacy: {
        type: String,
    },
    type: {
        type: String,
        enum: ["TERMS", "PRIVACY"],
    },
}, { timestamps: true })
module.exports = mongoose.model('staticContent', staticContent);