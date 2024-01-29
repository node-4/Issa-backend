const mongoose = require('mongoose');
const schema = mongoose.Schema;
const progressNoteSchema = new mongoose.Schema({
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
        admitDate: {
                type: Date,
        },
        date: {
                type: Date,
        },
        shift: {
                type: String,
                enum: ['7am-3pm', '3pm-11pm', '11pm-7am', '8am-4pm', '4pm-12am', '12am-8am', '7am-7pm', '7pm-7am', '8am-8pm', '8pm-8am',],
        },
        medicationAdministrationCompleted: {
                type: Boolean
        },
        assistanceInMedicationAdministrationCompleted: {
                type: Boolean
        },
        healthAndWelfareChecksCompleted: {
                type: Boolean
        },
        communityLivingSupport: {
                type: String,
                enum: ['monitors', 'Prompts']
        },
        therapy: {
                type: Array,
        },
        mood: {
                type: Array,
        },
        appointment: {
                type: Array,
        },
        PCP: {
                type: Boolean
        },
        psychiatric: {
                type: Boolean
        },
        otherSpecialist: {
                type: Boolean
        },
        none: {
                type: Boolean
        },
        communityOutings: {
                type: Boolean
        },
        religiousService: {
                type: Boolean
        },
        adlsCompleted: {
                type: Boolean
        },
        mealPreparation: {
                type: Boolean
        },
        transportation: {
                type: Boolean
        },
        residentRedirectedOnBehaviors: {
                type: Boolean
        },
        awolElopement: {
                type: Boolean
        },
        noteSummary: {
                type: String,
        },
        bhtName: {
                type: String,
        },
        bhtSignature: {
                type: String,
        },
});
const ProgressNote = mongoose.model('ProgressNote', progressNoteSchema);
module.exports = ProgressNote;
