const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        heading: {
                type: String,
        },
        subHeading: {
                type: String,
        },
        title: {
                type: String,
        },
        description: {
                type: String,
        },
        faqs: [{
                question: {
                        type: String,
                },
                answer: {
                        type: String,
                }
        }],
        details: {
                type: Array,
        },
        type: {
                type: String,
                enum: ["FAQ", "PRICING"]
        },
        totalUser: {
                type: Number,
        },
        perUser: {
                type: Number,
        },
        name: {
                type: String,
        },
}, { timestamps: true })

module.exports = mongoose.model('pricing', blogSchema)