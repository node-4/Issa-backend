const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        name: {
                type: String,
                enum: ["firstAidChecklist", "fireEquipementMonitoring",
                        "evacuationAndFireDrill", "disasterDrill", "WeeklyVehicleInspectionChecklist",
                        "WeeklyVehicleInspectionChecklist", "ClinicalOversight", "MonthlyVehicleInspection",
                        "vanEmergencyInformationForm", "qualityManagement", "infectiousData",
                        "incidentReport", "disasterPlanReview"
                ]
        },
        partId: {
                type: schema.Types.ObjectId,
                ref: "notes",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        date: {
                type: Date,
        },
        beginTime: {
                type: String,
        },
        endTime: {
                type: String,
        },
        lengthOfTime: {
                type: String,
        },
        conductedViaRemoteTeleConferenceWithAudioVideo: {
                type: Boolean
        },
        conductedViaInPerson: {
                type: Boolean
        },
        clinicalOversightTypeIndividual: {
                type: Boolean
        },
        clinicalOversightTypeGroup: {
                type: Boolean
        },
        participants: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        topicsAddressedUniqueTreatmentNeeds: {
                type: Boolean
        },
        topicsAddressedEnhancingSkills: {
                type: Boolean
        },
        topicsAddressedAssessmentOrTreatmentPlan: {
                type: Boolean
        },
        topicsAddressedStaffTrainingPlan: {
                type: Boolean
        },
        topicsAddressedJobDutiesDirection: {
                type: Boolean
        },
        additionalComments: {
                type: String,
        },
        opportunitiesForTraining: {
                type: String,
        },
        bhpNameAndCredentials: {
                type: String,
        },
        bhpSignature: {
                type: String,
        },
        administratorName: {
                type: String,
        },
        administratorSignature: {
                type: String,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        facititAddress: {
                type: String,
        },
        date: {
                type: Date,
        },
        tornado: {
                type: Boolean
        },
        structureDamage: {
                type: Boolean
        },
        fire: {
                type: Boolean
        },
        storm: {
                type: Boolean
        },
        earthQuake: {
                type: Boolean
        },
        bombThreat: {
                type: Boolean
        },
        terroristAct: {
                type: Boolean
        },
        other: {
                type: Boolean
        },
        beginTime: {
                type: String,
        },
        endTime: {
                type: String,
        },
        totalTime: {
                type: String,
        },
        staffPresent: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        contactManagerCoordinator: {
                type: Boolean,
        },
        was911Called: {
                type: Boolean,
        },
        extinguisherTaken: {
                type: Boolean,
        },
        relocatedTheResidents: {
                type: String,
        },
        recommendations: {
                type: String,
        },
        residentMedication: {
                type: Boolean,
        },
        waterFoodAccessible: {
                type: Boolean,
        },
        residentsAccounted: {
                type: String,
        },
        handleTheDisaster: {
                type: String,
        },
        commentsConcerns: {
                type: String,
        },
        title: {
                type: String,
        },
        personConductingTheDisasterDrill: {
                type: String,
        },
        conducatingDate: {
                type: Date,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        facilityAddress: {
                type: String,
        },
        date: {
                type: Date
        },
        shiftTime: {
                type: String,
        },
        shift: {
                type: String,
        },
        participants: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        critiqueProblemsIdentified: {
                type: String,
        },
        recommendationsForImprovement: {
                type: String,
        },
        nextReviewDate: {
                type: Date,
        },
        reviewCompletedByName: {
                type: String,
        },
        reviewCompletedBySignature: {
                type: String,
        },
        reviewCompletedByDate: {
                type: Date,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        facititAddress: {
                type: String,
        },
        date: {
                type: Date,
        },
        startTime: {
                type: String,
        },
        endTime: {
                type: String,
        },
        shift: {
                type: String,
        },
        evacuationPersonConduct: {
                type: String,
        },
        evacuationParticipatingEmployee: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        residentsAssistanceEmployee: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        noOfOccupantsEvacuated: {
                type: Number,
        },
        fireAlaramActivationMethod: {
                type: String,
        },
        totalTimeOfEvacuationDrill: {
                type: String,
        },
        condition: {
                type: String,
        },
        problemEncounteredDuringEvacuationDrill: {
                type: String,
        },
        recommendations: {
                type: String,
        },
        planAction: {
                type: String,
        },
        signatureofPersonCompletingDrill: {
                type: String,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        date: {
                type: Date,
        },
        location: {
                type: String,
        },
        alaram1: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram2: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram3: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram4: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram5: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram6: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram7: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram8: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram9: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram10: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram11: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram12: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram13: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram14: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram15: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        extinguisher1: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        extinguisher2: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        extinguisher3: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        staff: [{
                signature: {
                        type: String,
                }
        }],
        fireExtinguisherExpire1: {
                type: Date,
        },
        fireExtinguisherExpire2: {
                type: Date,
        },
        fireExtinguisherExpire3: {
                type: Date,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        date: {
                type: Date,
        },
        location: {
                type: String,
        },
        AdhesiveStripBandages: {
                name: {
                        type: String,
                        default: 'AdhesiveStripBandages',
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        AdhesiveTap: {
                name: {
                        type: String,
                        default: 'AdhesiveTap'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        CPRMouthGuardShield: {
                name: {
                        type: String,
                        default: 'CPRMouthGuardShield'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        DisposableLatexGloves: {
                name: {
                        type: String,
                        default: 'DisposableLatexGloves'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        NonStickSterilePads: {
                name: {
                        type: String,
                        default: 'NonStickSterilePads'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        RollerGauze: {
                name: {
                        type: String,
                        default: 'RollerGauze'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        Scissors: {
                name: {
                        type: String,
                        default: 'Scissors'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        SterileGuazeSquares: {
                name: {
                        type: String,
                        default: 'SterileGuazeSquares'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        TriangularBandages: {
                name: {
                        type: String,
                        default: 'TriangularBandages'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        Tweezers: {
                name: {
                        type: String,
                        default: 'Tweezers'
                },
                item: {
                        type: Number,
                },
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        staff: [{
                staffName: {
                        type: String,
                },
                initial: {
                        type: String,
                },
        }],
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        dateOfIncident: {
                type: Date
        },
        timeOfIncident: {
                type: String
        },
        employeesInvolved: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        residentsInvolved: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        personObservingReporting: {
                type: String,
        },
        incidentsAltercationVerbal: {
                type: Boolean,
        },
        incidentsPropertyLoss: {
                type: Boolean,
        },
        incidentsWeapon: {
                type: Boolean,
        },
        incidentsRuleViolation: {
                type: Boolean,
        },
        incidentsAltercationPhysical: {
                type: Boolean,
        },
        incidentsPropertyDamage: {
                type: Boolean,
        },
        incidentsContraband: {
                type: Boolean,
        },
        incidentsSeizure: {
                type: Boolean,
        },
        incidentsViolentThreatSelf: {
                type: Boolean,
        },
        incidentsVehicularAccident: {
                type: Boolean,
        },
        incidentsAlcoholDrugUse: {
                type: Boolean,
        },
        incidentsMedicationErrors: {
                type: Boolean,
        },
        incidentsViolentThreatOthers: {
                type: Boolean,
        },
        incidentsMedicalEmergency911: {
                type: Boolean,
        },
        incidentsEquipmentUtilityFailure: {
                type: Boolean,
        },
        incidentsAWOL: {
                type: Boolean,
        },
        incidentsViolentActionSelf: {
                type: Boolean,
        },
        incidentsEmployeeInjury: {
                type: Boolean,
        },
        incidentsBiohazardousMaterial: {
                type: Boolean,
        },
        incidentsPsychiatricEmergency: {
                type: Boolean,
        },
        incidentsViolentActionOthers: {
                type: Boolean,
        },
        incidentsClientConsumerInjury: {
                type: Boolean,
        },
        incidentsAMA: {
                type: Boolean,
        },
        incidentsAbuseNeglect: {
                type: Boolean,
        },
        incidentsTrespassing: {
                type: Boolean,
        },
        incidentsProceduralBreak: {
                type: Boolean,
        },
        incidentsSlipFall: {
                type: Boolean,
        },
        incidentsCutAbrasion: {
                type: Boolean,
        },
        incidentspharmacyError: {
                type: Boolean,
        },
        eventDetails: {
                type: String
        },
        medicationErrorsMissedDose: {
                type: Boolean,
        },
        medicationErrorsRefusedMedication: {
                type: Boolean,
        },
        medicationErrorsWrongClient: {
                type: Boolean,
        },
        medicationErrorsWrongTime: {
                type: Boolean,
        },
        medicationErrorsWrongMed: {
                type: Boolean,
        },
        actionsTakenSenttoERHospital: {
                type: Boolean,
        },
        actionsTakenFirstAid: {
                type: Boolean,
        },
        actionsTakenNoMedicalCareRequired: {
                type: Boolean,
        },
        CareRefused: {
                type: Boolean,
        },
        actionsTakenFireDepartmentCalled: {
                type: Boolean,
        },
        actionsTakenPoliceCalled: {
                type: Boolean,
        },
        actionsTakenReferredtoAdministratorRiskManagement: {
                type: Boolean,
        },
        actionsTakenMaintenanceCalledWorkOrderCompleted: {
                type: Boolean,
        },
        actionsTakenOther: {
                type: Boolean,
        },
        abuseNeglectInvolved: {
                type: Boolean,
        },
        abuseNeglectInvolvedifYes: {
                type: String,
                default: false
        },
        notificationsFamily: {
                type: Boolean,
        },
        notificationsGuardian: {
                type: Boolean,
        },
        notificationsCaseManager: {
                type: Boolean,
        },
        notificationsOther: {
                type: Boolean,
        },
        notificationIfOther: {
                type: String,
                default: false
        },
        notificationDate: {
                type: Date,
        },
        notificationTime: {
                type: String,
        },
        reportCompletedBy: {
                type: String,
        },
        investigationDetails: {
                type: String,
        },
        investigationRecommendationsAndActions: {
                type: String,
        },
        investigationFollowUp: {
                type: String,
        },
        investigationCompletedBy: {
                type: String,
        },
        investigationCompletionDate: {
                type: Date,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        data: [{
                employeeName: {
                        type: String,
                },
                dateOfDataCollection: {
                        type: Date,
                },
                typeOfDataCollection: {
                        type: String,
                },
                issuesNoted: {
                        type: String,
                },
                dataCollectedBy: {
                        type: String,
                },
        }],
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        date: {
                type: String, // Assuming mm/yy forma
        },
        vehicle: {
                type: String
        },
        dateOfLastService: {
                type: Date,
        },
        dateOfNextService: {
                type: Date,
        },
        itemsLights: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsLightsComment: {
                type: String,
        },
        itemsTurnSignals: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsTurnSignalsComment: {
                type: String,
        },
        itemsHorn: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsHornComment: {
                type: String,
        },
        itemsWipers: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsWipersComment: {
                type: String,
        },
        itemsAC: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsACComment: {
                type: String,
        },
        itemsTires: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsTiresComment: {
                type: String,
        },
        itemsSteering: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsSteeringComment: {
                type: String,
        },
        itemsFluidLeaksGasOdor: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsFluidLeaksGasOdorComment: {
                type: String,
        },
        itemsBodyDents: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsBodyDentsComment: {
                type: String,
        },
        itemsMirrors: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsMirrorsComment: {
                type: String,
        },
        itemsExternalCleanliness: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsExternalCleanlinessComment: {
                type: String,
        },
        itemsInteriorCleanliness: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsInteriorCleanlinessComment: {
                type: String,
        },
        itemsFirstAidKit: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsFirstAidKitComment: {
                type: String,
        },
        itemsWater: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsWaterComment: {
                type: String,
        },
        itemsFireExtinguisher: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsFireExtinguisherComment: {
                type: String,
        },
        itemsBrakes: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsBrakesComment: {
                type: String,
        },
        comments: {
                type: String,
        },
        inspectorSignature: {
                type: String
        },
        inspectorDate: {
                type: Date,
                default: Date.now,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        dateOfBirth: {
                type: Date,
        },
        areasImproved: {
                type: String,
        },
        dataCollectionPatientChart: {
                type: Number,
        },
        dataCollectionIncidentReports: {
                type: Number,
        },
        dataCollectionAdmissions: {
                type: Number,
        },
        dataCollectionDischarges: {
                type: Number,
        },
        dataCollectionClientsVisitedHospital: {
                type: Number,
        },
        dataCollectionFalls: {
                type: Number,
        },
        dataCollectionMedicationErrors: {
                type: Number,
        },
        dataCollectionInfectiousDisease: {
                type: Number,
        },
        dataCollectionClientsRefusingMedications: {
                type: Number,
        },
        dataCollectionClientsRefusingAppointments: {
                type: Number,
        },
        areasNonCompliance: {
                type: String,
        },
        trends: {
                type: String,
        },
        staffName: {
                type: String,
        },
        staffSignature: {
                type: String,
        },
        date: {
                type: Date,
                default: Date.now,
        },
        type: {
                type: String,
                enum: ["quarterly", "monthly"]
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        residentName: {
                type: String
        },
        dateOfBirth: {
                type: Date,
        },
        facilityAddress: {
                type: String,
        },
        facilityPhoneNumber: {
                type: String,
        },
        guardianInformation: {
                type: String,
        },
        BHRFAdministratorInformation: {
                type: String,
        },
        pharamacyHospital: {
                type: String,
        },
        preferredHospital: {
                type: String,
        },
        allergies: {
                type: String,
        },
        staffMemberName: {
                type: String,
        },
        staffMemberPhoneNumber: {
                type: String,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        site: {
                type: String,
        },
        date: {
                type: Date,
        },
        year: {
                type: String,
        },
        make: {
                type: String,
        },
        model: {
                type: String,
        },
        vehicleLicensePlate: {
                type: String,
        },
        lights: {
                highBeam: {
                        type: Boolean,
                },
                lowBeam: {
                        type: Boolean,
                },
                brakeLights: {
                        type: Boolean,
                },
                emergencyLights: {
                        type: Boolean,
                },
                rightLeftFrontTurnSignal: {
                        type: Boolean,
                },
                rightLeftBackTurnSignal: {
                        type: Boolean,
                },
                rightLeftTailLight: {
                        type: Boolean,
                },
                rightLeftEmergencyLight: {
                        type: Boolean,
                },
                rightLeftFrontDayRunning: {
                        type: Boolean,
                },
                rightLeftBackDayRunning: {
                        type: Boolean,
                },
        },
        glass: {
                windshield: {
                        type: Boolean,
                },
                rear: {
                        type: Boolean,
                },
                rightLeftFront: {
                        type: Boolean,
                },
                rightLeftMiddle: {
                        type: Boolean,
                },
                rightLeftBack: {
                        type: Boolean,
                },
        },
        fluidsAndLubricants: {
                fuel: {
                        type: Boolean,
                },
                engineOil: {
                        type: Boolean,
                },
                coolantFluid: {
                        type: Boolean,
                },
                powerSteeringFluid: {
                        type: Boolean,
                },
                brakeFluid: {
                        type: Boolean,
                },
                clutchOil: {
                        type: Boolean,
                },
                batteryFluid: {
                        type: Boolean,
                },
                windshieldWasherFluid: {
                        type: Boolean,
                },
                water: {
                        type: Boolean,
                },
        },
        tires: {
                spare: {
                        type: Boolean,
                },
                rightLeftFront: {
                        type: Boolean,
                },
                rightLeftBack: {
                        type: Boolean,
                },
                jackAndWrench: {
                        type: Boolean,
                },
        },
        mirrors: {
                rightLeftMirror: {
                        type: Boolean,
                },
                middleInterior: {
                        type: Boolean,
                },
        },
        emergencyEquipment: {
                firstAidKit: {
                        type: Boolean,
                },
                gloves: {
                        type: Boolean,
                },
                redTriangles: {
                        type: Boolean,
                },
                flashlight: {
                        type: Boolean,
                },
                water: {
                        type: Boolean,
                },
        },
        general: {
                wiperBladesMotor: {
                        type: Boolean,
                },
                horn: {
                        type: Boolean,
                },
                heater: {
                        type: Boolean,
                },
                airConditioner: {
                        type: Boolean,
                },
                seatBelts: {
                        type: Boolean,
                },
                hose: {
                        type: Boolean,
                },
                driveBelt: {
                        type: Boolean,
                },
                battery: {
                        type: Boolean,
                },
        },
        staffName: {
                type: String,
        },
        staffSignature: {
                type: String,
        },
        inspectionDate: {
                type: Date,
        },
        partType: {
                type: String,
                enum: ['A', 'B']
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("notes", addressSchema);