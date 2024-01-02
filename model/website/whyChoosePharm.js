const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        title: {
                type: String,
        },
        description: {
                type: String,
        },
        dataArray: [{
                name: {
                        type: String,
                },
        }],
}, { timestamps: true })

module.exports = mongoose.model('whyChoosePharm', blogSchema)