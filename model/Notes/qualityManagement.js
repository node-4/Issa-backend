const mongoose = require("mongoose");
const schema = mongoose.Schema;
const monthlyReportSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        dateOfBirth: {
                type: Date,
        },
        areasImproved: {
                type: String,
        },
        dataCollectionPatientChart: {
                type: Number,
        },
        dataCollectionIncidentReports: {
                type: Number,
        },
        dataCollectionAdmissions: {
                type: Number,
        },
        dataCollectionDischarges: {
                type: Number,
        },
        dataCollectionClientsVisitedHospital: {
                type: Number,
        },
        dataCollectionFalls: {
                type: Number,
        },
        dataCollectionMedicationErrors: {
                type: Number,
        },
        dataCollectionInfectiousDisease: {
                type: Number,
        },
        dataCollectionClientsRefusingMedications: {
                type: Number,
        },
        dataCollectionClientsRefusingAppointments: {
                type: Number,
        },
        areasNonCompliance: {
                type: String,
        },
        trends: {
                type: String,
        },
        staffName: {
                type: String,
        },
        staffSignature: {
                type: String,
        },
        date: {
                type: Date,
                default: Date.now,
        },
        type: {
                type: String,
                enum: ["quarterly", "monthly"]
        },
});
const MonthlyReport = mongoose.model("qualityManagement", monthlyReportSchema);
module.exports = MonthlyReport;
