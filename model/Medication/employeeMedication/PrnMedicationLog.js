const mongoose = require('mongoose');
const schema = mongoose.Schema;
const prnMedicationLogSchema = new mongoose.Schema({
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
                type: String
        },
        medicationAndStrength: {
                type: String
        },
        instructions: {
                type: String
        },
        prescriberName: {
                type: String
        },
        site: {
                type: String
        },
        tableData: [{
                date: {
                        type: Date
                },
                time: {
                        type: String
                },
                tabsGiven: {
                        type: Number
                },
                reason: {
                        type: String
                },
                residentInitials: {
                        type: String
                },
                staffInitials: {
                        type: String
                },
                timeReevaluated: {
                        type: String
                },
                responseCode: {
                        type: String,
                        enum: ['A', 'B', 'C', 'D', 'E'],
                },
                staffReevaluatedInitials: {
                        type: String
                },
        }],
        staff: [{
                staffNameAndSignature: {
                        type: String
                },
                staffInitials: {
                        type: String
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
});
const PRNMedicationLog = mongoose.model('PrnMedicationLog', prnMedicationLogSchema);
module.exports = PRNMedicationLog;
