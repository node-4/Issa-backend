const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        facititAddress: {
                type: String,
        },
        date: {
                type: Date,
        },
        startTime: {
                type: String,
        },
        endTime: {
                type: String,
        },
        shift: {
                type: String,
        },
        evacuationPersonConduct: {
                type: String,
        },
        evacuationParticipatingEmployee: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        residentsAssistanceEmployee: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        noOfOccupantsEvacuated: {
                type: Number,
        },
        fireAlaramActivationMethod: {
                type: String,
        },
        totalTimeOfEvacuationDrill: {
                type: String,
        },
        condition: {
                type: String,
        },
        problemEncounteredDuringEvacuationDrill: {
                type: String,
        },
        recommendations: {
                type: String,
        },
        planAction: {
                type: String,
        },
        signatureofPersonCompletingDrill: {
                type: String,
        },
}, { timestamps: true });
module.exports = mongoose.model("evacuationandFireDrill", addressSchema);