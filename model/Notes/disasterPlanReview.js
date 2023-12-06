const mongoose = require("mongoose");
const disasterPlanReviewSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        facilityAddress: {
                type: String,
        },
        date: {
                type: Date,
                required: true,
        },
        shiftTime: {
                type: String,
        },
        shift: {
                type: String,
        },
        participants: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        critiqueProblemsIdentified: {
                type: String,
        },
        recommendationsForImprovement: {
                type: String,
        },
        nextReviewDate: {
                type: Date,
        },
        reviewCompletedByName: {
                type: String,
        },
        reviewCompletedBySignature: {
                type: String,
        },
        reviewCompletedByDate: {
                type: Date,
        },
});
const DisasterPlanReview = mongoose.model("DisasterPlanReview", disasterPlanReviewSchema);
module.exports = DisasterPlanReview;