const mongoose = require('mongoose');
const treatmentPlanSchema = new mongoose.Schema({
        residentName: String,
        date: Date,
        dob: Date,
        admitDate: Date,
        care: {
                physicalServices: { type: Boolean, default: false },
                behavioralServices: { type: Boolean, default: false },

        },
        medicationServices: {
                administration: { type: Boolean, default: false },
                selfAdministration: { type: Boolean, default: false },
        },
        presentingProblems: [String],
        mentalStatus: {
                type: String,
                enum: ['oriented', 'disoriented', 'unstable', 'other']
        },
        moodLevel: {
                type: String,
                enum: ['Normal', 'Elevated', 'Depressed', 'Anxious', 'other']
        },
        adls: {
                type: String,
                enum: ['independent', 'personalCareLevel']
        },
        behavioralHealthServices: {
                type: String,
                enum: ['receivesServices', 'prescribedMedication', 'followsHouseRules']
        },
        primaryCareProvider: {
                type: String,
        },
        psychiatricProvider: {
                type: String,
        },
        allergies: {
                type: String,
        },
        triggers: {
                type: String,
        },
        strengths: [{
                type: String,
        }],
        barriers: [{
                type: String,
        }],
        riskAssessment: {
                behavioralSymptoms: [{
                        type: String,
                }],
                physicalSymptoms: [{
                        type: String,
                }],
                cognitiveSymptoms: [{
                        type: String,
                }],
                psychosocialSymptoms: [{
                        type: String,
                }],
        },
        interventions: [{
                type: String,
        }],
        counselingFrequency: {
                group: {
                        select: {
                                type: Boolean,
                                default: false
                        },
                        chosse: {
                                type: String
                        }
                },
                individual: {
                        type: Boolean,
                        default: false
                },
                individualTherapy: {
                        type: Boolean,
                        default: false
                },
                residentDeclinesIndividualTherapy: {
                        type: Boolean,
                        default: false
                },
                familyCounseling: {
                        type: Boolean,
                        default: false
                },
                aa: {
                        type: Boolean,
                        default: false
                },
                na: {
                        type: Boolean,
                        default: false
                },
                monthlyArtMeetingStaffing: {
                        type: Boolean,
                        default: false
                },
                weeklyArtMeetingStaffing: {
                        type: Boolean,
                        default: false
                }
        },
        treatmentGoals: [{
                option1: {
                        type: String,
                        enum: ['maintainSobriety', 'implementCopingSkills', 'learnRelapsePreventionSkills', 'developForSobriety', 'maintainAbstinence', 'completeStep', 'reportCravingToStaff', 'knowTriggers', 'knowConsequences', 'participateClinicalTeam', 'involveFamily', 'attendSelfHelpGroup', 'identifyPositiveFriends', 'refrainFromDrugSeekingBehaviors',]
                },
                option2: {
                        type: String,
                        enum: ['learnCopingSkills', 'manageTime', 'openBankAccount', 'communicateAssertively', 'identifyTriggers', 'scheduleTransportation', 'manageBudget', 'attendScheduledAppointments', 'developStressCopingSkills', 'learnToMakeBed', 'obtainDriversLicense', 'recognizeHealthyUnhealthyBoundaries']
                },
                option3: {
                        type: String,
                        enum: ['createResume',
                                'contactAgencies',
                                'learnMockInterview',]
                },
                option4: {
                        type: String,
                        enum: ['showerEveryOtherDay',
                                'prepareBasicMeal',
                                'brushTeethEveryOtherDay',
                                'completeLaundryIndependently',
                                'developLaundrySkills',
                        ]
                },
                option5: {
                        type: String,
                        enum: ['createSafetyPlan',
                                'contractForSafety',
                                'noElopementFor30Days',
                                'avoidTouchingHotItems',
                                'beAwareOfSurroundings',
                                'identifyDangers',
                        ]
                },
                option6: {
                        type: String,
                        enum: ['takeAllPrescribedMedications',
                                'learnMedicationNames',
                                'selfAdministerMedications',
                                'takeMedicationsTimely',
                                'learnOrderingRefills',
                        ]
                },
                option7: {
                        type: String,
                        enum: ['utilizeCopingSkills',
                                'utilizeEMSAppropriately',
                                'verbalizeUnderstanding',
                                'reduceMaladaptiveBehaviors',
                        ]
                },
                option8: {
                        type: String,
                        enum: ['attendCourtAppointments',
                                'attendProbationParoleAppointments',
                        ]
                },
                name: String,
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        }],
        residentParticipation: String,
        residentAttitude: String,
        residentProgress: String,
        supportSystem: [String],
        currentMedications: String,
        religiousPreference: String,
        nutritionAndWellnessPlanning: String,
        recommendationToExtendResidentialTreatment: String,
        personalFinances: {
                type: Boolean, default: false
        },
        dischargePlanning: String,
        additionalComment: String,
        recommendationsForFurtherPrograms: [String],
        afterCareAndTransitionPlanning: [String],
        clinicalSummary: String,
        treatmentPlanReviewDate: Date,
        dischargePlanDate: Date,
        individualsParticipatingInServicePlan: {
                resident: String,
                guardian: String,
                staff: String,
                bhp: String,
        },
        residentAgreement: {
                yes: Boolean,
                no: Boolean,
                refusalReason: String,
        },
        signatures: {
                resident: {
                        name: String,
                        credentials: String,
                        signature: String,
                        date: Date,
                },
                facilityRep: {
                        name: String,
                        credentials: String,
                        signature: String,
                        date: Date,
                },
                bhp: {
                        name: String,
                        credentials: String,
                        signature: String,
                        date: Date,
                },
        },
});
const TreatmentPlan = mongoose.model('TreatmentPlan', treatmentPlanSchema);
module.exports = TreatmentPlan
