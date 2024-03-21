const mongoose = require('mongoose');
const schema = mongoose.Schema;
const informedConsentSchema = new mongoose.Schema({
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
        name: {
                type: String,
        },
        dateOfBirth: {
                type: Date,
        },
        admitDate: {
                type: Date,
        },
        tableDate: [{
                medicationInstructions: {
                        type: String,
                },
                medicationStartDate: {
                        type: Date,
                },
                fewDaysOnly: {
                        type: Number,
                },
                dischargeDate: {
                        type: Date,
                },
                residentGuardianInitial: {
                        type: String,
                },
                staffInitial: {
                        type: String,
                },
        }],
        staff: [{
                initial: {
                        type: String,
                },
                title: {
                        type: String,
                },
                signature: {
                        type: String,
                },
                signatureDate: {
                        type: Date,
                        default: Date.now,
                },
                signatureTime: {
                        type: String
                },
                signatureSaveAsDraft: {
                        type: Boolean,
                        default: false
                },
        }],
        residentGuardianSignature: {
                type: String,
        },
        residentGuardianSignatureDate: {
                type: Date,
                default: Date.now,
        },
        residentGuardianSignatureTime: {
                type: String
        },
        residentGuardianSignatureSaveAsDraft: {
                type: Boolean,
                default: false
        },
});
const InformedConsent = mongoose.model('informedConsentForMedication', informedConsentSchema);
module.exports = InformedConsent;
