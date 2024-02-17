const mongoose = require('mongoose');
const schema = mongoose.Schema;
const adlTrackingFormSchema = new mongoose.Schema({
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
        warningSigns: {
                type: String,
        },
        internalCopingStrategies: {
                type: String,
        },
        distractionsPeople: [{
                name: {
                        type: String,
                },
                phone: {
                        type: String,
                },
                relationship: {
                        type: String,
                },
        }],
        distractionsPlace: {
                type: String,
        },
        distractionsPlane: {
                type: String,
        },
        helpContactsPeople: [{
                name: {
                        type: String,
                },
                phone: {
                        type: String,
                },
                relationship: {
                        type: String,
                },
        }],
        professionals: [{
                clinicianName: {
                        type: String,
                },
                phone: {
                        type: String,
                },
                relationship: {
                        type: String,
                },
        }],
        localEmergencyHelp: {
                type: String,
        },
        environmentSafetyMedications: {
                type: Array,
        },
        signature: {
                type: String,
        },
        signatureDate: { type: Date, default: Date.now },
        signatureTime: { type: String },
});
const ADLTrackingForm = mongoose.model('residentSafetyPlan', adlTrackingFormSchema);
module.exports = ADLTrackingForm;
