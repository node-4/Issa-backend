const mongoose = require('mongoose');
const schema = mongoose.Schema;
const opioidCountSchema = new mongoose.Schema({
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
        location: {
                type: String,
        },
        medicationName: {
                type: String,
        },
        dose: {
                type: String,
        },
        prescriptionInstruction: {
                type: String,
        },
        prescribingProvider: {
                type: String,
        },
        beginningMedCount: {
                type: Number,
        },
        monthYear: {
                type: Date,
        },
        data: [{
                date: {
                        type: Date,
                },
                shift: {
                        type: String,
                },
                painLevel: {
                        type: String,
                },
                numberOfTabsGiven: {
                        type: Number,
                },
                beginningCount: {
                        type: Number,
                },
                endingCount: {
                        type: Number,
                },
                currentStaffOnShiftSignature: {
                        type: String,
                },
                currentStaffOnShiftSignatureDate: {
                        type: Date,
                        default: Date.now,
                },
                currentStaffOnShiftSignatureTime: {
                        type: String
                },
                currentStaffOnShiftSignatureSaveAsDraft: {
                        type: Boolean,
                        default: false
                },
                relievingStaffSignature: {
                        type: String,
                },
                relievingStaffSignatureDate: {
                        type: Date,
                        default: Date.now,
                },
                relievingStaffSignatureTime: {
                        type: String
                },
                relievingStaffSignatureSaveAsDraft: {
                        type: Boolean,
                        default: false
                },
        }],
        staff: [{
                name: {
                        type: String,
                },
                signature: {
                        type: String,
                },
                initials: {
                        type: String,
                },
        }],
        countType: {
                type: String,
                enum: ["medication", "Opioid"],
        },
});
const OpioidCount = mongoose.model('medicationOpioidCount', opioidCountSchema);

module.exports = OpioidCount;
