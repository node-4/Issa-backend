const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        title: {
                type: String,
        },
        description: {
                type: String,
        },
        image: {
                type: String
        }
}, { timestamps: true })

module.exports = mongoose.model('ourFeatures', blogSchema)