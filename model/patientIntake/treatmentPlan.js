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
        name: {
                type: String,
        },
        address: {
                type: String,
        },
        number: {
                type: Number,
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
        care: [{
                type: String
        }],
        presentingProblems: [{
                type: String
        }],
        mentalStatus: {
                type: String,
                enum: ['oriented', 'disoriented', 'unstable', 'other']
        },
        mentalStatusOther: {
                type: String,
        },
        moodLevel: {
                type: String,
                enum: ['Normal', 'Elevated', 'Depressed', 'Anxious', 'other']
        },
        moodLevelOther: {
                type: String,
        },
        adls: {
                type: String,
                enum: ['independent', 'personalCareLevel']
        },
        adlsOther: {
                type: String,
        },
        behavioralHealthServices: {
                type: String,
                enum: ['receivesServices', 'prescribedMedication', 'followsHouseRules']
        },
        behavioralHealthServicesOther: {
                type: String,
        },
        primaryCareProvider: {
                type: String,
        },
        psychiatricProvider: {
                type: String,
        },
        residentGoals: {
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
        interventionsComment: {
                type: String,
        },
        counselingFrequency: [{
                type: String,
        }],
        counselingFrequencyMinimum: {
                type: Number,
        },
        counselingFrequencyComment: {
                type: String,
        },
        maintainSobriety: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
        independentLivingSkills: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
        employment: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
        adlsSecond: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
        safety: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
        medicationEducation: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
        managingMentalHealth: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
        legal: {
                type: [{
                        type: String,
                }],
                admissionMeasure: String,
                previousMeasure: String,
                currentMeasure: String,
                estimatedDateOfCompletion: Date,
                comments: String,
        },
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
                type: Array,
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
                type: Array,
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
                comment: {
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
                time: {
                        type: String,
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
                time: {
                        type: String,
                },
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
                time: {
                        type: String,
                },
        },
});
const TreatmentPlan = mongoose.model('TreatmentPlan', treatmentPlanSchema);
module.exports = TreatmentPlan
