const mongoose = require("mongoose");
const schema = mongoose.Schema;
const clinicalOversightSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        date: {
                type: Date,
        },
        beginTime: {
                type: String,
        },
        endTime: {
                type: String,
        },
        lengthOfTime: {
                type: String,
        },
        conductedViaRemoteTeleConferenceWithAudioVideo: {
                type: Boolean
        },
        conductedViaInPerson: {
                type: Boolean
        },
        clinicalOversightTypeIndividual: {
                type: Boolean
        },
        clinicalOversightTypeGroup: {
                type: Boolean
        },
        participants: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        topicsAddressedUniqueTreatmentNeeds: {
                type: Boolean
        },
        topicsAddressedEnhancingSkills: {
                type: Boolean
        },
        topicsAddressedAssessmentOrTreatmentPlan: {
                type: Boolean
        },
        topicsAddressedStaffTrainingPlan: {
                type: Boolean
        },
        topicsAddressedJobDutiesDirection: {
                type: Boolean
        },
        additionalComments: {
                type: String,
        },
        opportunitiesForTraining: {
                type: String,
        },
        bhpNameAndCredentials: {
                type: String,
        },
        bhpSignature: {
                type: String,
        },
        administratorName: {
                type: String,
        },
        administratorSignature: {
                type: String,
        },
});
const ClinicalOversight = mongoose.model("ClinicalOversight", clinicalOversightSchema);
module.exports = ClinicalOversight;
