const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
        // SECTION I
        companyName: { type: String, required: true },
        residentName: { type: String, required: true },
        sex: { type: String, enum: ["Male", "Female", "Other"], },
        dob: { type: Date },
        dateOfAssessment: { type: Date, default: Date.now },
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
        reasonForAdmission: { type: String },
        residentGoals: { type: String },
        residentStrengths: [{
                type: String,
                enum: ['Self motivated', 'Loving', 'Honesty', 'Helping others', 'Communication', 'Creative', 'Patient', 'Dedication', 'Coloring', 'Decision making', 'Team work', 'Family', 'Writing', 'Coloring', 'Art']
        }],
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
        other: {
                name: { type: String },
                relationship: { type: String },
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
                Abilitytoconcentration: {
                        Intact: { type: Boolean },
                        Other: { type: String },
                },






        },






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
