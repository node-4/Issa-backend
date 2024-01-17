const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        window: {
                type: String,
        },
        mac: {
                type: String,
        },
        android: {
                type: String,
        },
        ios: {
                type: String,
        },
        specification: {
                type: String,
        },
        mobileCapability: {
                type: String,
        },
}, { timestamps: true })

module.exports = mongoose.model('downloadPage', blogSchema)