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
const faceSheet = require('../model/patientIntake/faceSheet');
const initialAssessment = require('../model/patientIntake/initialAssessment');
const nursingAssessment = require('../model/patientIntake/nursingAssessment');
const residentIntake = require('../model/patientIntake/residentIntake');
const residentSafetyPlan = require('../model/patientIntake/residentSafetyPlan');
const treatmentPlan = require('../model/patientIntake/treatmentPlan');
const refusalMedicalTreatment = require('../model/refusalMedicalTreatment');
const mars = require('../model/Medication/employeeMedication/mars');
const notification = require('../model/notification')
const MarsMedications = require('../model/Medication/employeeMedication/MarsMedications');
const mentalStatusReport = require('../model/mentalStatusReport');
const appointmentTrackingLog = require('../model/appointmentTrackingLog');
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
                const user = await User.findOne({ _id: req.user, userType: "Patient" }).populate({ path: 'employeesId', select: '-password' });
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
exports.cancelAppointment = async (req, res) => {
        try {
                const user1 = await appointment.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Upload Document not found", data: {} });
                } else {
                        let update = await appointment.findByIdAndUpdate({ _id: user1._id }, { $set: { status: "Cancel" } }, { new: true })
                        return res.status(200).send({ status: 200, message: "Appointment cancel successfully.", data: update });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllUpcomingAppointments = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const currentDate = new Date();
                const upcomingAppointments = await appointment.find({ patientId: user._id, date: { $gt: currentDate }, }).sort({ date: 1 }).populate('adminId');
                if (upcomingAppointments.length === 0) {
                        return res.status(404).send({ status: 404, message: "No appointment found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Appointment found successfully.", data: upcomingAppointments });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getAllTodayAppointments = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }

                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);  // Set the time to the beginning of the day

                console.log(user);

                const upcomingAppointments = await appointment.find({
                        patientId: user._id,
                        date: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) }
                }).sort({ date: 1 }).populate('adminId');

                if (upcomingAppointments.length === 0) {
                        return res.status(404).send({ status: 404, message: "No appointment found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Appointment found successfully.", data: upcomingAppointments });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getAllPastAppointments = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const currentDate = new Date();
                const upcomingAppointments = await appointment.find({ patientId: user._id, date: { $lt: currentDate }, }).sort({ date: 1 }).populate('adminId');
                if (upcomingAppointments.length === 0) {
                        return res.status(404).send({ status: 404, message: "No appointment found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Appointment found successfully.", data: upcomingAppointments });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
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
                const filteredTasks = await patientMedication.findOne({ patientId: user._id }).sort({ createdAt: -1 })
                if (!filteredTasks) {
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
                                signature: req.body.signature || findPatientTracking.signature,
                                signatureDate: req.body.signatureDate || findPatientTracking.signatureDate,
                                signatureTime: req.body.signatureTime || findPatientTracking.signatureTime,
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
                                signature: req.body.signature,
                                signatureDate: req.body.signatureDate,
                                signatureTime: req.body.signatureTime,
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
                let obj = {
                        adminId: user1.adminId,
                        patientId: user1._id,
                        name: req.body.name,
                        address: req.body.address,
                        number: req.body.number,
                        residentName: user1.firstName,
                        dateOfBirth: user1.dateOfBirth,
                        date: req.body.date,
                        admitDate: req.body.admitDate,
                        care: req.body.care,
                        presentingProblems: req.body.presentingProblems,
                        mentalStatus: req.body.mentalStatus,
                        mentalStatusOther: req.body.mentalStatusOther,
                        moodLevel: req.body.moodLevel,
                        moodLevelOther: req.body.moodLevelOther,
                        adls: req.body.adls,
                        adlsOther: req.body.adlsOther,
                        behavioralHealthServices: req.body.behavioralHealthServices,
                        behavioralHealthServicesOther: req.body.behavioralHealthServicesOther,
                        primaryCareProvider: req.body.primaryCareProvider,
                        psychiatricProvider: req.body.psychiatricProvider,
                        residentGoals: req.body.residentGoals,
                        allergies: req.body.allergies,
                        triggers: req.body.triggers,
                        strengths: req.body.strengths,
                        barriers: req.body.barriers,
                        riskAssessment: req.body.riskAssessment,
                        interventions: req.body.interventions,
                        interventionsComment: req.body.interventionsComment,
                        counselingFrequency: req.body.counselingFrequency,
                        counselingFrequencyMinimum: req.body.counselingFrequencyMinimum,
                        counselingFrequencyComment: req.body.counselingFrequencyComment,
                        maintainSobriety: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
                        independentLivingSkills: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
                        employment: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
                        adlsSecond: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
                        safety: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
                        medicationEducation: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
                        managingMentalHealth: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
                        legal: {
                                type: req.body.type,
                                admissionMeasure: req.body.admissionMeasure,
                                previousMeasure: req.body.previousMeasure,
                                currentMeasure: req.body.currentMeasure,
                                estimatedDateOfCompletion: req.body.estimatedDateOfCompletion,
                                comments: req.body.comments,
                        },
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
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        adminId: user1.adminId,
                        patientId: user1._id,
                        residentFullName: user1.firstName,
                        dateOfBirth: user1.dateOfBirth,
                        age: user1.age,
                        sex: req.body.gender,
                        admissionDate: req.body.admissionDate,
                        todayDate: req.body.todayDate,
                        admissionDiagnoses: req.body.admissionDiagnoses,
                        codeStatus: req.body.codeStatus,
                        lastTBScreeningDate: req.body.lastTBScreeningDate,
                        tbScreeningResults: req.body.tbScreeningResults,
                        careProvided: req.body.careProvided,
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
                        reviewOfSystemsConstitutionalComment: req.body.reviewOfSystemsConstitutionalComment,
                        reviewOfSystemsCardiovascular: req.body.reviewOfSystemsCardiovascular,
                        reviewOfSystemsCardiovascularComment: req.body.reviewOfSystemsCardiovascularComment,
                        reviewOfSystemsEndocrine: req.body.reviewOfSystemsEndocrine,
                        reviewOfSystemsEndocrineComment: req.body.reviewOfSystemsEndocrineComment,
                        reviewOfSystemsGastrointestinal: req.body.reviewOfSystemsGastrointestinal,
                        reviewOfSystemsGastrointestinalComment: req.body.reviewOfSystemsGastrointestinalComment,
                        reviewOfSystemsGenitourinary: req.body.reviewOfSystemsGenitourinary,
                        reviewOfSystemsGenitourinaryComment: req.body.reviewOfSystemsGenitourinaryComment,
                        reviewOfSystemsHematologyOncology: req.body.reviewOfSystemsHematologyOncology,
                        reviewOfSystemsHematologyOncologyComment: req.body.reviewOfSystemsHematologyOncologyComment,
                        reviewOfSystemsHeadNeckThroat: req.body.reviewOfSystemsHeadNeckThroat,
                        reviewOfSystemsHeadNeckThroatComment: req.body.reviewOfSystemsHeadNeckThroatComment,
                        reviewOfSystemsIntegumentary: req.body.reviewOfSystemsIntegumentary,
                        reviewOfSystemsIntegumentaryComment: req.body.reviewOfSystemsIntegumentaryComment,
                        reviewOfSystemsMusculoskeletal: req.body.reviewOfSystemsMusculoskeletal,
                        reviewOfSystemsMusculoskeletalComment: req.body.reviewOfSystemsMusculoskeletalComment,
                        reviewOfSystemsPsychiatric: req.body.reviewOfSystemsPsychiatric,
                        reviewOfSystemsPsychiatricComment: req.body.reviewOfSystemsPsychiatricComment,
                        reviewOfSystemsNeurologic: req.body.reviewOfSystemsNeurologic,
                        reviewOfSystemsNeurologicComment: req.body.reviewOfSystemsNeurologicComment,
                        reviewOfSystemsRespiratory: req.body.reviewOfSystemsRespiratory,
                        reviewOfSystemsRespiratoryComment: req.body.reviewOfSystemsRespiratoryComment,
                        reviewOfSystemsAllergicImmunologic: req.body.reviewOfSystemsAllergicImmunologic,
                        reviewOfSystemsAllergicImmunologicComment: req.body.reviewOfSystemsAllergicImmunologicComment,
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
                        legComment: req.body.legComment,
                        bhtName: req.body.bhtName,
                        bhtSignature: req.body.bhtSignature,
                        bhpDate: req.body.bhpDate,
                        bhpTime: req.body.bhpTime,
                        rnName: req.body.rnName,
                        rnSignature: req.body.rnSignature,
                        rnDate: req.body.rnDate,
                        rnTime: req.body.rnTime,
                }
                let newEmployee = await nursingAssessment.create(obj);
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
                        companyName: patient.companyName,
                        residentName: req.body.residentName,
                        residentSignature: req.body.residentSignature,
                        residentDate: req.body.residentDate,
                        residentSignatureTime: req.body.residentSignatureTime,
                        guardianRepresentativeName: req.body.guardianRepresentativeName,
                        guardianRepresentativeSignature: req.body.guardianRepresentativeSignature,
                        guardianRepresentativeDate: req.body.guardianRepresentativeDate,
                        guardianRepresentativeTime: req.body.guardianRepresentativeTime,
                        staffName: req.body.staffName,
                        staffSignature: req.body.staffSignature,
                        staffDate: req.body.staffDate,
                        staffTime: req.body.staffTime,
                        internalDisclosureList: req.body.internalDisclosureList,
                        internalDisclosureListExpire: req.body.internalDisclosureListExpire,
                        internalDisclosureListResidentName: req.body.internalDisclosureListResidentName,
                        internalDisclosureListResidentSignature: req.body.internalDisclosureListResidentSignature,
                        internalDisclosureListResidentDate: req.body.internalDisclosureListResidentDate,
                        internalDisclosureListResidentTime: req.body.internalDisclosureListResidentTime,
                        internalDisclosureListGuardianRepresentativeName: req.body.internalDisclosureListGuardianRepresentativeName,
                        internalDisclosureListGuardianRepresentativeSignature: req.body.internalDisclosureListGuardianRepresentativeSignature,
                        internalDisclosureListGuardianRepresentativeDate: req.body.internalDisclosureListGuardianRepresentativeDate,
                        internalDisclosureListGuardianRepresentativeTime: req.body.internalDisclosureListGuardianRepresentativeTime,
                        internalDisclosureListStaffName: req.body.internalDisclosureListStaffName,
                        internalDisclosureListStaffSignature: req.body.internalDisclosureListStaffSignature,
                        internalDisclosureListStaffDate: req.body.internalDisclosureListStaffDate,
                        internalDisclosureListStaffTime: req.body.internalDisclosureListStaffTime,
                        residentRightsResidentName: req.body.residentRightsResidentName,
                        residentRightsResidentSignature: req.body.residentRightsResidentSignature,
                        residentRightsResidentDate: req.body.residentRightsResidentDate,
                        residentRightsResidentTime: req.body.residentRightsResidentTime,
                        residentRightsGuardianRepresentativeName: req.body.residentRightsGuardianRepresentativeName,
                        residentRightsGuardianRepresentativeSignature: req.body.residentRightsGuardianRepresentativeSignature,
                        residentRightsGuardianRepresentativeDate: req.body.residentRightsGuardianRepresentativeDate,
                        residentRightsGuardianRepresentativeTime: req.body.residentRightsGuardianRepresentativeTime,
                        photoVideoConsentResidentName: req.body.photoVideoConsentResidentName,
                        photoVideoConsentDateOfBirth: req.body.photoVideoConsentDateOfBirth,
                        photoVideoConsentAdmissionDate: req.body.photoVideoConsentAdmissionDate,
                        photoVideoConsentConsentGiven: req.body.photoVideoConsentConsentGiven,
                        photoVideoConsentConsentWithdrawn: req.body.photoVideoConsentConsentWithdrawn,
                        photoVideoConsentResidentSignature: req.body.photoVideoConsentResidentSignature,
                        photoVideoConsentResidentDate: req.body.photoVideoConsentResidentDate,
                        photoVideoConsentResidentTime: req.body.photoVideoConsentResidentTime,
                        photoVideoConsentGuardianRepresentativeName: req.body.photoVideoConsentGuardianRepresentativeName,
                        photoVideoConsentGuardianRepresentativeSignature: req.body.photoVideoConsentGuardianRepresentativeSignature,
                        photoVideoConsentGuardianRepresentativeDate: req.body.photoVideoConsentGuardianRepresentativeDate,
                        photoVideoConsentGuardianRepresentativeTime: req.body.photoVideoConsentGuardianRepresentativeTime,
                        advanceDirectivesResidentName: req.body.advanceDirectivesResidentName,
                        advanceDirectivesResidentGender: req.body.advanceDirectivesResidentGender,
                        advanceDirectivesResidentDateOfBirth: req.body.advanceDirectivesResidentDateOfBirth,
                        advanceDirectivesResidentAddress: req.body.advanceDirectivesResidentAddress,
                        advanceDirectivesResidentDate: req.body.advanceDirectivesResidentDate,
                        advanceDirectivesProvidedInfoInitials: req.body.advanceDirectivesProvidedInfoInitials,
                        advanceDirectivesProvidedInfoDate: req.body.advanceDirectivesProvidedInfoDate,
                        advanceDirectivesProvidedInfoTime: req.body.advanceDirectivesProvidedInfoTime,
                        advanceDirectivesProvidedInfoRefusingInitials: req.body.advanceDirectivesProvidedInfoRefusingInitials,
                        advanceDirectivesProvidedInfoRefusingDate: req.body.advanceDirectivesProvidedInfoRefusingDate,
                        advanceDirectivesProvidedInfoRefusingTime: req.body.advanceDirectivesProvidedInfoRefusingTime,
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
                        complaintProcessAcknowledgementResidentTime: req.body.complaintProcessAcknowledgementResidentTime,
                        complaintProcessAcknowledgementGuardianRepresentativeName: req.body.complaintProcessAcknowledgementGuardianRepresentativeName,
                        complaintProcessAcknowledgementGuardianRepresentativeSignature: req.body.complaintProcessAcknowledgementGuardianRepresentativeSignature,
                        complaintProcessAcknowledgementGuardianRepresentativeDate: req.body.complaintProcessAcknowledgementGuardianRepresentativeDate,
                        complaintProcessAcknowledgementGuardianRepresentativeTime: req.body.complaintProcessAcknowledgementGuardianRepresentativeTime,
                        orientationToAgencyCompany: req.body.orientationToAgencyCompany,
                        orientationToAgencyResidentName: req.body.orientationToAgencyResidentName,
                        orientationToAgencyResidentSignature: req.body.orientationToAgencyResidentSignature,
                        orientationToAgencyResidentDate: req.body.orientationToAgencyResidentDate,
                        orientationToAgencyResidentTime: req.body.orientationToAgencyResidentTime,
                        orientationToAgencyGuardianRepresentativeName: req.body.orientationToAgencyGuardianRepresentativeName,
                        orientationToAgencyGuardianRepresentativeSignature: req.body.orientationToAgencyGuardianRepresentativeSignature,
                        orientationToAgencyGuardianRepresentativeDate: req.body.orientationToAgencyGuardianRepresentativeDate,
                        orientationToAgencyGuardianRepresentativeTime: req.body.orientationToAgencyGuardianRepresentativeTime,
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
                        lockBoxKeyIssueReturnResidentTime: req.body.lockBoxKeyIssueReturnResidentTime,
                        lockBoxKeyIssueReturnGuardianRepresentativeName: req.body.lockBoxKeyIssueReturnGuardianRepresentativeName,
                        lockBoxKeyIssueReturnGuardianRepresentativeSignature: req.body.lockBoxKeyIssueReturnGuardianRepresentativeSignature,
                        lockBoxKeyIssueReturnGuardianRepresentativeDate: req.body.lockBoxKeyIssueReturnGuardianRepresentativeDate,
                        lockBoxKeyIssueReturnGuardianRepresentativeTime: req.body.lockBoxKeyIssueReturnGuardianRepresentativeTime,
                        lockBoxKeyIssueReturnStaffName: req.body.lockBoxKeyIssueReturnStaffName,
                        lockBoxKeyIssueReturnStaffSignature: req.body.lockBoxKeyIssueReturnStaffSignature,
                        lockBoxKeyIssueReturnStaffDate: req.body.lockBoxKeyIssueReturnStaffDate,
                        lockBoxKeyIssueReturnStaffTime: req.body.lockBoxKeyIssueReturnStaffTime,
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
                        obligationsAndAuthorizationResidentTime: req.body.obligationsAndAuthorizationResidentTime,
                        obligationsAndAuthorizationGuardianRepresentativeName: req.body.obligationsAndAuthorizationGuardianRepresentativeName,
                        obligationsAndAuthorizationGuardianRepresentativeSignature: req.body.obligationsAndAuthorizationGuardianRepresentativeSignature,
                        obligationsAndAuthorizationGuardianRepresentativeDate: req.body.obligationsAndAuthorizationGuardianRepresentativeDate,
                        obligationsAndAuthorizationGuardianRepresentativeTime: req.body.obligationsAndAuthorizationGuardianRepresentativeTime
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
exports.createInitialAssessment = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                const consentFormData = {
                        patientId: patient._id,
                        assessmentOn: req.body.assessmentOn,
                        hasNotified: req.body.hasNotified,
                        dob: req.body.dateOfBirth,
                        companyName: patient.companyName,
                        residentName: req.body.residentName,
                        sex: req.body.sex,
                        dateOfAssessment: req.body.dateOfAssessment,
                        ahcccsNumber: req.body.ahcccsNumber,
                        preferredLanguage: req.body.preferredLanguage,
                        ethnicity: req.body.ethnicity,
                        admissionStatus: req.body.admissionStatus,
                        programLocation: req.body.programLocation,
                        guardianship: req.body.guardianship,
                        powerOfAttorneyStatus: req.body.powerOfAttorneyStatus,
                        todayDate: req.body.todayDate,
                        guardianshipPoaPubFidName: req.body.guardianshipPoaPubFidName,
                        approvedBy: req.body.approvedBy,
                        reasonForAdmission: req.body.reasonForAdmission,
                        residentGoals: req.body.residentGoals,
                        residentStrengths: req.body.residentStrengths,
                        residentStrengthsOther: req.body.residentStrengthsOther,
                        residentLimitations: req.body.residentLimitations,
                        currentBehavioralIssues: req.body.currentBehavioralIssues,
                        behavioralInterventions: req.body.behavioralInterventions,
                        dischargePlan: req.body.dischargePlan,
                        estimateDateOfDischarge: req.body.estimateDateOfDischarge,
                        agreementWithPlan: req.body.agreementWithPlan,
                        residentGuardianAgreement: {
                                name: req.body.residentGuardianName,
                                signature: req.body.residentGuardianSignature,
                                date: req.body.residentGuardianDate,
                                time: req.body.time
                        },
                        staffAgreement: {
                                name: req.body.staffName,
                                signature: req.body.staffSignature,
                                date: req.body.staffDate,
                                time: req.body.time
                        },
                        bhpAgreement: {
                                name: req.body.bhpName,
                                signature: req.body.bhpSignature,
                                date: req.body.bhpDate,
                                time: req.body.time
                        },
                        other: {
                                name: req.body.otherName,
                                relationship: req.body.otherRelationship,
                                signature: req.body.otherSignature,
                                date: req.body.otherDate,
                                time: req.body.time
                        },
                        medicalConditions: [{
                                condition: req.body.condition,
                                yes: req.body.yes,
                                no: req.body.no,
                                comments: req.body.comments,
                                comment: req.body.comment
                        }],
                        SignificantFamilyMedicalPsychiatricHistory: req.body.SignificantFamilyMedicalPsychiatricHistory,
                        mentalHealthTreatmentHistory: {
                                typeOfService: req.body.typeOfService,
                                where: req.body.where,
                                dates: req.body.dates,
                                diagnosisReason: req.body.diagnosisReason,
                        },
                        substanceAbuseHistory: req.body.substanceAbuseHistory,
                        substanceAbuseDenies: req.body.substanceAbuseDenies,
                        substanceAbuseHistoryData: {
                                types: req.body.types,
                                ageOfFirstUse: req.body.ageOfFirstUse,
                                lastUse: req.body.lastUse,
                                frequency: req.body.frequency,
                                lengthOfSobriety: req.body.lengthOfSobriety,
                        },
                        ActiveWithdrawalSymptoms: {
                                noneReportedOrObserved: req.body.noneReportedOrObserved,
                                Agitation: req.body.Agitation,
                                Nausea: req.body.Nausea,
                                Vomiting: req.body.Vomiting,
                                Headache: req.body.Headache,
                                TactileDisturbances: req.body.TactileDisturbances,
                                Anxiety: req.body.Anxiety,
                                Tremors: req.body.Tremors,
                                VisualDisturbances: req.body.VisualDisturbances,
                                AuditoryDisturbances: req.body.AuditoryDisturbances,
                                Sweats: req.body.Sweats,
                                Paranoia: req.body.Paranoia,
                                GooseBumps: req.body.GooseBumps,
                                Runningnose: req.body.Runningnose,
                                BonePain: req.body.BonePain,
                                Tearing: req.body.Tearing,
                                Seizures: req.body.Seizures,
                                LossofMuscleCoordination: req.body.LossofMuscleCoordination,
                        },
                        mentalStatusExam: {
                                apparentAge: {
                                        consistent: req.body.consistent,
                                        younger: req.body.younger,
                                        older: req.body.older,
                                },
                                height: {
                                        average: req.body.average,
                                        short: req.body.short,
                                        tall: req.body.tall,
                                },
                                weight: {
                                        average: req.body.average,
                                        obese: req.body.obese,
                                        overweight: req.body.overweight,
                                        thin: req.body.thin,
                                        emaciated: req.body.emaciated,
                                },
                                attire: {
                                        Casual: req.body.Casual,
                                        Neat: req.body.Neat,
                                        Tattered: req.body.Tattered,
                                        Dirty: req.body.Dirty,
                                },
                                grooming: {
                                        wellGroomed: req.body.wellGroomed,
                                        adequate: req.body.adequate,
                                        unkempt: req.body.unkempt,
                                        disheveled: req.body.disheveled,
                                },
                                Mood: {
                                        Euthymic: req.body.Euthymic,
                                        Irritable: req.body.Irritable,
                                        Elevated: req.body.Elevated,
                                        Depressed: req.body.Depressed,
                                        Anxious: req.body.Anxious,
                                },
                                Affect: {
                                        normalRange: req.body.normalRange,
                                        Depressed: req.body.Depressed,
                                        Labile: req.body.Labile,
                                        Constricted: req.body.Constricted,
                                        Other: req.body.Other,
                                },
                                EyeContact: {
                                        Appropriate: req.body.eyeContactAppropriate,
                                        Minimal: req.body.eyeContactMinimal,
                                        Poor: req.body.eyeContactPoor,
                                        Adequate: req.body.eyeContactAdequate,
                                },
                                Cooperation: {
                                        Appropriate: req.body.Appropriate,
                                        Hostile: req.body.Hostile,
                                        Evasive: req.body.Evasive,
                                        Defensive: req.body.Defensive,
                                        Indifferent: req.body.Indifferent,
                                },
                                Articulation: {
                                        Normal: req.body.Normal,
                                        Unintelligible: req.body.Unintelligible,
                                        Mumbled: req.body.Mumbled,
                                        Slurred: req.body.Slurred,
                                        Stuttered: req.body.Stuttered,
                                },
                                Tone: {
                                        Normal: req.body.Normal,
                                        Soft: req.body.Soft,
                                        Loud: req.body.Loud,
                                        Pressured: req.body.Pressured,
                                },
                                Rate: {
                                        Normal: req.body.Normal,
                                        Slow: req.body.Slow,
                                        Fast: req.body.Fast,
                                },
                                Quantity: {
                                        Normal: req.body.Normal,
                                        Verbose: req.body.Verbose,
                                        Mutism: req.body.Mutism,
                                },
                                responseLatency: {
                                        Normal: req.body.responseLatencyNormal,
                                        Delayed: req.body.responseLatencyDelayed,
                                        Shortened: req.body.responseLatencyShortened,
                                },
                                thoughtContent: {
                                        Unremarkable: req.body.Unremarkable,
                                        Suspicious: req.body.Suspicious,
                                        Negative: req.body.Negative,
                                        Concrete: req.body.Concrete,
                                },
                                thoughtProcesses: {
                                        logicalCoherent: req.body.logicalCoherent,
                                        Tangential: req.body.Tangential,
                                        Circumstantial: req.body.Circumstantial,
                                        Vague: req.body.Vague,
                                },
                                Delusions: {
                                        No: req.body.No,
                                        YesPersecutory: req.body.YesPersecutory,
                                        YesSomatic: req.body.YesSomatic,
                                        YesGrandiose: req.body.YesGrandiose,
                                        YesOther: req.body.YesOther,

                                },
                                Hallucinations: {
                                        Unremarkable: req.body.Unremarkable,
                                        VisualHallucinations: req.body.VisualHallucinations,
                                        AuditoryHallucinations: req.body.AuditoryHallucinations,
                                        TactileHallucinations: req.body.TactileHallucinations,
                                        YesOther: req.body.YesOther,
                                },
                                Gait: {
                                        Normal: req.body.Normal,
                                        Staggering: req.body.Staggering,
                                        Shuffling: req.body.Shuffling,
                                        Slow: req.body.Slow,
                                        Awkward: req.body.Awkward,
                                },
                                Posture: {
                                        Normal: req.body.Normal,
                                        Relaxed: req.body.Relaxed,
                                        Rigid: req.body.Rigid,
                                        Tense: req.body.Tense,
                                        Slouched: req.body.Slouched,
                                },
                                PsychomotorActivity: {
                                        Withinnormallimits: req.body.WithinNormalLimits,
                                        Calm: req.body.Calm,
                                        Hyperactive: req.body.Hyperactive,
                                        Agitated: req.body.Agitated,
                                        Hypoactive: req.body.Hypoactive,
                                },
                                Mannerisms: {
                                        None: req.body.None,
                                        Tics: req.body.Tics,
                                        Tremors: req.body.Tremors,
                                        Rocking: req.body.Rocking,
                                        Picking: req.body.Picking,
                                },
                                orientation: {
                                        person: req.body.orientationPerson,
                                        place: req.body.orientationPlace,
                                        time: req.body.orientationTime,
                                        circumstances: req.body.orientationCircumstances,
                                },
                                Judgment: {
                                        Good: req.body.good,
                                        Fair: req.body.fair,
                                        Poor: req.body.poor,
                                },
                                Insight: {
                                        Good: req.body.good,
                                        Fair: req.body.fair,
                                        Poor: req.body.poor,
                                },
                                Memory: {
                                        Good: req.body.good,
                                        Fair: req.body.fair,
                                        Poor: req.body.poor,
                                },
                                AbilityToConcentration: {
                                        Intact: req.body.Intact,
                                        Other: req.body.Other,
                                },
                        },
                        significantSocialDevelopmentalHistory: req.body.significantSocialDevelopmentalHistory,
                        personalInformation: {
                                highestEducation: req.body.highestEducation,
                                specialEducation: req.body.specialEducation,
                                currentStudent: req.body.currentStudent,
                                currentStudentLocation: req.body.currentStudentLocation,
                        },
                        employmentHistory: {
                                currentlyEmployed: req.body.currentlyEmployed,
                                employmentLocation: req.body.employmentLocation,
                                fullTime: req.body.fullTime,
                        },
                        workHistory: req.body.workHistory,
                        militaryHistory: {
                                militaryService: req.body.militaryService,
                                activeDuty: req.body.activeDuty,
                        },
                        legalHistory: req.body.legalHistory,
                        independentLivingSkills: [{
                                type: req.body.type,
                                good: req.body.good,
                                fair: req.body.fair,
                                needAssist: req.body.needAssist,
                                comments: req.body.comments,
                        }],
                        triggers: req.body.triggers,
                        fallRiskData: {
                                fallRisk: req.body.fallRisk,
                                fallRiskExplanation: req.body.fallRiskExplanation,
                        },
                        hobbiesLeisureActivities: req.body.hobbiesLeisureActivities,
                        medicalEquipment: req.body.medicalEquipmentOther,
                        specialPrecautions: req.body.specialPrecautions,
                        currentThoughtsOfHarmingSelf: req.body.currentThoughtsOfHarmingSelf,
                        suicidalIdeation: {
                                ideation: req.body.suicidalIdeation,
                                increasingIn: {
                                        urgency: req.body.suicidalIdeationUrgency,
                                        severity: req.body.suicidalIdeationSeverity,
                                },
                        },
                        currentThoughtsOfHarmingOthers: req.body.currentThoughtsOfHarmingOthers,
                        riskFactors: [{
                                type: req.body.type,
                                yesNo: req.body.yesNo,
                                comment: req.body.comment,
                        }],
                        protectiveFactors: [{
                                type: req.body.type,
                                yesNo: req.body.yesNo,
                                comment: req.body.comment,
                        }],
                        riskLevel: req.body.riskLevel,
                        psychiatricDiagnoses: [{
                                icdCode: req.body.icdCode,
                                description: req.body.description,
                                primary: req.body.primary,
                                secondary: req.body.secondary,
                                tertiary: req.body.tertiary,
                                additional: req.body.additional,
                        }],
                        medicalDiagnoses: [{
                                icdCode: req.body.icdCode,
                                description: req.body.description,
                                primary: req.body.primary,
                                secondary: req.body.secondary,
                                tertiary: req.body.tertiary,
                                additional: req.body.additional,
                        }],
                        additionalDiagnoses: req.body.additionalDiagnoses,
                        psychosocialStressors: {
                                primarySupportGroup: req.body.primarySupportGroup,
                                maritalProblems: req.body.maritalProblems,
                                accessToHealthCareServices: req.body.accessToHealthCareServices,
                                educationalProblems: req.body.educationalProblems,
                                housingProblems: req.body.housingProblems,
                                familyProblems: req.body.familyProblems,
                                occupationalProblems: req.body.occupationalProblems,
                                interactionWithLegalSystem: req.body.interactionWithLegalSystem,
                                substanceUseInHome: req.body.substanceUseInHome,
                                sexualProblems: req.body.sexualProblems,
                                otherStressors: req.body.otherStressors,
                        },
                        significantRecentLosses: {
                                no: req.body.no,
                                yes: req.body.yes,
                                typeOfLoss: {
                                        death: req.body.significantRecentLosses.typeOfLoss.death,
                                        job: req.body.significantRecentLosses.typeOfLoss.job,
                                        childRemovedFromHouse: req.body.significantRecentLosses.typeOfLoss.childRemovedFromHouse,
                                        injury: req.body.significantRecentLosses.typeOfLoss.injury,
                                        divorceSeparation: req.body.significantRecentLosses.typeOfLoss.divorceSeparation,
                                        violentActsAgainstPersonFamily: req.body.significantRecentLosses.typeOfLoss.violentActsAgainstPersonFamily,
                                        medicalSurgical: req.body.significantRecentLosses.typeOfLoss.medicalSurgical,
                                        accidentInjury: req.body.significantRecentLosses.typeOfLoss.accidentInjury,
                                        other: req.body.significantRecentLosses.typeOfLoss.other,
                                },
                                comment: req.body.comment
                        },
                        additionalNotes: req.body.additionalNotes,
                        staffInformation: {
                                staffName: req.body.staffName,
                                staffTitle: req.body.staffTitle,
                                staffSignature: req.body.staffSignature,
                                staffDate: req.body.staffDate || Date.now(),
                                time: req.body.time
                        },
                        bhpInformation: {
                                bhpName: req.body.bhpName,
                                bhpCredentials: req.body.bhpCredentials,
                                bhpSignature: req.body.bhpSignature,
                                bhpDate: req.body.bhpDate || Date.now(),
                                time: req.body.time
                        },
                };
                const newConsentForm = await initialAssessment.create(consentFormData);
                if (newConsentForm) {
                        return res.status(200).send({ status: 200, message: "Initial assessment added successfully.", data: newConsentForm });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
exports.getInitialAssessment = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await initialAssessment.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No initialAssessment found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Initial assessment found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createRefusalMedicalTreatment = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                req.body.adminId = patient.adminId;
                const newConsentForm = await refusalMedicalTreatment.create(req.body);
                if (newConsentForm) {
                        return res.status(200).send({ status: 200, message: "Refusal Medical Treatment added successfully.", data: newConsentForm });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
exports.getRefusalMedicalTreatment = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await refusalMedicalTreatment.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No Refusal Medical Treatment found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Refusal Medical Treatment found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getOngoingMedications = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await MarsMedications.findOne({ patientId: user._id })
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No mars found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Mars found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getPastMedications = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await MarsMedications.findOne({ patientId: user._id })
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No mars found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Mars found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createFaceSheet = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                req.body.adminId = patient.adminId;
                const newConsentForm = await faceSheet.create(req.body);
                if (newConsentForm) {
                        return res.status(200).send({ status: 200, message: "Face sheet added successfully.", data: newConsentForm });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
exports.getFaceSheet = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await faceSheet.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No faceSheet found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "FaceSheet found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.allNotification = async (req, res) => {
        try {
                const admin = await User.findById({ _id: req.user._id });
                if (!admin) {
                        return res.status(404).json({ status: 404, message: "Admin not found" });
                } else {
                        let findNotification = await notification.find({ patientId: admin._id, forUser: "Patient" }).populate('adminId employeeId patientId');
                        if (findNotification.length == 0) {
                                return res.status(404).json({ status: 404, message: "Notification data not found successfully.", data: {} })
                        } else {
                                return res.status(200).json({ status: 200, message: "Notification data found successfully.", data: findNotification })
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.createMentalStatusReport = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                req.body.adminId = patient.adminId;
                const newConsentForm = await mentalStatusReport.create(req.body);
                if (newConsentForm) {
                        return res.status(200).send({ status: 200, message: "mentalStatusReport added successfully.", data: newConsentForm });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
exports.getMentalStatusReport = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await mentalStatusReport.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No mentalStatusReport found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "mentalStatusReport found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createAppointmentTrackingLog = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                req.body.adminId = patient.adminId;
                const newConsentForm = await appointmentTrackingLog.create(req.body);
                if (newConsentForm) {
                        return res.status(200).send({ status: 200, message: "appointmentTrackingLog added successfully.", data: newConsentForm });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
exports.getAppointmentTrackingLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await appointmentTrackingLog.findOne({ patientId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No appointmentTrackingLog found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "appointmentTrackingLog found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};