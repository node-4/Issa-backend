const mongoose = require('mongoose');
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
        medicationAdministrationCompleted: Boolean,
        assistanceInMedicationAdministrationCompleted: Boolean,
        healthAndWelfareChecksCompleted: Boolean,
        communityLivingSupport: {
                monitorsAndPrompts: Boolean,
        },
        therapy: {
                groupTherapy: Boolean,
                individualTherapy: Boolean,
                refusedTherapy: Boolean,
        },
        mood: {
                isolation: Boolean,
                anxious: Boolean,
                depressed: Boolean,
                excited: Boolean,
                respondingToInternalStimuli: Boolean,
                inappropriateSexualComment: Boolean,
                paranoia: Boolean,
                verballyAggressive: Boolean,
                physicallyAggressive: Boolean,
                agitated: Boolean,
                suicidalIdeation: Boolean,
        },
        appointments: {
                PCP: Boolean,
                psychiatric: Boolean,
                otherSpecialist: Boolean,
                none: Boolean,
        },
        emergencyAppointment: {
                emergencyRoomVisit: Boolean,
                inpatient: Boolean,
                urgentCare: Boolean,
                none: Boolean,
        },
        outings: Boolean,
        adlsCompleted: Boolean,
        mealPreparation: Boolean,
        transportation: Boolean,
        residentRedirectedOnBehaviors: Boolean,
        awolElopement: Boolean,
        noteSummary: String,
        bhtNameAndSignature: String,
});
const ProgressNote = mongoose.model('ProgressNote', progressNoteSchema);
module.exports = ProgressNote;
