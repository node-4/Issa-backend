const mongoose = require('mongoose');
const schema = mongoose.Schema;
const assessmentSchema = new mongoose.Schema({
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        // SECTION I
        companyName: { type: String, required: true },
        hasNotified: {
                type: String,
        },
        assessmentOn: {
                type: String,
        },
        residentName: { type: String, required: true },
        sex: { type: String, enum: ["Male", "Female", "Other"], },
        dob: { type: Date },
        dateOfAssessment: { type: Date, default: Date.now },
        ahcccsNumber: { type: String },
        preferredLanguage: { type: String },
        ethnicity: { type: String },
        admissionStatus: [{
                type: String,
                enum: ['Voluntary', 'Court Ordered Treatment'],
                default: 'Voluntary'
        }],
        programLocation: { type: String },
        guardianship: { type: String },
        powerOfAttorneyStatus: { type: String },
        todayDate: { type: Date, default: Date.now },
        guardianshipPoaPubFidName: { type: String },
        approvedBy: { type: String },
        reasonForAdmission: {
                type: Array
        },
        residentGoals: { type: String },
        residentStrengths: [{
                type: String,
                enum: ['Self motivated', 'Loving',
                        'Honesty', 'Helping others',
                        'Communication', 'Creative',
                        'Patient', 'Dedication',
                        'Coloring', 'Decision making',
                        'Team work', 'Family', 'Writing',
                        'Coloring', 'Art']
        }],
        residentStrengthsOther: String,
        residentLimitations: { type: String },
        currentBehavioralIssues: { type: String },
        behavioralInterventions: [{
                need: { type: String },
                intervention: { type: String },
        }],
        dischargePlan: { type: String },
        estimateDateOfDischarge: { type: Date },
        agreementWithPlan: { type: Boolean, default: false },
        residentGuardianAgreement: {
                name: { type: String },
                signature: { type: String },
                date: { type: Date },
                time: { type: String },
        },
        staffAgreement: {
                name: { type: String },
                signature: { type: String },
                date: { type: Date },
                time: { type: String },
        },
        bhpAgreement: {
                name: { type: String },
                signature: { type: String },
                date: { type: Date },
                time: { type: String },
        },
        other: {
                name: { type: String },
                relationship: { type: String },
                signature: { type: String },
                date: { type: Date },
                time: { type: String },
        },
        // SECTION II - Current and Past Medical/Psychiatric Conditions
        medicalConditions: [{
                condition: { type: String },
                yes: { type: Boolean },
                no: { type: Boolean },
                comments: { type: String },
                comment: { type: Array },
        }],
        SignificantFamilyMedicalPsychiatricHistory: {
                type: Array
        },
        mentalHealthTreatmentHistory: {
                typeOfService: { type: Array },
                where: { type: String },
                dates: { type: String },
                diagnosisReason: { type: Array },
        },
        substanceAbuseHistory: { type: Boolean },
        substanceAbuseDenies: { type: Boolean },
        substanceAbuseHistoryData: {
                types: { type: Array },
                ageOfFirstUse: { type: String },
                lastUse: { type: Array },
                frequency: { type: Array },
                lengthOfSobriety: { type: Array },
        },
        ActiveWithdrawalSymptoms: {
                noneReportedOrObserved: { type: Boolean },
                Agitation: { type: Boolean },
                Nausea: { type: Boolean },
                Vomiting: { type: Boolean },
                Headache: { type: Boolean },
                TactileDisturbances: { type: Boolean },
                Anxiety: { type: Boolean },
                Tremors: { type: Boolean },
                VisualDisturbances: { type: Boolean },
                AuditoryDisturbances: { type: Boolean },
                Sweats: { type: Boolean },
                Paranoia: { type: Boolean },
                GooseBumps: { type: Boolean },
                Runningnose: { type: Boolean },
                BonePain: { type: Boolean },
                Tearing: { type: Boolean },
                Seizures: { type: Boolean },
                LossofMuscleCoordination: { type: Boolean },
        },
        mentalStatusExam: {
                apparentAge: {
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
                attire: {
                        Casual: { type: Boolean },
                        Neat: { type: Boolean },
                        Tattered: { type: Boolean },
                        Dirty: { type: Boolean },
                },
                grooming: {
                        wellGroomed: { type: Boolean },
                        adequate: { type: Boolean },
                        unkempt: { type: Boolean },
                        disheveled: { type: Boolean },
                },
                Mood: {
                        Euthymic: { type: Boolean },
                        Irritable: { type: Boolean },
                        Elevated: { type: Boolean },
                        Depressed: { type: Boolean },
                        Anxious: { type: Boolean }
                },
                Affect: {
                        normalRange: { type: Boolean },
                        Depressed: { type: Boolean },
                        Labile: { type: Boolean },
                        Constricted: { type: Boolean },
                        Other: { type: Boolean }
                },
                EyeContact: {
                        Appropriate: { type: Boolean },
                        Minimal: { type: Boolean },
                        Poor: { type: Boolean },
                        Adequate: { type: Boolean },
                },
                Cooperation: {
                        Appropriate: { type: Boolean },
                        Hostile: { type: Boolean },
                        Evasive: { type: Boolean },
                        Defensive: { type: Boolean },
                        Indifferent: { type: Boolean }
                },
                Articulation: {
                        Normal: { type: Boolean },
                        Unintelligible: { type: Boolean },
                        Mumbled: { type: Boolean },
                        Slurred: { type: Boolean },
                        Stuttered: { type: Boolean },
                },
                Tone: {
                        Normal: { type: Boolean },
                        Soft: { type: Boolean },
                        Loud: { type: Boolean },
                        Pressured: { type: Boolean },
                },
                Rate: {
                        Normal: { type: Boolean },
                        Slow: { type: Boolean },
                        Fast: { type: Boolean },
                },
                Quantity: {
                        Normal: { type: Boolean },
                        Verbose: { type: Boolean },
                        Mutism: { type: Boolean },
                },
                responseLatency: {
                        Normal: { type: Boolean },
                        Delayed: { type: Boolean },
                        Shortened: { type: Boolean },
                },
                thoughtContent: {
                        Unremarkable: { type: Boolean },
                        Suspicious: { type: Boolean },
                        Negative: { type: Boolean },
                        Concrete: { type: Boolean },
                },
                thoughtProcesses: {
                        logicalCoherent: { type: Boolean },
                        Tangential: { type: Boolean },
                        Circumstantial: { type: Boolean },
                        Vague: { type: Boolean },
                },
                Delusions: {
                        No: { type: Boolean },
                        YesPersecutory: { type: Boolean },
                        YesSomatic: { type: Boolean },
                        YesGrandiose: { type: Boolean },
                        YesOther: {
                                type: { type: String }
                        }
                },
                Hallucinations: {
                        Unremarkable: { type: Boolean },
                        VisualHallucinations: { type: Boolean },
                        AuditoryHallucinations: { type: Boolean },
                        TactileHallucinations: { type: Boolean },
                        YesOther: {
                                type: { type: String }
                        }
                },
                Gait: {
                        Normal: { type: Boolean },
                        Staggering: { type: Boolean },
                        Shuffling: { type: Boolean },
                        Slow: { type: Boolean },
                        Awkward: { type: Boolean },
                },
                Posture: {
                        Normal: { type: Boolean },
                        Relaxed: { type: Boolean },
                        Rigid: { type: Boolean },
                        Tense: { type: Boolean },
                        Slouched: { type: Boolean },
                },
                PsychomotorActivity: {
                        Withinnormallimits: { type: Boolean },
                        Calm: { type: Boolean },
                        Hyperactive: { type: Boolean },
                        Agitated: { type: Boolean },
                        Hypoactive: { type: Boolean },
                },
                Mannerisms: {
                        None: { type: Boolean },
                        Tics: { type: Boolean },
                        Tremors: { type: Boolean },
                        Rocking: { type: Boolean },
                        Picking: { type: Boolean },
                },
                orientation: {
                        person: { type: Boolean },
                        place: { type: Boolean },
                        time: { type: Boolean },
                        circumstances: { type: Boolean },
                },
                Judgment: {
                        Good: { type: Boolean },
                        Fair: { type: Boolean },
                        Poor: { type: Boolean },
                },
                Insight: {
                        Good: { type: Boolean },
                        Fair: { type: Boolean },
                        Poor: { type: Boolean },
                },
                Memory: {
                        Good: { type: Boolean },
                        Fair: { type: Boolean },
                        Poor: { type: Boolean },
                },
                AbilityToConcentration: {
                        Intact: { type: Boolean },
                        Other: { type: String },
                },
        },
        significantSocialDevelopmentalHistory: { type: String },
        personalInformation: {
                highestEducation: { type: String },
                specialEducation: { type: Boolean },
                currentStudent: { type: Boolean },
                currentStudentLocation: { type: String },
        },
        employmentHistory: {
                currentlyEmployed: { type: Boolean },
                employmentLocation: { type: String },
                fullTime: { type: Boolean }
        },
        workHistory: { type: String },
        militaryHistory: {
                militaryService: { type: Boolean },
                activeDuty: { type: Boolean }
        },
        legalHistory: {
                type: Array
        },
        independentLivingSkills: [{
                type: String,
                good: { type: Boolean },
                fair: { type: Boolean },
                needAssist: { type: Boolean },
                comments: { type: String },
        }],
        triggers: { type: String },
        fallRiskData: {
                fallRisk: { type: Boolean },
                fallRiskExplanation: { type: String },
        },
        hobbiesLeisureActivities: { type: String },
        medicalEquipment: [{
                type: Array
        }],
        medicalEquipmentOther: { type: String },
        specialPrecautions: [{
                type: Array
        }],
        currentThoughtsOfHarmingSelf: { type: Boolean },
        suicidalIdeation: {
                ideation: { type: String },
                increasingIn: {
                        urgency: { type: Boolean },
                        severity: { type: Boolean },
                },
        },
        currentThoughtsOfHarmingOthers: { type: Boolean },
        riskFactors: [{
                type: String,
                yesNo: {
                        type: Boolean
                },
                comment: {
                        type: String
                },
        }],
        protectiveFactors: [{
                type: String,
                yesNo: {
                        type: Boolean
                },
                comment: {
                        type: String
                },
        }],
        riskLevel: { type: String, enum: ['No Risk', 'Low Risk', 'Moderate Risk', 'High Risk'] },
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
                comment: {
                        type: String
                },
        },
        additionalNotes: { type: String },
        staffInformation: {
                staffName: { type: String },
                staffTitle: { type: String },
                staffSignature: { type: String },
                staffDate: { type: Date, default: Date.now },
                time: { type: String },
        },
        bhpInformation: {
                bhpName: { type: String },
                bhpCredentials: { type: String },
                bhpSignature: { type: String },
                bhpDate: { type: Date, default: Date.now },
                time: { type: String },
        },
});
const Assessment = mongoose.model('initialAssessment', assessmentSchema);
module.exports = Assessment;