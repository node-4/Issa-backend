const mongoose = require('mongoose');
const schema = mongoose.Schema;
const adlTrackingFormSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: Date.now,
    },
    selectingClothes: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    bathingOrShowering: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    combingHair: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    applyingLotion: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    laundry: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    dressing: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    shampooingHair: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    oralCareMorning: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    oralCareEvening: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    breakfast: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    lunch: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    dinner: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    amSnack: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    pmSnack: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    amBowelMovement: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    pmBowelMovement: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    overnightBowelMovement: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    handAndFootNailCare: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    bedMobility: {
        requiresNoAssistance: {
            type: Boolean
        },
        someAssistanceNeeded: {
            type: Boolean
        },
        completeAssistanceNeeded: {
            type: Boolean
        },
        notApplicable: {
            type: Boolean
        },
        refused: {
            type: Boolean
        },
        staffInitials: {
            type: String,
        },
    },
    savedSigned: {
        type: String,
    },
    dateSigned: {
        type: Date,
        default: Date.now,
    },
    signedTime: {
        type: String
    },
    saveAsDraft: {
        type: Boolean,
        default: false
    },
});

const ADLTrackingForm = mongoose.model('ADLTrackingForm', adlTrackingFormSchema);

module.exports = ADLTrackingForm;
