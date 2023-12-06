const mongoose = require("mongoose");
const incidentReportSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
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
                ref: "user",
        }],
        residentsInvolved: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        personObservingReporting: {
                type: String,
        },
        incidentsAltercationVerbal: {
                type: Boolean,
                default: false
        },
        incidentsPropertyLoss: {
                type: Boolean,
                default: false
        },
        incidentsWeapon: {
                type: Boolean,
                default: false
        },
        incidentsRuleViolation: {
                type: Boolean,
                default: false
        },
        incidentsAltercationPhysical: {
                type: Boolean,
                default: false
        },
        incidentsPropertyDamage: {
                type: Boolean,
                default: false
        },
        incidentsContraband: {
                type: Boolean,
                default: false
        },
        incidentsSeizure: {
                type: Boolean,
                default: false
        },
        incidentsViolentThreatSelf: {
                type: Boolean,
                default: false
        },
        incidentsVehicularAccident: {
                type: Boolean,
                default: false
        },
        incidentsAlcoholDrugUse: {
                type: Boolean,
                default: false
        },
        incidentsMedicationErrors: {
                type: Boolean,
                default: false
        },
        incidentsViolentThreatOthers: {
                type: Boolean,
                default: false
        },
        incidentsMedicalEmergency911: {
                type: Boolean,
                default: false
        },
        incidentsEquipmentUtilityFailure: {
                type: Boolean,
                default: false
        },
        incidentsAWOL: {
                type: Boolean,
                default: false
        },
        incidentsViolentActionSelf: {
                type: Boolean,
                default: false
        },
        incidentsEmployeeInjury: {
                type: Boolean,
                default: false
        },
        incidentsBiohazardousMaterial: {
                type: Boolean,
                default: false
        },
        incidentsPsychiatricEmergency: {
                type: Boolean,
                default: false
        },
        incidentsViolentActionOthers: {
                type: Boolean,
                default: false
        },
        incidentsClientConsumerInjury: {
                type: Boolean,
                default: false
        },
        incidentsAMA: {
                type: Boolean,
                default: false
        },
        incidentsAbuseNeglect: {
                type: Boolean,
                default: false
        },
        incidentsTrespassing: {
                type: Boolean,
                default: false
        },
        incidentsProceduralBreak: {
                type: Boolean,
                default: false
        },
        incidentsSlipFall: {
                type: Boolean,
                default: false
        },
        incidentsCutAbrasion: {
                type: Boolean,
                default: false
        },
        incidentspharmacyError: {
                type: Boolean,
                default: false
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
});

const IncidentReport = mongoose.model("IncidentReport", incidentReportSchema);

module.exports = IncidentReport;
