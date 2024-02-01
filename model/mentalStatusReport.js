const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        before: {
                Appearance: {
                        type: String,
                        enum: ['Well groomed', 'Casually groomed', 'Tattered'],
                },
                behaviorPsychomotorActivity: {
                        type: String,
                        enum: ["Anxiety", "Depression", "Crying", "Racing thoughts"],
                },
                Orientation: {
                        type: String,
                        enum: ["Oriented x3 (to time, place, situation)", "Partly oriented"]
                },
                Affect: {
                        type: String,
                        enum: ["Normal in range", "Appropriate to the situation", "Congruent with mood", "Blunted or restricted (little expressed emotion)", "Flat (no expressed emotion)", "Labile or very variable"]
                },
                SpeechAndThought: {
                        type: String,
                        enum: ["Fluent, Normal rate", "Normal volume", "Halting speech", "Word-finding difficulties", "Selective mute", "Halting speech", "Word-finding difficulties"]
                },
                thoughtContent: {
                        type: String,
                        enum: ["Normal thought content", "Fixed ideas", "Delusions", "Hallucinations (auditory and/or visual, etc.)"]
                },
                orientationAndConsciousness: {
                        type: String,
                        enum: ["Alert", "HyperVigilant", "Drowsy", "lethargic", "Stuporous", "Asleep", "Comatose", "Confused", "Fluctuating"]
                },
                memoryAndIntelligence: {
                        type: String,
                        enum: ["Intact for recent memory", "Intact for remote memory", "Limited or deficient for recent and / or remote memory"]
                },
                ReliabilityJudgmentAndInsight: {
                        type: String,
                        enum: ["Good judgement", "Fair judgement", "Poor judgement"]
                },
                mood: {
                        type: String,
                        enum: ["NormalOrEuthymic", "Sad or dysphoric", "Hopeless", "Variable mood", "Irritable", "Worried or anxious", "Expansive or elevated mood"]
                },
        },
        after: {
                Appearance: {
                        type: String,
                        enum: ['Well groomed', 'Casually groomed', 'Tattered'],
                },
                behaviorPsychomotorActivity: {
                        type: String,
                        enum: ["Anxiety", "Depression", "Crying", "Racing thoughts"],
                },
                Orientation: {
                        type: String,
                        enum: ["Oriented x3 (to time, place, situation)", "Partly oriented"]
                },
                Affect: {
                        type: String,
                        enum: ["Normal in range", "Appropriate to the situation", "Congruent with mood", "Blunted or restricted (little expressed emotion)", "Flat (no expressed emotion)", "Labile or very variable"]
                },
                SpeechAndThought: {
                        type: String,
                        enum: ["Fluent, Normal rate", "Normal volume", "Halting speech", "Word-finding difficulties", "Selective mute", "Halting speech", "Word-finding difficulties"]
                },
                thoughtContent: {
                        type: String,
                        enum: ["Normal thought content", "Fixed ideas", "Delusions", "Hallucinations (auditory and/or visual, etc.)"]
                },
                orientationAndConsciousness: {
                        type: String,
                        enum: ["Alert", "HyperVigilant", "Drowsy", "lethargic", "Stuporous", "Asleep", "Comatose", "Confused", "Fluctuating"]
                },
                memoryAndIntelligence: {
                        type: String,
                        enum: ["Intact for recent memory", "Intact for remote memory", "Limited or deficient for recent and / or remote memory"]
                },
                ReliabilityJudgmentAndInsight: {
                        type: String,
                        enum: ["Good judgement", "Fair judgement", "Poor judgement"]
                },
                mood: {
                        type: String,
                        enum: ["NormalOrEuthymic", "Sad or dysphoric", "Hopeless", "Variable mood", "Irritable", "Worried or anxious", "Expansive or elevated mood"]
                },
        }
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("mentalStatusReport", addressSchema);