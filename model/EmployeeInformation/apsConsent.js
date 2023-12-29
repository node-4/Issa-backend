const mongoose = require('mongoose');
const schema = mongoose.Schema;
const apsSearchConsentSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeName: {
                type: String,
        },
        employeeSignature: {
                type: String,
        },
        administratorName: {
                type: String,
        },
        administratorSignature: {
                type: String,
        },
        date: {
                type: Date,
        },
        classification: {
                type: String,
        },
        dateOfIncident: {
                type: Date,
        },
        noRecordFound: {
                type: Boolean,
                required: false,
        },
});
const APSSearchConsent = mongoose.model('APSSearchConsent', apsSearchConsentSchema);
module.exports = APSSearchConsent;
