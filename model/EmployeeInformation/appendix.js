const mongoose = require('mongoose');
const schema = mongoose.Schema;
const tbScreeningSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        name: {
                type: String,
        },
        date: {
                type: Date,
                default: Date.now,
        },
        preferredContactInformation: {
                type: String,
        },
        positionHiredFor: {
                type: String,
        },
        startDate: {
                type: Date,
        },
        spentMoreThan30DaysAbroad: {
                type: String,
                enum: ['YES', 'NO'],
        },
        closeContactWithActiveTB: {
                type: String,
                enum: ['YES', 'NO'],
        },
        symptomsFever: { type: String, enum: ['YES', 'NO'] },
        symptomsCough: { type: String, enum: ['YES', 'NO'] },
        symptomsBloodySputum: { type: String, enum: ['YES', 'NO'] },
        symptomsUnintendedWeightLoss: { type: String, enum: ['YES', 'NO'] },
        symptomsNightSweats: { type: String, enum: ['YES', 'NO'] },
        symptomsUnexplainedFatigue: { type: String, enum: ['YES', 'NO'] },
        diagnosedWithActiveTB: {
                type: String,
                enum: ['YES', 'NO'],
        },
        diagnosedWithLatentTB: {
                type: String,
                enum: ['YES', 'NO'],
        },
        tbTreatmentHistoryYear: { type: String },
        tbTreatmentHistoryMedication: { type: String },
        tbTreatmentHistoryDuration: { type: String },
        tbTreatmentHistoryCompletedTreatment: { type: String, enum: ['YES', 'NO'] },
        weakenedImmuneSystem: {
                type: String,
                enum: ['YES', 'NO'],
        },
        reviewerSignature: {
                type: String,
        },
        reviewDate: {
                type: Date,
        },
});

const TbScreeningForm = mongoose.model('appendix', tbScreeningSchema);
module.exports = TbScreeningForm;
