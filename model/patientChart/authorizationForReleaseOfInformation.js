const mongoose = require('mongoose');
const schema = mongoose.Schema;
const releaseInfoAuthorizationSchema = new mongoose.Schema({
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
        residentName: {
                type: String,
        },
        dateOfBirth: {
                type: Date,
        },
        authorizedPersonName: {
                type: String,
        },
        authorizedPersonAgency: {
                type: String,
        },
        authorizedPersonAddress: {
                type: String,
        },
        authorizedPersonPhone: {
                type: String,
        },
        authorizedPersonFax: {
                type: String,
        },
        authorizedPersonEmail: {
                type: String,
        },
        dropDown: {
                type: [String],
                enum: ["Mental Health", "Substance abuse", "Medical information", "Pharmacy, Current medication", "Psychotherapy notes", "Progress notes", "Immunization records"]
        },
        purposeOfDisclosure: {
                type: String,
        },
        companyName: {
                type: String,
        },
        expirationFrom: {
                type: Date,
        },
        expirationTo: {
                type: Date,
        },
        revocation: {
                type: String,
        },
        specify: {
                type: String,
        },
        companyName: {
                type: String,
        },
        relationshipToPerson: {
                type: String,
        },
        witness: {
                type: String,
        },
        signature: {
                type: String,
        },
        dateSigned: {
                type: Date,
                default: Date.now,
        },
        signedTime: {
                type: String,
        },
        saveAsDraft: {
                type: Boolean,
                default: false
        },
});
const ReleaseInfoAuthorization = mongoose.model('authorizationForReleaseOfInformation', releaseInfoAuthorizationSchema);
module.exports = ReleaseInfoAuthorization;