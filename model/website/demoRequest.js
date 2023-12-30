const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
        companyName: {
                type: String,
        },
        firstName: {
                type: String
        },
        lastName: {
                type: String
        },
        timeZone: {
                type: String
        },
        email: {
                type: String
        },
        phoneNumber: {
                type: String
        },
        hearAboutUs: {
                type: String
        },
        describe: {
                type: String
        },
        requestStatus: {
                type: String,
                enum: ["Pending", "Close"],
                default: "Pending"
        },
}, { timestamps: true })

module.exports = mongoose.model('demoRequest', blogSchema)