const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        date: {
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
        }
}, { timestamps: true })

module.exports = mongoose.model('news', blogSchema)