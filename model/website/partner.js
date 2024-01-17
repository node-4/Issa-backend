const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        title: {
                type: String,
        },
        description: {
                type: String,
        },
        dataArray: [{
                image: {
                        type: String,
                },
                description: {
                        type: String,
                },
        }],
}, { timestamps: true })

module.exports = mongoose.model('partner', blogSchema)