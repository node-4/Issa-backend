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
                                mentalStatusOther: req.body.mentalStatusOther || findPatientTracking.mentalStatusOther,
                                moodLevel: req.body.moodLevel || findPatientTracking.moodLevel,
                                moodLevelOther: req.body.moodLevelOther || findPatientTracking.moodLevelOther,
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
                                mentalStatusOther: req.body.mentalStatusOther,
                                moodLevel: req.body.moodLevel,
                                moodLevelOther: req.body.moodLevelOther,
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
exports.createInitialAssessment = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                const consentFormData = {
                        adminId: patient.adminId,
                        patientId: patient._id,
                        assessmentOn: req.body.assessmentOn,
                        hasNotified: req.body.hasNotified,
                        dob: req.body.dateOfBirth,
                        companyName: req.body.companyName,
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
                        },
                        staffAgreement: {
                                name: req.body.staffName,
                                signature: req.body.staffSignature,
                                date: req.body.staffDate,
                        },
                        bhpAgreement: {
                                name: req.body.bhpName,
                                signature: req.body.bhpSignature,
                                date: req.body.bhpDate,
                        },
                        other: {
                                name: req.body.otherName,
                                relationship: req.body.otherRelationship,
                                signature: req.body.otherSignature,
                                date: req.body.otherDate,
                        },
                        medicalConditions: [{
                                condition: req.body.medicalCondition,
                                yes: req.body.medicalConditionYes,
                                no: req.body.medicalConditionNo,
                                comments: req.body.medicalConditionComments,
                        }],
                        SignificantFamilyMedicalPsychiatricHistory: req.body.SignificantFamilyMedicalPsychiatricHistory,
                        mentalHealthTreatmentHistory: [{
                                typeOfService: req.body.mentalHealthServiceType,
                                where: req.body.mentalHealthServiceWhere,
                                dates: req.body.mentalHealthServiceDates,
                                diagnosisReason: req.body.mentalHealthDiagnosisReason,
                        }],
                        substanceAbuseHistory: req.body.substanceAbuseHistory,
                        substanceAbuseDenies: req.body.substanceAbuseDenies,
                        substanceAbuseHistoryData: [{
                                types: req.body.substanceAbuseType,
                                ageOfFirstUse: req.body.substanceAbuseAgeOfFirstUse,
                                lastUse: req.body.substanceAbuseLastUse,
                                frequency: req.body.substanceAbuseFrequency,
                                lengthOfSobriety: req.body.substanceAbuseLengthOfSobriety,
                        }],
                        ActiveWithdrawalSymptoms: {
                                noneReportedOrObserved: req.body.activeWithdrawalNoneReportedOrObserved,
                                Agitation: req.body.activeWithdrawalAgitation,
                                Nausea: req.body.activeWithdrawalNausea,
                                Vomiting: req.body.activeWithdrawalVomiting,
                                Headache: req.body.activeWithdrawalHeadache,
                                TactileDisturbances: req.body.activeWithdrawalTactileDisturbances,
                                Anxiety: req.body.activeWithdrawalAnxiety,
                                Tremors: req.body.activeWithdrawalTremors,
                                VisualDisturbances: req.body.activeWithdrawalVisualDisturbances,
                                AuditoryDisturbances: req.body.activeWithdrawalAuditoryDisturbances,
                                Sweats: req.body.activeWithdrawalSweats,
                                Paranoia: req.body.activeWithdrawalParanoia,
                                GooseBumps: req.body.activeWithdrawalGooseBumps,
                                Runningnose: req.body.activeWithdrawalRunningnose,
                                BonePain: req.body.activeWithdrawalBonePain,
                                Tearing: req.body.activeWithdrawalTearing,
                                Seizures: req.body.activeWithdrawalSeizures,
                                LossofMuscleCoordination: req.body.activeWithdrawalLossofMuscleCoordination,
                        },
                        mentalStatusExam: {
                                apparentAge: {
                                        consistent: req.body.apparentAgeConsistent,
                                        younger: req.body.apparentAgeYounger,
                                        older: req.body.apparentAgeOlder,
                                },
                                height: {
                                        average: req.body.heightAverage,
                                        short: req.body.heightShort,
                                        tall: req.body.heightTall,
                                },
                                weight: {
                                        average: req.body.weightAverage,
                                        obese: req.body.weightObese,
                                        overweight: req.body.weightOverweight,
                                        thin: req.body.weightThin,
                                        emaciated: req.body.weightEmaciated,
                                },
                                attire: {
                                        Casual: req.body.attireCasual,
                                        Neat: req.body.attireNeat,
                                        Tattered: req.body.attireTattered,
                                        Dirty: req.body.attireDirty,
                                },
                                grooming: {
                                        wellGroomed: req.body.groomingWellGroomed,
                                        adequate: req.body.groomingAdequate,
                                        unkempt: req.body.groomingUnkempt,
                                        disheveled: req.body.groomingDisheveled,
                                },
                                Mood: {
                                        Euthymic: req.body.moodEuthymic,
                                        Irritable: req.body.moodIrritable,
                                        Elevated: req.body.moodElevated,
                                        Depressed: req.body.moodDepressed,
                                        Anxious: req.body.moodAnxious,
                                },
                                Affect: {
                                        normalRange: req.body.affectNormalRange,
                                        Depressed: req.body.affectDepressed,
                                        Labile: req.body.affectLabile,
                                        Constricted: req.body.affectConstricted,
                                        Other: req.body.affectOther,
                                },
                                EyeContact: {
                                        Appropriate: req.body.eyeContactAppropriate,
                                        Minimal: req.body.eyeContactMinimal,
                                        Poor: req.body.eyeContactPoor,
                                        Adequate: req.body.eyeContactAdequate,
                                },
                                Cooperation: {
                                        Appropriate: req.body.cooperationAppropriate,
                                        Hostile: req.body.cooperationHostile,
                                        Evasive: req.body.cooperationEvasive,
                                        Defensive: req.body.cooperationDefensive,
                                        Indifferent: req.body.cooperationIndifferent,
                                },
                                Articulation: {
                                        Normal: req.body.articulationNormal,
                                        Unintelligible: req.body.articulationUnintelligible,
                                        Mumbled: req.body.articulationMumbled,
                                        Slurred: req.body.articulationSlurred,
                                        Stuttered: req.body.articulationStuttered,
                                },
                                Tone: {
                                        Normal: req.body.toneNormal,
                                        Soft: req.body.toneSoft,
                                        Loud: req.body.toneLoud,
                                        Pressured: req.body.tonePressured,
                                },
                                Rate: {
                                        Normal: req.body.rateNormal,
                                        Slow: req.body.rateSlow,
                                        Fast: req.body.rateFast,
                                },
                                Quantity: {
                                        Normal: req.body.quantityNormal,
                                        Verbose: req.body.quantityVerbose,
                                        Mutism: req.body.quantityMutism,
                                },
                                responseLatency: {
                                        Normal: req.body.responseLatencyNormal,
                                        Delayed: req.body.responseLatencyDelayed,
                                        Shortened: req.body.responseLatencyShortened,
                                },
                                thoughtContent: {
                                        Unremarkable: req.body.thoughtContentUnremarkable,
                                        Suspicious: req.body.thoughtContentSuspicious,
                                        Negative: req.body.thoughtContentNegative,
                                        Concrete: req.body.thoughtContentConcrete,
                                },
                                thoughtProcesses: {
                                        logicalCoherent: req.body.thoughtProcessesLogicalCoherent,
                                        Tangential: req.body.thoughtProcessesTangential,
                                        Circumstantial: req.body.thoughtProcessesCircumstantial,
                                        Vague: req.body.thoughtProcessesVague,
                                },
                                Delusions: {
                                        No: req.body.delusionsNo,
                                        YesPersecutory: req.body.delusionsYesPersecutory,
                                        YesSomatic: req.body.delusionsYesSomatic,
                                        YesGrandiose: req.body.delusionsYesGrandiose,
                                        YesOther: {
                                                type: req.body.delusionsYesOtherType,
                                        },
                                },
                                Hallucinations: {
                                        Unremarkable: req.body.hallucinationsUnremarkable,
                                        VisualHallucinations: req.body.hallucinationsVisualHallucinations,
                                        AuditoryHallucinations: req.body.hallucinationsAuditoryHallucinations,
                                        TactileHallucinations: req.body.hallucinationsTactileHallucinations,
                                        YesOther: req.body.YesOther,
                                },
                                Gait: {
                                        Normal: req.body.gaitNormal,
                                        Staggering: req.body.gaitStaggering,
                                        Shuffling: req.body.gaitShuffling,
                                        Slow: req.body.gaitSlow,
                                        Awkward: req.body.gaitAwkward,
                                },
                                Posture: {
                                        Normal: req.body.postureNormal,
                                        Relaxed: req.body.postureRelaxed,
                                        Rigid: req.body.postureRigid,
                                        Tense: req.body.postureTense,
                                        Slouched: req.body.postureSlouched,
                                },
                                PsychomotorActivity: {
                                        Withinnormallimits: req.body.psychomotorActivityWithinNormalLimits,
                                        Calm: req.body.psychomotorActivityCalm,
                                        Hyperactive: req.body.psychomotorActivityHyperactive,
                                        Agitated: req.body.psychomotorActivityAgitated,
                                        Hypoactive: req.body.psychomotorActivityHypoactive,
                                },
                                Mannerisms: {
                                        None: req.body.mannerismsNone,
                                        Tics: req.body.mannerismsTics,
                                        Tremors: req.body.mannerismsTremors,
                                        Rocking: req.body.mannerismsRocking,
                                        Picking: req.body.mannerismsPicking,
                                },
                                orientation: {
                                        person: req.body.orientationPerson,
                                        place: req.body.orientationPlace,
                                        time: req.body.orientationTime,
                                        circumstances: req.body.orientationCircumstances,
                                },
                                Judgment: {
                                        Good: req.body.judgmentGood,
                                        Fair: req.body.judgmentFair,
                                        Poor: req.body.judgmentPoor,
                                },
                                Insight: {
                                        Good: req.body.insightGood,
                                        Fair: req.body.insightFair,
                                        Poor: req.body.insightPoor,
                                },
                                Memory: {
                                        Good: req.body.memoryGood,
                                        Fair: req.body.memoryFair,
                                        Poor: req.body.memoryPoor,
                                },
                                AbilityToConcentration: {
                                        Intact: req.body.abilityToConcentrationIntact,
                                        Other: req.body.abilityToConcentrationOther,
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
                        legalHistory: {
                                arrestedForDUI: req.body.arrestedForDUI,
                                arrestedForAssault: req.body.arrestedForAssault,
                                arrestedForBadChecks: req.body.arrestedForBadChecks,
                                arrestedForShoplifting: req.body.arrestedForShoplifting,
                                arrestedForAttemptedMurder: req.body.arrestedForAttemptedMurder,
                                arrestedForDrug: req.body.arrestedForDrug,
                                arrestedForAlcohol: req.body.arrestedForAlcohol,
                                arrestedForDisorderlyConduct: req.body.arrestedForDisorderlyConduct,
                                arrestedForIdentityTheft: req.body.arrestedForIdentityTheft,
                                arrestedForSexOffense: req.body.arrestedForSexOffense,
                                arrestedForOther: req.body.arrestedForOther,
                                probationParole: req.body.probationParole,
                                custody: req.body.custody,
                                pendingLitigation: req.body.pendingLitigation,
                                sentencingDates: req.body.sentencingDates,
                                needsLegalAid: req.body.needsLegalAid,
                                incarcerated: req.body.incarcerated,
                        },
                        independentLivingSkills: {
                                bathingShowering: {
                                        good: req.body.bathingShoweringGood,
                                        fair: req.body.bathingShoweringFair,
                                        needAssist: req.body.bathingShoweringNeedAssist,
                                        comments: req.body.bathingShoweringComments,
                                },
                                groomingHygiene: {
                                        good: req.body.groomingHygieneGood,
                                        fair: req.body.groomingHygieneFair,
                                        needAssist: req.body.groomingHygieneNeedAssist,
                                        comments: req.body.groomingHygieneComments,
                                },
                                mobility: {
                                        good: req.body.mobilityGood,
                                        fair: req.body.mobilityFair,
                                        needAssist: req.body.mobilityNeedAssist,
                                        comments: req.body.mobilityComments,
                                },
                                housework: {
                                        good: req.body.houseworkGood,
                                        fair: req.body.houseworkFair,
                                        needAssist: req.body.houseworkNeedAssist,
                                        comments: req.body.houseworkComments,
                                },
                                shopping: {
                                        good: req.body.shoppingGood,
                                        fair: req.body.shoppingFair,
                                        needAssist: req.body.shoppingNeedAssist,
                                        comments: req.body.shoppingComments,
                                },
                                managingMoneyBudget: {
                                        good: req.body.managingMoneyBudgetGood,
                                        fair: req.body.managingMoneyBudgetFair,
                                        needAssist: req.body.managingMoneyBudgetNeedAssist,
                                        comments: req.body.managingMoneyBudgetComments,
                                },
                                takingMedications: {
                                        good: req.body.takingMedicationsGood,
                                        fair: req.body.takingMedicationsFair,
                                        needAssist: req.body.takingMedicationsNeedAssist,
                                        comments: req.body.takingMedicationsComments,
                                },
                                preparingFood: {
                                        good: req.body.preparingFoodGood,
                                        fair: req.body.preparingFoodFair,
                                        needAssist: req.body.preparingFoodNeedAssist,
                                        comments: req.body.preparingFoodComments,
                                },
                                eating: {
                                        good: req.body.eatingGood,
                                        fair: req.body.eatingFair,
                                        needAssist: req.body.eatingNeedAssist,
                                        comments: req.body.eatingComments,
                                },
                                toileting: {
                                        good: req.body.toiletingGood,
                                        fair: req.body.toiletingFair,
                                        needAssist: req.body.toiletingNeedAssist,
                                        comments: req.body.toiletingComments,
                                },
                                other: {
                                        good: req.body.otherGood,
                                        fair: req.body.otherFair,
                                        needAssist: req.body.otherNeedAssist,
                                        comments: req.body.otherComments,
                                },
                        },
                        triggers: req.body.triggers,
                        fallRiskData: {
                                fallRisk: req.body.fallRisk,
                                fallRiskExplanation: req.body.fallRiskExplanation,
                        },
                        hobbiesLeisureActivities: req.body.hobbiesLeisureActivities,
                        medicalEquipment: {
                                wheelchair: req.body.medicalEquipmentWheelchair,
                                oxygenTank: req.body.medicalEquipmentOxygenTank,
                                cpapMachine: req.body.medicalEquipmentCpapMachine,
                                showerChair: req.body.medicalEquipmentShowerChair,
                                other: req.body.medicalEquipmentOther,
                        },
                        specialPrecautions: {
                                seizure: req.body.seizure,
                                elopementAwol: req.body.elopementAwol,
                                physicalAggression: req.body.physicalAggression,
                                withdrawal: req.body.withdrawal,
                                inappropriateSexualBehaviors: req.body.inappropriateSexualBehaviors,
                                substanceUse: req.body.substanceUse,
                                noSpecialPrecautions: req.body.noSpecialPrecautions,
                        },
                        currentThoughtsOfHarmingSelf: req.body.currentThoughtsOfHarmingSelf,
                        suicidalIdeation: {
                                ideation: req.body.suicidalIdeation,
                                increasingIn: {
                                        urgency: req.body.suicidalIdeationUrgency,
                                        severity: req.body.suicidalIdeationSeverity,
                                },
                        },
                        currentThoughtsOfHarmingOthers: req.body.currentThoughtsOfHarmingOthers,
                        riskFactors: {
                                currentSuicidalIdeation: req.body.currentSuicidalIdeation,
                                priorSuicideAttempt: req.body.priorSuicideAttempt,
                                accessToMeans: req.body.accessToMeans,
                                substanceAbuse: req.body.substanceAbuse,
                                otherSelfAbusingBehavior: req.body.otherSelfAbusingBehavior,
                                recentLossesLackOfSupport: req.body.recentLossesLackOfSupport,
                                behaviorCues: req.body.behaviorCues,
                                symptomsOfPsychosis: req.body.symptomsOfPsychosis,
                                familyHistoryOfSuicide: req.body.familyHistoryOfSuicide,
                                terminalPhysicalIllness: req.body.terminalPhysicalIllness,
                                currentStressors: req.body.currentStressors,
                                chronicPain: req.body.chronicPain,
                        },
                        protectiveFactors: {
                                supportsAvailable: req.body.supportsAvailable,
                                spiritualReligiousSupport: req.body.spiritualReligiousSupport,
                                religiousCulturalProhibitions: req.body.religiousCulturalProhibitions,
                                fearOfConsequences: req.body.fearOfConsequences,
                                ableToBeEngagedInIntervention: req.body.ableToBeEngagedInIntervention,
                                willingToCommitToKeepingSelfSafe: req.body.willingToCommitToKeepingSelfSafe,
                        },
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
                        },
                        additionalNotes: req.body.additionalNotes,
                        staffInformation: {
                                staffName: req.body.staffName,
                                staffTitle: req.body.staffTitle,
                                staffSignature: req.body.staffSignature,
                                staffDate: req.body.staffDate || Date.now(),
                        },
                        bhpInformation: {
                                bhpName: req.body.bhpName,
                                bhpCredentials: req.body.bhpCredentials,
                                bhpSignature: req.body.bhpSignature,
                                bhpDate: req.body.bhpDate || Date.now(),
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