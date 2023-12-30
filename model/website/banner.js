const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        heading: {
                type: String,
        },
        title: {
                type: String,
        },
        description: {
                type: String,
        },
        image: {
                type: String
        },
        type: {
                type: String,
                enum: ["TOP", "BOTTOM"]
        }
}, { timestamps: true })

module.exports = mongoose.model('banner', blogSchema)