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
                const user = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, adminId: user.adminId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await residentSafetyPlan.findOne({ employeeId: user._id, adminId: user.adminId, patientId: user1._id });
                if (findPatientTracking) {
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
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
                                employeeId: user._id,
                                adminId: user.adminId,
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
                const user = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, adminId: user.adminId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await treatmentPlan.findOne({ employeeId: user._id, adminId: user.adminId, patientId: user1._id });
                if (findPatientTracking) {
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                patientId: user1._id,
                                residentName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                date: req.body.date || findPatientTracking.date,
                                admitDate: req.body.admitDate || findPatientTracking.admitDate,
                                care: {
                                        physicalServices: req.body.physicalServices || findPatientTracking.care.physicalServices,
                                        behavioralServices: req.body.behavioralServices || findPatientTracking.care.behavioralServices,
                                },
                                medicationServices: {
                                        administration: req.body.administration || findPatientTracking.medicationServices.administration,
                                        selfAdministration: req.body.selfAdministration || findPatientTracking.medicationServices.selfAdministration,
                                },
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
                                riskAssessment: {
                                        behavioralSymptoms: req.body.behavioralSymptoms || findPatientTracking.riskAssessment.behavioralSymptoms,
                                        physicalSymptoms: req.body.physicalSymptoms || findPatientTracking.riskAssessment.physicalSymptoms,
                                        cognitiveSymptoms: req.body.cognitiveSymptoms || findPatientTracking.riskAssessment.cognitiveSymptoms,
                                        psychosocialSymptoms: req.body.psychosocialSymptoms || findPatientTracking.riskAssessment.psychosocialSymptoms,
                                },
                                interventions: req.body.interventions || findPatientTracking.interventions,
                                counselingFrequency: {
                                        group: {
                                                select: req.body.select || findPatientTracking.counselingFrequency.group.select,
                                                chosse: req.body.chosse || findPatientTracking.counselingFrequency.group.chosse,
                                        },
                                        individual: req.body.individual || findPatientTracking.counselingFrequency.individual,
                                        individualTherapy: req.body.individualTherapy || findPatientTracking.counselingFrequency.individualTherapy,
                                        residentDeclinesIndividualTherapy: req.body.residentDeclinesIndividualTherapy || findPatientTracking.counselingFrequency.residentDeclinesIndividualTherapy,
                                        familyCounseling: req.body.familyCounseling || findPatientTracking.counselingFrequency.familyCounseling,
                                        aa: req.body.aa || findPatientTracking.counselingFrequency.aa,
                                        na: req.body.na || findPatientTracking.counselingFrequency.na,
                                        monthlyArtMeetingStaffing: req.body.monthlyArtMeetingStaffing || findPatientTracking.counselingFrequency.monthlyArtMeetingStaffing,
                                        weeklyArtMeetingStaffing: req.body.weeklyArtMeetingStaffing || findPatientTracking.counselingFrequency.weeklyArtMeetingStaffing,
                                },
                                treatmentGoals: [{
                                        option1: req.body.option1 || findPatientTracking.treatmentGoals.option1,
                                        option2: req.body.option2 || findPatientTracking.treatmentGoals.option2,
                                        option3: req.body.option3 || findPatientTracking.treatmentGoals.option3,
                                        option4: req.body.option4 || findPatientTracking.treatmentGoals.option4,
                                        option5: req.body.option5 || findPatientTracking.treatmentGoals.option5,
                                        option6: req.body.option6 || findPatientTracking.treatmentGoals.option6,
                                        option7: req.body.option7 || findPatientTracking.treatmentGoals.option7,
                                        option8: req.body.option8 || findPatientTracking.treatmentGoals.option8,
                                        name: req.body.name || findPatientTracking.treatmentGoals.name,
                                        admissionMeasure: req.body.admissionMeasure || findPatientTracking.treatmentGoals.admissionMeasure,
                                        previousMeasure: req.body.previousMeasure || findPatientTracking.treatmentGoals.previousMeasure,
                                        currentMeasure: req.body.currentMeasure || findPatientTracking.treatmentGoals.currentMeasure,
                                        estimatedDateOfCompletion: req.body.estimatedDateOfCompletion || findPatientTracking.treatmentGoals.estimatedDateOfCompletion,
                                        comments: req.body.comments || findPatientTracking.treatmentGoals.comments,
                                }],
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
                                individualsParticipatingInServicePlan: {
                                        resident: req.body.resident || findPatientTracking.individualsParticipatingInServicePlan.resident,
                                        guardian: req.body.guardian || findPatientTracking.individualsParticipatingInServicePlan.guardian,
                                        staff: req.body.staff || findPatientTracking.individualsParticipatingInServicePlan.staff,
                                        bhp: req.body.bhp || findPatientTracking.individualsParticipatingInServicePlan.bhp,
                                },
                                residentAgreement: {
                                        isReason: req.body.isReason || findPatientTracking.residentAgreement.isReason,
                                        refusalReason: req.body.refusalReason || findPatientTracking.residentAgreement.refusalReason,
                                },
                                signaturesResident: {
                                        name: req.body.name || findPatientTracking.signaturesResident.name,
                                        credentials: req.body.credentials || findPatientTracking.signaturesResident.credentials,
                                        signature: req.body.signature || findPatientTracking.signaturesResident.signature,
                                        date: req.body.date || findPatientTracking.signaturesResident.date,
                                },
                                signaturesFacilityRep: {
                                        name: req.body.name || findPatientTracking.signaturesFacilityRep.name,
                                        credentials: req.body.credentials || findPatientTracking.signaturesFacilityRep.credentials,
                                        signature: req.body.signature || findPatientTracking.signaturesFacilityRep.signature,
                                        date: req.body.date || findPatientTracking.signaturesFacilityRep.date,
                                },
                                signaturesBhp: {
                                        name: req.body.name || findPatientTracking.signaturesBhp.name,
                                        credentials: req.body.credentials || findPatientTracking.signaturesBhp.credentials,
                                        signature: req.body.signature || findPatientTracking.signaturesBhp.signature,
                                        date: req.body.date || findPatientTracking.signaturesBhp.date,
                                },
                        };

                        let newEmployee = await treatmentPlan.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Treatment plan add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                patientId: user1._id,
                                residentName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                date: req.body.date,
                                admitDate: req.body.admitDate,
                                care: req.body.care,
                                medicationServices: req.body.medicationServices,
                                presentingProblems: req.body.presentingProblems,
                                mentalStatus: req.body.mentalStatus,
                                moodLevel: req.body.mentalStatus,
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