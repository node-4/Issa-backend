const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        title: {
                type: String,
        },
        image: {
                type: String
        },
        link: {
                type: String
        }
}, { timestamps: true })
module.exports = mongoose.model('ebook', blogSchema)