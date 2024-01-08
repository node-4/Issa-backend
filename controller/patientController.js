const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const User = require('../model/userModel');
const AdminTracking = require('../model/Tracking/adminTracking');
const admitDetail = require('../model/admitDetail');
const task = require('../model/task');
const reciept = require('../model/reciept');
const firstAidChecklist = require('../model/Notes/firstAidChecklist');
const fireEquipementMonitoring = require('../model/Notes/fireEquipementMonitoring');
const evacuationAndFireDrill = require('../model/Notes/evacuationandFireDrill');
const disasterDrill = require('../model/Notes/disasterDrill');
const WeeklyVehicleInspectionChecklist = require('../model/Notes/WeeklyVehicleInspectionChecklist');
const ClinicalOversight = require('../model/Notes/ClinicalOversight');
const MonthlyVehicleInspection = require('../model/Notes/MonthlyVehicleInspection');
const vanEmergencyInformationForm = require('../model/Notes/vanEmergencyInformationForm');
const qualityManagement = require('../model/Notes/qualityManagement');
const infectiousData = require('../model/Notes/infectiousData');
const incidentReport = require('../model/Notes/incidentReport');
const disasterPlanReview = require('../model/Notes/disasterPlanReview');
const notes = require('../model/Notes/notes');
const package = require('../model/package');
const appointment = require('../model/appointment');
const patientTracking = require('../model/Tracking/patientTracking');
const medicationEmployee = require('../model/Medication/employeeMedication/medicationEmployee');
const patientMedication = require('../model/Medication/patientMedication/patientMedication');
const residentSafetyPlan = require('../model/patientIntake/residentSafetyPlan');
const treatmentPlan = require('../model/patientIntake/treatmentPlan');
const nursingAssessment = require('../model/patientIntake/nursingAssessment');
const residentIntake = require('../model/patientIntake/residentIntake');
exports.signin = async (req, res) => {
        try {
                const { email, password } = req.body;
                req.body.email = email.split(" ").join("").toLowerCase();
                const user = await User.findOne({ email: req.body.email, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ message: "user not found ! not registered" });
                }
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (!isValidPassword) {
                        return res.status(401).send({ message: "Wrong password" });
                }
                const accessToken = await jwt.sign({ id: user._id }, 'node5flyweis', { expiresIn: '365d', });
                let obj = {
                        fullName: user.fullName,
                        firstName: user.fullName,
                        lastName: user.lastName,
                        mobileNumber: user.mobileNumber,
                        email: user.email,
                        userType: user.userType,
                }
                return res.status(201).send({ data: obj, accessToken: accessToken });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Server error" + error.message });
        }
};
exports.getProfile = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                return res.status(200).send({ status: 200, message: "Profile get successfully.", data: user })
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateProfile = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                if (req.file) {
                        req.body.profilePic = req.file.path
                } else {
                        req.body.profilePic = user.profilePic
                }
                let obj = {
                        fullName: req.body.fullName || user.fullName,
                        email: req.body.email || user.email,
                        mobileNumber: req.body.mobileNumber || user.mobileNumber,
                        gender: req.body.gender || user.gender,
                        address: req.body.address || user.address,
                        profilePic: req.body.profilePic,
                }
                let update = await User.updateOne({ _id: req.user }, { $set: obj }, { new: true });
                if (update) {
                        return res.status(200).send({ status: 200, message: "Profile get successfully.", data: update })
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createAppointment = async (req, res) => {
        try {
                let { name, contactNumber, reasonForVisit, appointmentDate, appointmentTime } = req.body;
                let obj = {
                        name: name,
                        contactNumber: contactNumber,
                        reasonForVisit: reasonForVisit,
                        date: appointmentDate,
                        time: appointmentTime,
                        patientId: req.user._id,
                        employeeId: req.user.employeeId,
                        adminId: req.user.adminId,
                }
                let findAppointment = await appointment.create(obj);
                if (findAppointment) {
                        return res.status(200).send({ status: 200, message: "Appointment create successfully.", data: findAppointment })
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
}
exports.getAllPatientTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await patientTracking.findOne({ patientId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Patient tracking not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Patient tracking found.", data: findEmployee });
                }
        } catch (error) {
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllPatientMedication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await patientMedication.find({ patientId: user._id }).sort({ createdAt: -1 })
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No PatientMedication found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "PatientMedication found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createResidentSafetyPlan = async (req, res) => {
        try {
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await residentSafetyPlan.findOne({ adminId: user1.adminId, patientId: user1._id });
                if (findPatientTracking) {
                        let obj = {
                                adminId: user1.adminId,
                                patientId: user1._id,
                                residentName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                warningSigns: req.body.warningSigns || findPatientTracking.warningSigns,
                                internalCopingStrategies: req.body.internalCopingStrategies || findPatientTracking.internalCopingStrategies,
                                distractionsPeople: req.body.distractionsPeople || findPatientTracking.distractionsPeople,
                                distractionsPlace: req.body.distractionsPlace || findPatientTracking.distractionsPlace,
                                distractionsPlane: req.body.distractionsPlane || findPatientTracking.distractionsPlane,
                                helpContactsPeople: req.body.helpContactsPeople || findPatientTracking.helpContactsPeople,
                                professionals: req.body.professionals || findPatientTracking.professionals,
                                suicidePrevention: req.body.suicidePrevention || findPatientTracking.suicidePrevention,
                                localEmergencyHelp: req.body.localEmergencyHelp || findPatientTracking.localEmergencyHelp,
                                environmentSafetyMedications: req.body.environmentSafetyMedications || findPatientTracking.environmentSafetyMedications,
                                environmentSafetyFirearmsAllowed: req.body.environmentSafetyFirearmsAllowed || findPatientTracking.environmentSafetyFirearmsAllowed,
                                environmentSafetyDrugsOrAlcoholAllowed: req.body.environmentSafetyDrugsOrAlcoholAllowed || findPatientTracking.environmentSafetyDrugsOrAlcoholAllowed,
                                environmentSafetyLongStringsOrRopeAllowed: req.body.environmentSafetyLongStringsOrRopeAllowed || findPatientTracking.environmentSafetyLongStringsOrRopeAllowed,
                                signature: req.body.signature || findPatientTracking.signature,
                        };
                        let newEmployee = await residentSafetyPlan.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "ResidentSafety Plan add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                adminId: user1.adminId,
                                patientId: user1._id,
                                residentName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                warningSigns: req.body.warningSigns,
                                internalCopingStrategies: req.body.internalCopingStrategies,
                                distractionsPeople: req.body.distractionsPeople,
                                distractionsPlace: req.body.distractionsPlace,
                                distractionsPlane: req.body.distractionsPlane,
                                helpContactsPeople: req.body.helpContactsPeople,
                                professionals: req.body.professionals,
                                suicidePrevention: req.body.suicidePrevention,
                                localEmergencyHelp: req.body.localEmergencyHelp,
                                environmentSafetyMedications: req.body.environmentSafetyMedications,
                                environmentSafetyFirearmsAllowed: req.body.environmentSafetyFirearmsAllowed,
                                environmentSafetyDrugsOrAlcoholAllowed: req.body.environmentSafetyDrugsOrAlcoholAllowed,
                                environmentSafetyLongStringsOrRopeAllowed: req.body.environmentSafetyLongStringsOrRopeAllowed,
                                signature: req.body.signature
                        }
                        let newEmployee = await residentSafetyPlan.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "ResidentSafety Plan add successfully.", data: newEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getResidentSafetyPlan = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await residentSafetyPlan.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No ResidentSafety Plan found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "ResidentSafety Plan found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createTreatmentPlan = async (req, res) => {
        try {
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await treatmentPlan.findOne({ adminId: user1.adminId, patientId: user1._id });
                if (findPatientTracking) {
                        let obj = {
                                adminId: user1.adminId,
                                patientId: user1._id,
                                residentName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                date: req.body.date || findPatientTracking.date,
                                admitDate: req.body.admitDate || findPatientTracking.admitDate,
                                care: req.body.care || findPatientTracking.care,
                                medicationServices: req.body.medicationServices || findPatientTracking.medicationServices,
                                presentingProblems: req.body.presentingProblems || findPatientTracking.presentingProblems,
                                mentalStatus: req.body.mentalStatus || findPatientTracking.mentalStatus,
                                moodLevel: req.body.moodLevel || findPatientTracking.moodLevel,
                                adls: req.body.adls || findPatientTracking.adls,
                                behavioralHealthServices: req.body.behavioralHealthServices || findPatientTracking.behavioralHealthServices,
                                primaryCareProvider: req.body.primaryCareProvider || findPatientTracking.primaryCareProvider,
                                psychiatricProvider: req.body.psychiatricProvider || findPatientTracking.psychiatricProvider,
                                allergies: req.body.allergies || findPatientTracking.presentingProblems,
                                triggers: req.body.triggers || findPatientTracking.presentingProblems,
                                strengths: req.body.strengths || findPatientTracking.presentingProblems,
                                barriers: req.body.barriers || findPatientTracking.presentingProblems,
                                riskAssessment: req.body.riskAssessment || findPatientTracking.riskAssessment,
                                interventions: req.body.interventions || findPatientTracking.interventions,
                                counselingFrequency: req.body.counselingFrequency || findPatientTracking.counselingFrequency,
                                treatmentGoals: req.body.treatmentGoals || findPatientTracking.treatmentGoals,
                                residentParticipation: req.body.residentParticipation || findPatientTracking.residentParticipation,
                                residentAttitude: req.body.residentAttitude || findPatientTracking.residentAttitude,
                                residentProgress: req.body.residentProgress || findPatientTracking.residentProgress,
                                supportSystem: req.body.supportSystem || findPatientTracking.supportSystem,
                                currentMedications: req.body.currentMedications || findPatientTracking.currentMedications,
                                religiousPreference: req.body.religiousPreference || findPatientTracking.religiousPreference,
                                nutritionAndWellnessPlanning: req.body.nutritionAndWellnessPlanning || findPatientTracking.nutritionAndWellnessPlanning,
                                recommendationToExtendResidentialTreatment: req.body.recommendationToExtendResidentialTreatment || findPatientTracking.recommendationToExtendResidentialTreatment,
                                personalFinances: req.body.personalFinances || findPatientTracking.personalFinances,
                                dischargePlanning: req.body.dischargePlanning || findPatientTracking.dischargePlanning,
                                additionalComment: req.body.additionalComment || findPatientTracking.additionalComment,
                                recommendationsForFurtherPrograms: req.body.recommendationsForFurtherPrograms || findPatientTracking.recommendationsForFurtherPrograms,
                                afterCareAndTransitionPlanning: req.body.afterCareAndTransitionPlanning || findPatientTracking.afterCareAndTransitionPlanning,
                                clinicalSummary: req.body.clinicalSummary || findPatientTracking.clinicalSummary,
                                treatmentPlanReviewDate: req.body.treatmentPlanReviewDate || findPatientTracking.treatmentPlanReviewDate,
                                dischargePlanDate: req.body.dischargePlanDate || findPatientTracking.dischargePlanDate,
                                individualsParticipatingInServicePlan: req.body.individualsParticipatingInServicePlan || findPatientTracking.individualsParticipatingInServicePlan,
                                residentAgreement: req.body.residentAgreement || findPatientTracking.residentAgreement,
                                signaturesResident: req.body.signaturesResident || findPatientTracking.signaturesResident,
                                signaturesFacilityRep: req.body.signaturesFacilityRep || findPatientTracking.signaturesFacilityRep,
                                signaturesBhp: req.body.signaturesBhp || findPatientTracking.signaturesBhp,
                        };

                        let newEmployee = await treatmentPlan.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Treatment plan add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                adminId: user1.adminId,
                                patientId: user1._id,
                                residentName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                date: req.body.date,
                                admitDate: req.body.admitDate,
                                care: req.body.care,
                                medicationServices: req.body.medicationServices,
                                presentingProblems: req.body.presentingProblems,
                                mentalStatus: req.body.mentalStatus,
                                moodLevel: req.body.moodLevel,
                                adls: req.body.adls,
                                behavioralHealthServices: req.body.behavioralHealthServices,
                                primaryCareProvider: req.body.primaryCareProvider,
                                psychiatricProvider: req.body.psychiatricProvider,
                                allergies: req.body.allergies,
                                triggers: req.body.triggers,
                                strengths: req.body.strengths,
                                barriers: req.body.barriers,
                                riskAssessment: req.body.riskAssessment,
                                interventions: req.body.interventions,
                                counselingFrequency: req.body.counselingFrequency,
                                treatmentGoals: req.body.treatmentGoals,
                                residentParticipation: req.body.residentParticipation,
                                residentAttitude: req.body.residentAttitude,
                                residentProgress: req.body.residentProgress,
                                supportSystem: req.body.supportSystem,
                                currentMedications: req.body.currentMedications,
                                religiousPreference: req.body.religiousPreference,
                                nutritionAndWellnessPlanning: req.body.nutritionAndWellnessPlanning,
                                recommendationToExtendResidentialTreatment: req.body.recommendationToExtendResidentialTreatment,
                                personalFinances: req.body.personalFinances,
                                dischargePlanning: req.body.dischargePlanning,
                                additionalComment: req.body.additionalComment,
                                recommendationsForFurtherPrograms: req.body.recommendationsForFurtherPrograms,
                                afterCareAndTransitionPlanning: req.body.afterCareAndTransitionPlanning,
                                clinicalSummary: req.body.clinicalSummary,
                                treatmentPlanReviewDate: req.body.treatmentPlanReviewDate,
                                dischargePlanDate: req.body.dischargePlanDate,
                                individualsParticipatingInServicePlan: req.body.individualsParticipatingInServicePlan,
                                residentAgreement: req.body.residentAgreement,
                                signaturesResident: req.body.signaturesResident,
                                signaturesFacilityRep: req.body.signaturesFacilityRep,
                                signaturesBhp: req.body.signaturesBhp,
                        }
                        let newEmployee = await treatmentPlan.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Treatment plan add successfully.", data: newEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getTreatmentPlan = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await treatmentPlan.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No ResidentSafety Plan found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "ResidentSafety Plan found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createNursingAssessment = async (req, res) => {
        try {
                const user1 = await User.findOne({ _id: req.body.patientId, adminId: user.adminId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        adminId: user1.adminId,
                        patientId: user1._id,
                        residentFullName: user1.firstName,
                        dateOfBirth: user1.dateOfBirth,
                        age: user1.age,
                        sex: user1.gender,
                        admissionDate: req.body.admissionDate,
                        todayDate: req.body.todayDate,
                        admissionDiagnoses: req.body.admissionDiagnoses,
                        codeStatus: req.body.codeStatus,
                        lastTBScreeningDate: req.body.lastTBScreeningDate,
                        tbScreeningResults: req.body.tbScreeningResults,
                        careProvidedPhysicalServices: req.body.careProvidedPhysicalServices,
                        careProvidedBehavioralHealthServices: req.body.careProvidedBehavioralHealthServices,
                        vitalsBloodPressure: req.body.vitalsBloodPressure,
                        vitalsPulse: req.body.vitalsPulse,
                        vitalsRespiratoryRate: req.body.vitalsRespiratoryRate,
                        vitalsOxygenLevel: req.body.vitalsOxygenLevel,
                        vitalsTemperature: req.body.vitalsTemperature,
                        vitalsWeight: req.body.vitalsWeight,
                        vitalsHeightFeet: req.body.vitalsHeightFeet,
                        vitalsHeightInches: req.body.vitalsHeightInches,
                        allergies: req.body.allergies,
                        covid19ScreeningSymptomsFeverOrChills: req.body.covid19ScreeningSymptomsFeverOrChills,
                        covid19ScreeningSymptomsShortnessOfBreath: req.body.covid19ScreeningSymptomsShortnessOfBreath,
                        covid19ScreeningSymptomsSoreThroat: req.body.covid19ScreeningSymptomsSoreThroat,
                        covid19ScreeningSymptomsDiarrhea: req.body.covid19ScreeningSymptomsDiarrhea,
                        covid19ScreeningSymptomsCough: req.body.covid19ScreeningSymptomsCough,
                        covid19ScreeningSymptomsBodyAches: req.body.covid19ScreeningSymptomsBodyAches,
                        covid19ScreeningSymptomsCongestionOrRunnyNose: req.body.covid19ScreeningSymptomsCongestionOrRunnyNose,
                        covid19ScreeningSymptomsLossOfTasteOrSmell: req.body.covid19ScreeningSymptomsLossOfTasteOrSmell,
                        covid19ScreeningSymptomsFatigue: req.body.covid19ScreeningSymptomsFatigue,
                        covid19ScreeningSymptomsHeadache: req.body.covid19ScreeningSymptomsHeadache,
                        covid19ScreeningSymptomsNauseaOrVomiting: req.body.covid19ScreeningSymptomsNauseaOrVomiting,
                        reviewOfSystemsConstitutional: req.body.reviewOfSystemsConstitutional,
                        reviewOfSystemsCardiovascular: req.body.reviewOfSystemsCardiovascular,
                        reviewOfSystemsEndocrine: req.body.reviewOfSystemsEndocrine,
                        reviewOfSystemsGastrointestinal: req.body.reviewOfSystemsGastrointestinal,
                        reviewOfSystemsGenitourinary: req.body.reviewOfSystemsGenitourinary,
                        reviewOfSystemsHematologyOncology: req.body.reviewOfSystemsHematologyOncology,
                        reviewOfSystemsHeadNeckThroat: req.body.reviewOfSystemsHeadNeckThroat,
                        reviewOfSystemsIntegumentary: req.body.reviewOfSystemsIntegumentary,
                        reviewOfSystemsMusculoskeletal: req.body.reviewOfSystemsMusculoskeletal,
                        reviewOfSystemsPsychiatric: req.body.reviewOfSystemsPsychiatric,
                        reviewOfSystemsNeurologic: req.body.reviewOfSystemsNeurologic,
                        reviewOfSystemsRespiratory: req.body.reviewOfSystemsRespiratory,
                        reviewOfSystemsAllergicImmunologic: req.body.reviewOfSystemsAllergicImmunologic,
                        suicidalRiskAssessmentDeniesSymptomsBellow: req.body.suicidalRiskAssessmentDeniesSymptomsBellow,
                        behavioralSymptoms: req.body.behavioralSymptoms,
                        physicalSymptoms: req.body.physicalSymptoms,
                        psychosocialSymptoms: req.body.psychosocialSymptoms,
                        currentMedications: req.body.currentMedications,
                        nutritionDiet: req.body.nutritionDiet,
                        nutritionSpecialDietOrder: req.body.nutritionSpecialDietOrder,
                        nutritionFluidRestrictions: req.body.nutritionFluidRestrictions,
                        skinCheck: req.body.skinCheck,
                        residentDeniesSkinConcerns: req.body.residentDeniesSkinConcerns,
                        front: req.body.front,
                        back: req.body.back,
                        sideLeft: req.body.sideLeft,
                        sideRight: req.body.sideRight,
                        legFront: req.body.legFront,
                        legBack: req.body.legBack,
                        legLeft: req.body.legLeft,
                        legRight: req.body.legRight,
                        bhtName: req.body.bhtName,
                        bhtSignature: req.body.bhtSignature,
                        rnName: req.body.rnName,
                        rnSignature: req.body.rnSignature,
                }
                let newEmployee = await nursingAssesment.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Nursing assesment add successfully.", data: newEmployee });
                }

        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getNursingAssessment = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await nursingAssessment.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No nursingAssessment found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "NursingAssessment found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createResidentIntake = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                const consentFormData = {
                        adminId: patient.adminId,
                        patientId: patient._id,
                        companyName: req.body.companyName,
                        residentName: req.body.residentName,
                        residentSignature: req.body.residentSignature,
                        residentDate: req.body.residentDate,
                        guardianRepresentativeName: req.body.guardianRepresentativeName,
                        guardianRepresentativeSignature: req.body.guardianRepresentativeSignature,
                        guardianRepresentativeDate: req.body.guardianRepresentativeDate,
                        staffName: req.body.staffName,
                        staffSignature: req.body.staffSignature,
                        staffDate: req.body.staffDate,
                        internalDisclosureList: req.body.internalDisclosureList,
                        internalDisclosureListExpire: req.body.internalDisclosureListExpire,
                        internalDisclosureListResidentName: req.body.internalDisclosureListResidentName,
                        internalDisclosureListResidentSignature: req.body.internalDisclosureListResidentSignature,
                        internalDisclosureListResidentDate: req.body.internalDisclosureListResidentDate,
                        internalDisclosureListGuardianRepresentativeName: req.body.internalDisclosureListGuardianRepresentativeName,
                        internalDisclosureListGuardianRepresentativeSignature: req.body.internalDisclosureListGuardianRepresentativeSignature,
                        internalDisclosureListGuardianRepresentativeDate: req.body.internalDisclosureListGuardianRepresentativeDate,
                        internalDisclosureListStaffName: req.body.internalDisclosureListStaffName,
                        internalDisclosureListStaffSignature: req.body.internalDisclosureListStaffSignature,
                        internalDisclosureListStaffDate: req.body.internalDisclosureListStaffDate,
                        residentRightsResidentName: req.body.residentRightsResidentName,
                        residentRightsResidentSignature: req.body.residentRightsResidentSignature,
                        residentRightsResidentDate: req.body.residentRightsResidentDate,
                        photoVideoConsentResidentName: req.body.photoVideoConsentResidentName,
                        photoVideoConsentDateOfBirth: req.body.photoVideoConsentDateOfBirth,
                        photoVideoConsentAdmissionDate: req.body.photoVideoConsentAdmissionDate,
                        photoVideoConsentConsentGiven: req.body.photoVideoConsentConsentGiven,
                        photoVideoConsentConsentWithdrawn: req.body.photoVideoConsentConsentWithdrawn,
                        photoVideoConsentResidentSignature: req.body.photoVideoConsentResidentSignature,
                        photoVideoConsentResidentDate: req.body.photoVideoConsentResidentDate,
                        photoVideoConsentGuardianRepresentativeName: req.body.photoVideoConsentGuardianRepresentativeName,
                        photoVideoConsentGuardianRepresentativeSignature: req.body.photoVideoConsentGuardianRepresentativeSignature,
                        photoVideoConsentGuardianRepresentativeDate: req.body.photoVideoConsentGuardianRepresentativeDate,
                        advanceDirectivesResidentName: req.body.advanceDirectivesResidentName,
                        advanceDirectivesResidentGender: req.body.advanceDirectivesResidentGender,
                        advanceDirectivesResidentDateOfBirth: req.body.advanceDirectivesResidentDateOfBirth,
                        advanceDirectivesResidentAddress: req.body.advanceDirectivesResidentAddress,
                        advanceDirectivesResidentDate: req.body.advanceDirectivesResidentDate,
                        advanceDirectivesProvidedInfoInitials: req.body.advanceDirectivesProvidedInfoInitials,
                        advanceDirectivesProvidedInfoDate: req.body.advanceDirectivesProvidedInfoDate,
                        advanceDirectivesProvidedInfoRefusingInitials: req.body.advanceDirectivesProvidedInfoRefusingInitials,
                        advanceDirectivesProvidedInfoRefusingDate: req.body.advanceDirectivesProvidedInfoRefusingDate,
                        advanceDirectivesDeveloped: req.body.advanceDirectivesDeveloped,
                        advanceDirectivesDevelopedComment: req.body.advanceDirectivesDevelopedComment,
                        advanceDirectivesExecutedInRecord: req.body.advanceDirectivesExecutedInRecord,
                        advanceDirectivesExecutedInRecordComment: req.body.advanceDirectivesExecutedInRecordComment,
                        advanceDirectivesFilingStatusWishNotFiled: req.body.advanceDirectivesFilingStatusWishNotFiled,
                        advanceDirectivesFilingStatusAskedForCopyNotProvided: req.body.advanceDirectivesFilingStatusAskedForCopyNotProvided,
                        advanceDirectivesFilingStatusOther: req.body.advanceDirectivesFilingStatusOther,
                        advanceDirectivesCoordinationOfCareCopySentToPCP: req.body.advanceDirectivesCoordinationOfCareCopySentToPCP,
                        advanceDirectivesCoordinationOfCareActedOn: req.body.advanceDirectivesCoordinationOfCareActedOn,
                        advanceDirectivesCoordinationOfCareAppropriatePartiesNotified: req.body.advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
                        advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment: req.body.advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
                        complaintProcessAcknowledgementCompany: req.body.complaintProcessAcknowledgementCompany,
                        complaintProcessAcknowledgementResidentName: req.body.complaintProcessAcknowledgementResidentName,
                        complaintProcessAcknowledgementResidentSignature: req.body.complaintProcessAcknowledgementResidentSignature,
                        complaintProcessAcknowledgementResidentDate: req.body.complaintProcessAcknowledgementResidentDate,
                        complaintProcessAcknowledgementGuardianRepresentativeName: req.body.complaintProcessAcknowledgementGuardianRepresentativeName,
                        complaintProcessAcknowledgementGuardianRepresentativeSignature: req.body.complaintProcessAcknowledgementGuardianRepresentativeSignature,
                        complaintProcessAcknowledgementGuardianRepresentativeDate: req.body.complaintProcessAcknowledgementGuardianRepresentativeDate,
                        orientationToAgencyCompany: req.body.orientationToAgencyCompany,
                        orientationToAgencyResidentName: req.body.orientationToAgencyResidentName,
                        orientationToAgencyResidentSignature: req.body.orientationToAgencyResidentSignature,
                        orientationToAgencyResidentDate: req.body.orientationToAgencyResidentDate,
                        orientationToAgencyGuardianRepresentativeName: req.body.orientationToAgencyGuardianRepresentativeName,
                        orientationToAgencyGuardianRepresentativeSignature: req.body.orientationToAgencyGuardianRepresentativeSignature,
                        orientationToAgencyGuardianRepresentativeDate: req.body.orientationToAgencyGuardianRepresentativeDate,
                        promotionTalkStrategicApproach: req.body.promotionTalkStrategicApproach,
                        lockBoxKeyIssueReturnDateKeyIssued: req.body.lockBoxKeyIssueReturnDateKeyIssued,
                        lockBoxKeyIssueReturnDateKeyReturned: req.body.lockBoxKeyIssueReturnDateKeyReturned,
                        lockBoxKeyIssueReturnAddress: req.body.lockBoxKeyIssueReturnAddress,
                        lockBoxKeyIssueReturnResponsibleFor: req.body.lockBoxKeyIssueReturnResponsibleFor,
                        lockBoxKeyIssueReturnResponsibleForCorporation: req.body.lockBoxKeyIssueReturnResponsibleForCorporation,
                        lockBoxKeyIssueReturnCharged: req.body.lockBoxKeyIssueReturnCharged,
                        lockBoxKeyIssueReturnResidentName: req.body.lockBoxKeyIssueReturnResidentName,
                        lockBoxKeyIssueReturnResidentSignature: req.body.lockBoxKeyIssueReturnResidentSignature,
                        lockBoxKeyIssueReturnResidentDate: req.body.lockBoxKeyIssueReturnResidentDate,
                        lockBoxKeyIssueReturnGuardianRepresentativeName: req.body.lockBoxKeyIssueReturnGuardianRepresentativeName,
                        lockBoxKeyIssueReturnGuardianRepresentativeSignature: req.body.lockBoxKeyIssueReturnGuardianRepresentativeSignature,
                        lockBoxKeyIssueReturnGuardianRepresentativeDate: req.body.lockBoxKeyIssueReturnGuardianRepresentativeDate,
                        lockBoxKeyIssueReturnStaffName: req.body.lockBoxKeyIssueReturnStaffName,
                        lockBoxKeyIssueReturnStaffSignature: req.body.lockBoxKeyIssueReturnStaffSignature,
                        lockBoxKeyIssueReturnStaffDate: req.body.lockBoxKeyIssueReturnStaffDate,
                        insuranceInformationPrimaryInsurancePolicyholderName: req.body.insuranceInformationPrimaryInsurancePolicyholderName,
                        insuranceInformationPrimaryInsurancePolicyholderDateOfBirth: req.body.insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
                        insuranceInformationPrimaryInsurancePolicyholderAddress: req.body.insuranceInformationPrimaryInsurancePolicyholderAddress,
                        insuranceInformationPrimaryInsurancePolicyholderCity: req.body.insuranceInformationPrimaryInsurancePolicyholderCity,
                        insuranceInformationPrimaryInsurancePolicyholderState: req.body.insuranceInformationPrimaryInsurancePolicyholderState,
                        insuranceInformationPrimaryInsurancePolicyholderZip: req.body.insuranceInformationPrimaryInsurancePolicyholderZip,
                        insuranceInformationPrimaryInsurancePolicyholderPhone: req.body.insuranceInformationPrimaryInsurancePolicyholderPhone,
                        insuranceInformationPrimaryInsurancePolicyholderRelationship: req.body.insuranceInformationPrimaryInsurancePolicyholderRelationship,
                        insuranceInformationPrimaryInsuranceCompany: req.body.insuranceInformationPrimaryInsuranceCompany,
                        insuranceInformationPrimaryInsuranceCustomerServicePhone: req.body.insuranceInformationPrimaryInsuranceCustomerServicePhone,
                        insuranceInformationPrimaryInsuranceSubscriberNumber: req.body.insuranceInformationPrimaryInsuranceSubscriberNumber,
                        insuranceInformationPrimaryInsuranceSubscriberGroup: req.body.insuranceInformationPrimaryInsuranceSubscriberGroup,
                        insuranceInformationPrimaryInsuranceSubscriberEffectiveDate: req.body.insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
                        insuranceInformationSecondaryInsurancePolicyholderName: req.body.insuranceInformationSecondaryInsurancePolicyholderName,
                        insuranceInformationSecondaryInsurancePolicyholderDateOfBirth: req.body.insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
                        insuranceInformationSecondaryInsurancePolicyholderAddress: req.body.insuranceInformationSecondaryInsurancePolicyholderAddress,
                        insuranceInformationSecondaryInsurancePolicyholderCity: req.body.insuranceInformationSecondaryInsurancePolicyholderCity,
                        insuranceInformationSecondaryInsurancePolicyholderState: req.body.insuranceInformationSecondaryInsurancePolicyholderState,
                        insuranceInformationSecondaryInsurancePolicyholderZip: req.body.insuranceInformationSecondaryInsurancePolicyholderZip,
                        insuranceInformationSecondaryInsurancePolicyholderPhone: req.body.insuranceInformationSecondaryInsurancePolicyholderPhone,
                        insuranceInformationSecondaryInsurancePolicyholderRelationship: req.body.insuranceInformationSecondaryInsurancePolicyholderRelationship,
                        insuranceInformationSecondaryInsuranceCompany: req.body.insuranceInformationSecondaryInsuranceCompany,
                        insuranceInformationSecondaryInsuranceCustomerServicePhone: req.body.insuranceInformationSecondaryInsuranceCustomerServicePhone,
                        insuranceInformationSecondaryInsuranceSubscriberNumber: req.body.insuranceInformationSecondaryInsuranceSubscriberNumber,
                        insuranceInformationSecondaryInsuranceSubscriberGroup: req.body.insuranceInformationSecondaryInsuranceSubscriberGroup,
                        insuranceInformationSecondaryInsuranceSubscriberEffectiveDate: req.body.insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
                        obligationsAndAuthorizationResidentName: req.body.obligationsAndAuthorizationResidentName,
                        obligationsAndAuthorizationResidentSignature: req.body.obligationsAndAuthorizationResidentSignature,
                        obligationsAndAuthorizationResidentDate: req.body.obligationsAndAuthorizationResidentDate,
                        obligationsAndAuthorizationGuardianRepresentativeName: req.body.obligationsAndAuthorizationGuardianRepresentativeName,
                        obligationsAndAuthorizationGuardianRepresentativeSignature: req.body.obligationsAndAuthorizationGuardianRepresentativeSignature,
                        obligationsAndAuthorizationGuardianRepresentativeDate: req.body.obligationsAndAuthorizationGuardianRepresentativeDate,
                };
                const newConsentForm = await residentIntake.create(consentFormData);
                if (newConsentForm) {
                        return res.status(200).send({ status: 200, message: "Resident Intake added successfully.", data: newConsentForm });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
exports.getResidentIntake = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await residentIntake.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No residentIntake found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "ResidentIntake found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};