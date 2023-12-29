const mongoose = require('mongoose');
const schema = mongoose.Schema;
const formW9Schema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        name: {
                type: String,
        },
        businessName: {
                type: String,
        },
        taxClassification: {
                type: String,
                enum: ['Individual', 'C Corporation', 'S Corporation', 'Partnership', 'Trust/Estate', 'LLC', 'Other'],
        },
        llcTaxClassification: {
                type: String,
                enum: ['C', 'S', 'P'],
        },
        other: {
                type: String,
        },
        exemptionsPayeeCode: {
                type: String,
        },
        exemptionsFatCaExemptionCode: {
                type: String,
        },
        street: {
                type: String,
        },
        city: {
                type: String,
        },
        state: {
                type: String,
        },
        zipCode: {
                type: String,
        },
        requesterName: {
                type: String,
        },
        requesterAddress: {
                type: String,
        },
        accountNumbers: [String],
        tinSsn: {
                type: String,
        },
        tinEin: {
                type: String,
        },
        certificationIsCorrectTIN: {
                type: Boolean,
        },
        certificationIsExemptFromBackupWithholding: {
                type: Boolean,
        },
        certificationIsUSPerson: {
                type: Boolean,
        },
        certificationFatCaCodes: String,
        signature: {
                type: String,
        },
        date: {
                type: Date,
                default: Date.now,
        },
});
const FormW9 = mongoose.model('FW9', formW9Schema);
module.exports = FormW9;
