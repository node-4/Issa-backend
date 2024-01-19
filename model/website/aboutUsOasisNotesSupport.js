const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        data: [{
                title: {
                        type: String,
                },
                link: {
                        type: String,
                },
        }],
        name: {
                type: String,
        }
}, { timestamps: true })
module.exports = mongoose.model('aboutUsOasisNotesSupport', blogSchema)