const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const attitudeEnum = ["cooperative", "Focused", "Suspicious", "Distracted"];
const qualityEnum = ["Attentive", "Supportive", "Sharing", "Intrusive", "Resistant"];
const appearanceEnum = ["Neat", "Unkept", "Inappropriate", "Bizarre", "Other"];
const moodEnum = ["Normal", "Euthymic", "Anxious", "Depressed", "Euphoric", "Irritable"];
const progressEnum = ["Deterioration", "No Progress", "Small Progress", "Good Progress", "Goal Achieved"];
const therapySessionSchema = new mongoose.Schema({
        employeeId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
        },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        totalDuration: { type: String, required: true },
        behaviorTech: { type: String, required: true },
        location: { type: String, required: true },
        topic: {
                type: mongoose.Schema.ObjectId,
                ref: "bhrfTherapyTopic",
        },
        residentId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
        },
        residentCompletedSession: {
                type: Boolean,
                default: false
        },
        attitude: {
                type: [String],
                enum: attitudeEnum,
        },
        treatmentGoalsAddressed: {
                type: Boolean,
                default: false
        },
        residentParticipation: {
                type: Number,
                required: true
        },
        residentQuality: {
                type: [String],
                enum: qualityEnum,
        },
        significantInfoNotSpecifiedAbove: {
                type: Boolean,
                default: false
        },
        residentAppearance: {
                type: [String],
                enum: appearanceEnum,
        },
        residentMood: {
                type: [String],
                enum: moodEnum,
        },
        residentProgress: {
                type: [String],
                enum: progressEnum,
        },
        pleaseSpecify: {
                type: String,
        },
        residentResponse: {
                type: String
        },
        significantInfoNotSpecifiedAbove1: {
                type: Boolean,
                default: false
        },
        pleaseSpecify1: {
                type: String,
        },
        behavioralHealthProfessionalName: {
                type: String, required: true
        },
        behavioralHealthProfessionalSignature: {
                type: String, required: true
        },
        behavioralTechnicianName: {
                type: String, required: true
        },
        behavioralTechnicianSignature: {
                type: String, required: true
        },
});

therapySessionSchema.plugin(mongoosePaginate);
therapySessionSchema.plugin(mongooseAggregatePaginate);

const TherapySession = mongoose.model('TherapySession', therapySessionSchema);

module.exports = TherapySession;
