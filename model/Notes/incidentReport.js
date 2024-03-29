const mongoose = require("mongoose");
const schema = mongoose.Schema;
const incidentReportSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        dateOfIncident: {
                type: Date,
                required: true,
        },
        timeOfIncident: {
                type: String,
                required: true,
        },
        employeesInvolved: [{
                type: schema.Types.ObjectId,
                ref: "User",
        }],
        residentsInvolved: [{
                type: schema.Types.ObjectId,
                ref: "User",
        }],
        personObservingReporting: {
                type: String,
        },
        incidents: {
                type: Array
        },
        levelOfSeverity: {
                type: Array
        },
        eventDetails: {
                type: String,
                required: true,
        },
        medicationErrorsMissedDose: {
                type: Boolean,
                default: false
        },
        medicationErrorsRefusedMedication: {
                type: Boolean,
                default: false
        },
        medicationErrorsWrongClient: {
                type: Boolean,
                default: false
        },
        medicationErrorsWrongTime: {
                type: Boolean,
                default: false
        },
        medicationErrorsWrongMed: {
                type: Boolean,
                default: false
        },
        medicationErrorsNone: {
                type: Boolean,
                default: false
        },
        actionsTakenSenttoERHospital: {
                type: Boolean,
                default: false
        },
        actionsTakenFirstAid: {
                type: Boolean,
                default: false
        },
        actionsTakenNoMedicalCareRequired: {
                type: Boolean,
                default: false
        },
        CareRefused: {
                type: Boolean,
                default: false
        },
        actionsTakenFireDepartmentCalled: {
                type: Boolean,
                default: false
        },
        actionsTakenPoliceCalled: {
                type: Boolean,
                default: false
        },
        actionsTakenReferredtoAdministratorRiskManagement: {
                type: Boolean,
                default: false
        },
        actionsTakenMaintenanceCalledWorkOrderCompleted: {
                type: Boolean,
                default: false
        },
        actionsTakenOther: {
                type: Boolean,
                default: false
        },
        actionsTakenOtherComment: {
                type: String,
        },
        abuseNeglectInvolved: {
                type: Boolean,
                default: false
        },
        abuseNeglectInvolvedifYes: {
                type: String,
                default: false
        },
        notificationsFamily: {
                type: Boolean,
                default: false
        },
        notificationsGuardian: {
                type: Boolean,
                default: false
        },
        notificationsCaseManager: {
                type: Boolean,
                default: false
        },
        notificationsOther: {
                type: Boolean,
                default: false
        },
        notificationIfOther: {
                type: String,
                default: false
        },
        notificationDate: {
                type: Date,
        },
        notificationTime: {
                type: String,
        },
        modeEmail: {
                type: Boolean,
                default: false
        },
        modePhoneCall: {
                type: Boolean,
                default: false
        },
        modeInPerson: {
                type: Boolean,
                default: false
        },
        modeOther: {
                type: Boolean,
                default: false
        },
        savedSignedPartA: {
                type: String,
        },
        reportCompletedBy: {
                type: String,
        },
        investigationDetails: {
                type: String,
        },
        investigationRecommendationsAndActions: {
                type: String,
        },
        investigationFollowUp: {
                type: String,
        },
        investigationCompletedBy: {
                type: String,
        },
        investigationCompletionDate: {
                type: Date,
        },
        savedSignedPartB: {
                type: String,
        },
        partTypeB: {
                type: Boolean,
                default: false
        },
});

const IncidentReport = mongoose.model("IncidentReport", incidentReportSchema);

module.exports = IncidentReport;
