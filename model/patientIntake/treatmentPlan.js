const mongoose = require('mongoose');
const schema = mongoose.Schema;
const treatmentPlanSchema = new mongoose.Schema({
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
        date: {
                type: Date,
        },
        dateOfBirth: {
                type: Date,
        },
        admitDate: {
                type: Date,
        },
        care: {
                physicalServices: { type: Boolean, default: false },
                behavioralServices: { type: Boolean, default: false },
        },
        medicationServices: {
                administration: { type: Boolean, default: false },
                selfAdministration: { type: Boolean, default: false },
        },
        presentingProblems: [{
                type: String
        }],
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
        residentParticipation: {
                type: String,
        },
        residentAttitude: {
                type: String,
        },
        residentProgress: {
                type: String,
        },
        supportSystem: [String],
        currentMedications: {
                type: String,
        },
        religiousPreference: {
                type: String,
        },
        nutritionAndWellnessPlanning: {
                type: String,
        },
        recommendationToExtendResidentialTreatment: {
                type: String,
        },
        personalFinances: {
                type: Boolean, default: false
        },
        dischargePlanning: {
                type: String,
        },
        additionalComment: {
                type: String,
        },
        recommendationsForFurtherPrograms: [{
                type: String
        }],
        afterCareAndTransitionPlanning: [{
                type: String
        }],
        clinicalSummary: {
                type: String,
        },
        treatmentPlanReviewDate: {
                type: Date,
        },
        dischargePlanDate: {
                type: Date,
        },
        individualsParticipatingInServicePlan: {
                resident: {
                        type: String,
                },
                guardian: {
                        type: String,
                },
                staff: {
                        type: String,
                },
                bhp: {
                        type: String,
                },
        },
        residentAgreement: {
                isReason: {
                        type: String,
                        enum: ['yes', 'no'],
                },
                refusalReason: {
                        type: String,
                },
        },
        signaturesResident: {
                name: {
                        type: String,
                },
                credentials: {
                        type: String,
                },
                signature: {
                        type: String,
                },
                date: {
                        type: Date,
                },
        },
        signaturesFacilityRep: {
                name: {
                        type: String,
                },
                credentials: {
                        type: String,
                },
                signature: {
                        type: String,
                },
                date: Date,
        },
        signaturesBhp: {
                name: {
                        type: String,
                },
                credentials: {
                        type: String,
                },
                signature: {
                        type: String,
                },
                date: {
                        type: Date,
                },
        },
});
const TreatmentPlan = mongoose.model('TreatmentPlan', treatmentPlanSchema);
module.exports = TreatmentPlan
