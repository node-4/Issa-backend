const mongoose = require('mongoose');
const schema = mongoose.Schema;
const dischargeSummarySchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        clientName: {
                type: String,
                required: true,
        },
        dateOfBirth: {
                type: Date,
        },
        dateOfAdmission: {
                type: Date,
        },
        dateOfDischarge: {
                type: Date,
        },
        presentingIssue: {
                type: String,
        },
        treatmentProvided: {
                type: String,
        },
        progress: {
                type: String,
        },
        medicationUponDischarge: {
                type: String,
        },
        fundsPropertiesUponDischarge: {
                type: String,
        },
        reasonForDischarge: {
                type: String,
        },
        dischargePlanReferralAftercarePlan: {
                type: String,
        },
        patientGuardianSignature: {
                type: String,
        },
        patientGuardianSignatureDate: {
                type: Date,
        },
        staffNameAndTitle: {
                type: String,
        },
        staffSignature: {
                type: String,
        },
        staffSignatureDate: {
                type: Date,
        },
        bhpNameAndCredentials: {
                type: String,
        },
        bhpSignature: {
                type: String,
        },
        bhpSignatureDate: {
                type: Date,
        },
        saveAsDraft: {
                type: Boolean,
                default: false
        },
});
const DischargeSummary = mongoose.model('DischargeSummary', dischargeSummarySchema);
module.exports = DischargeSummary;
