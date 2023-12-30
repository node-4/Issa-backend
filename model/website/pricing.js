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
        till: {
                type: String,
                enum: ["10", "11-100", "101+"]
        },
}, { timestamps: true })

module.exports = mongoose.model('pricing', blogSchema)