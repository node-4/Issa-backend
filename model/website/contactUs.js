const mongoose = require('mongoose');
const schema = mongoose.Schema;
const DocumentSchema = schema({
        image: {
                type: String
        },
        supportPhone: {
                type: String
        },
        supportEmail: {
                type: String
        },
        supportText: {
                type: String
        },
        supportFax: {
                type: String
        },
        fb: {
                type: String
        },
        twitter: {
                type: String
        },
        linkedIn: {
                type: String
        },
        youtube: {
                type: String
        },
        instagram: {
                type: String
        },
        saleEmail: {
                type: String
        },
        supportTrainingPhone: {
                type: String
        },
        teamEmail: {
                type: String
        },
        salePhone: {
                type: String
        },
        saleFax: {
                type: String
        },
        address: {
                type: String
        },
        city: {
                type: String
        },
        state: {
                type: String
        },
        pincode: {
                type: String
        },
        hours: {
                type: String
        },
        technicalSupport: {
                type: String
        },
        scheduleTraining: {
                type: String
        },
        emergencyPhone: {
                type: String
        }
}, { timestamps: true })
module.exports = mongoose.model("contactDetails", DocumentSchema);