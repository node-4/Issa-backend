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
        medicationService: [{
                type: String
        }],
        presentingProblems: [{
                type: String
        }],
        diagonsis: {
                type: String
        },
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
                behavioralSymptomsOther: {
                        type: String,
                },
                physicalSymptoms: [{
                        type: String,
                }],
                physicalSymptomsOther: {
                        type: String,
                },
                cognitiveSymptoms: [{
                        type: String,
                }],
                cognitiveSymptomsOther: {
                        type: String,
                },
                psychosocialSymptoms: [{
                        type: String,
                }],
                psychosocialSymptomsOther: {
                        type: String,
                },
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
        maintainSobrietyType: [{
                type: String,
        }],
        maintainSobrietyAdmissionMeasure: String,
        maintainSobrietyPreviousMeasure: String,
        maintainSobrietyCurrentMeasure: String,
        maintainSobrietyEstimatedDateOfCompletion: Date,
        maintainSobrietyComments: String,
        independentLivingSkillsType: [{
                type: String,
        }],
        independentLivingSkillsAdmissionMeasure: String,
        independentLivingSkillsPreviousMeasure: String,
        independentLivingSkillsCurrentMeasure: String,
        independentLivingSkillsEstimatedDateOfCompletion: Date,
        independentLivingSkillsComments: String,
        employmentType: [{
                type: String,
        }],
        employmentAdmissionMeasure: String,
        employmentPreviousMeasure: String,
        employmentCurrentMeasure: String,
        employmentEstimatedDateOfCompletion: Date,
        employmentComments: String,
        adlsSecondType: [{
                type: String,
        }],
        adlsSecondAdmissionMeasure: String,
        adlsSecondPreviousMeasure: String,
        adlsSecondCurrentMeasure: String,
        adlsSecondEstimatedDateOfCompletion: Date,
        adlsSecondComments: String,
        safetyType: [{
                type: String,
        }],
        safetyAdmissionMeasure: String,
        safetyPreviousMeasure: String,
        safetyCurrentMeasure: String,
        safetyEstimatedDateOfCompletion: Date,
        safetyComments: String,
        medicationEducationType: [{
                type: String,
        }],
        medicationEducationAdmissionMeasure: String,
        medicationEducationPreviousMeasure: String,
        medicationEducationCurrentMeasure: String,
        medicationEducationEstimatedDateOfCompletion: Date,
        medicationEducationComments: String,
        managingMentalHealthType: [{
                type: String,
        }],
        managingMentalHealthAdmissionMeasure: String,
        managingMentalHealthPreviousMeasure: String,
        managingMentalHealthCurrentMeasure: String,
        managingMentalHealthEstimatedDateOfCompletion: Date,
        managingMentalHealthComments: String,
        legalType: [{
                type: String,
        }],
        legalAdmissionMeasure: String,
        legalPreviousMeasure: String,
        legalCurrentMeasure: String,
        legalEstimatedDateOfCompletion: Date,
        legalComments: String,
        other: [{
                otherType: String,
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
        supportSystem: [{ type: String }],
        supportSystemPhoneNumber: {
                type: String,
        },
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
                type: Boolean,
                default: false
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
        clinicalSummaryBeforeDate: {
                type: Date,
        },
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
        residentAgreementIsReason: {
                type: String,
                enum: ['yes', 'no'],
        },
        residentAgreementRefusalReason: {
                type: String,
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
        saveAsDraft: {
                type: Boolean,
                default: false
        },
});
const TreatmentPlan = mongoose.model('TreatmentPlan', treatmentPlanSchema);
module.exports = TreatmentPlan
