const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
        // SECTION I
        companyName: { type: String, required: true },
        residentName: { type: String, required: true },
        dateOfAssessment: { type: Date, default: Date.now },
        dob: { type: Date },
        admissionDate: { type: Date },
        ahcccsNumber: { type: String },
        preferredLanguage: { type: String },
        ethnicity: { type: String },
        admissionStatus: { type: String, enum: ['Voluntary', 'Court Ordered Treatment'], default: 'Voluntary' },
        programLocation: { type: String },
        guardianship: { type: String },
        powerOfAttorneyStatus: { type: String },
        todayDate: { type: Date, default: Date.now },
        guardianshipPoaPubFidName: { type: String },
        approvedBy: { type: String },

        // Reason for Admission to Services
        reasonForAdmission: { type: String },

        // Resident's Goals
        residentGoals: { type: String },

        // Resident's Strengths and Limitations
        residentStrengths: [{ type: String }],
        residentLimitations: { type: String },

        // Current Behavioral Issues / Symptoms Reported by the Resident
        currentBehavioralIssues: { type: String },

        // Identified Needs/Targeted Behaviors Intervention(s) to Meet Objectives
        behavioralInterventions: [{
                need: { type: String },
                intervention: { type: String },
        }],

        // Discharge Plan
        estimateDateOfDischarge: { type: Date },

        // Agreement with Behavioral Health Treatment Plan
        agreementWithPlan: { type: Boolean, default: false },
        residentGuardianAgreement: {
                name: { type: String },
                signature: { type: String },
                date: { type: Date },
        },
        staffAgreement: {
                name: { type: String },
                signature: { type: String },
                date: { type: Date },
        },
        bhpAgreement: {
                name: { type: String },
                signature: { type: String },
                date: { type: Date },
        },

        // SECTION II - Current and Past Medical/Psychiatric Conditions
        medicalConditions: [{
                condition: { type: String },
                yes: { type: Boolean },
                no: { type: Boolean },
                comments: { type: String },
        }],

        // Mental Health Treatment History
        mentalHealthTreatmentHistory: [{
                typeOfService: { type: String },
                where: { type: String },
                dates: { type: String },
                diagnosisReason: { type: String },
        }],

        // Substance Abuse History
        substanceAbuseHistory: {
                history: { type: Boolean },
                denies: { type: Boolean },
                types: [{ type: String }],
                ageOfFirstUse: { type: String },
                lastUse: { type: String },
                frequency: { type: String },
                lengthOfSobriety: { type: String },
                withdrawalSymptoms: [{ type: String }],
        },

        // Mental Status Exam/Behavioral Observations
        mentalStatusExam: {
                generalAppearance: {
                        apparentAge: { type: String },
                        consistent: { type: Boolean },
                        younger: { type: Boolean },
                        older: { type: Boolean },
                },
                height: {
                        average: { type: Boolean },
                        short: { type: Boolean },
                        tall: { type: Boolean },
                },
                weight: {
                        average: { type: Boolean },
                        obese: { type: Boolean },
                        overweight: { type: Boolean },
                        thin: { type: Boolean },
                        emaciated: { type: Boolean },
                },
                attire: { type: String },
                grooming: {
                        wellGroomed: { type: Boolean },
                        adequate: { type: Boolean },
                        unkempt: { type: Boolean },
                        disheveled: { type: Boolean },
                },
                demeanorInteraction: {
                        mood: { type: String },
                        affect: { type: String },
                        eyeContact: { type: String },
                        cooperation: { type: String },
                },
                speech: {
                        articulation: { type: String },
                        tone: { type: String },
                        rate: { type: String },
                        quantity: { type: String },
                        responseLatency: { type: String },
                },
                cognition: {
                        thoughtContent: { type: String },
                        thoughtProcesses: { type: String },
                        delusions: { type: String },
                        hallucinations: { type: String },
                },
                motorActivity: {
                        gait: { type: String },
                        posture: { type: String },
                        psychomotorActivity: { type: String },
                        mannerisms: { type: String },
                },
                orientation: {
                        person: { type: Boolean },
                        place: { type: Boolean },
                        time: { type: Boolean },
                        circumstances: { type: Boolean },
                },
                judgmentInsightMemory: {
                        judgment: { type: String },
                        insight: { type: String },
                        memory: { type: String },
                        abilityToConcentration: { type: String },
                },
        },

        // Social/Developmental History
        significantSocialDevelopmentalHistory: { type: String },

        // Safety and Risk Assessment
        currentThoughtsOfHarmingSelf: { type: Boolean },
        suicidalIdeation: {
                ideation: { type: String },
                increasingIn: {
                        urgency: { type: Boolean },
                        severity: { type: Boolean },
                },
        },
        currentThoughtsOfHarmingOthers: { type: Boolean },
        riskFactors: {
                currentSuicidalIdeation: { type: Boolean },
                priorSuicideAttempt: { type: Boolean },
                accessToMeans: { type: Boolean },
                substanceAbuse: { type: Boolean },
                otherSelfAbusingBehavior: { type: Boolean },
                recentLossesLackOfSupport: { type: Boolean },
                behaviorCues: { type: String },
                symptomsOfPsychosis: { type: String },
                familyHistoryOfSuicide: { type: Boolean },
                terminalPhysicalIllness: { type: Boolean },
                currentStressors: { type: String },
                chronicPain: { type: Boolean },
        },
        protectiveFactors: {
                supportsAvailable: { type: Boolean },
                spiritualReligiousSupport: { type: Boolean },
                religiousCulturalProhibitions: { type: Boolean },
                fearOfConsequences: { type: Boolean },
                ableToBeEngagedInIntervention: { type: Boolean },
                willingToCommitToKeepingSelfSafe: { type: Boolean },
        },
        riskLevel: { type: String, enum: ['No Risk', 'Low Risk', 'Moderate Risk', 'High Risk'] },

        // Diagnoses
        psychiatricDiagnoses: [{
                icdCode: { type: String },
                description: { type: String },
                primary: { type: Boolean },
                secondary: { type: Boolean },
                tertiary: { type: Boolean },
                additional: { type: Boolean },
        }],
        medicalDiagnoses: [{
                icdCode: { type: String },
                description: { type: String },
                primary: { type: Boolean },
                secondary: { type: Boolean },
                tertiary: { type: Boolean },
                additional: { type: Boolean },
        }],
        additionalDiagnoses: [{ type: String }],

        // Psychosocial or Environmental Stressors
        psychosocialStressors: {
                primarySupportGroup: { type: Boolean },
                maritalProblems: { type: Boolean },
                accessToHealthCareServices: { type: Boolean },
                educationalProblems: { type: Boolean },
                housingProblems: { type: Boolean },
                familyProblems: { type: Boolean },
                occupationalProblems: { type: Boolean },
                interactionWithLegalSystem: { type: Boolean },
                substanceUseInHome: { type: Boolean },
                sexualProblems: { type: Boolean },
                otherStressors: { type: String },
        },

        // Significant Recent Losses
        significantRecentLosses: {
                no: { type: Boolean },
                yes: { type: Boolean },
                typeOfLoss: {
                        death: { type: Boolean },
                        job: { type: Boolean },
                        childRemovedFromHouse: { type: Boolean },
                        injury: { type: Boolean },
                        divorceSeparation: { type: Boolean },
                        violentActsAgainstPersonFamily: { type: Boolean },
                        medicalSurgical: { type: Boolean },
                        accidentInjury: { type: Boolean },
                        other: { type: Boolean },
                },
        },

        // Additional Notes
        additionalNotes: { type: String },

        // Staff Information
        staffInformation: {
                staffName: { type: String },
                staffTitle: { type: String },
                staffSignature: { type: String },
                staffDate: { type: Date, default: Date.now },
        },

        // BHP Information
        bhpInformation: {
                bhpName: { type: String },
                bhpCredentials: { type: String },
                bhpSignature: { type: String },
                bhpDate: { type: Date, default: Date.now },
        },
});

const Assessment = mongoose.model('initialAssesment', assessmentSchema);

module.exports = Assessment;
