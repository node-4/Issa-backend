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
                }
        }],
        residentGuardianSignature: {
                type: String,
        }
});
const InformedConsent = mongoose.model('informedConsentForMedication', informedConsentSchema);
module.exports = InformedConsent;
