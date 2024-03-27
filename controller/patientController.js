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
exports.getEmployee = async (req, res) => {
        try {
                const findEmployee = await User.findOne({ _id: req.user, });
                if (!findEmployee) {
                        return res.status(403).json({ status: 403, message: "Unauthorized access", data: {} });
                }
                const query = { userType: "Employee", adminId: findEmployee.adminId };
                const findPatients = await User.find(query);
                if (findPatients.length === 0) {
                        return res.status(404).json({ status: 404, message: "No patients found matching the criteria", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "Patients fetched successfully.", data: findPatients });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: "Server error: " + error.message, data: {} });
        }
}
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
exports.createFaceSheet = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await faceSheet.findOne({ adminId: patient.adminId, patientId: patient._id });
                if (findPatientTracking) {
                        let obj = {
                                patientId: patient._id,
                                adminId: patient.adminId,
                                residentName: req.body.residentName || findPatientTracking.residentName,
                                dob: req.body.dob || findPatientTracking.dob,
                                dateOfAdmit: req.body.dateOfAdmit || findPatientTracking.dateOfAdmit,
                                facilityAddress: req.body.facilityAddress || findPatientTracking.facilityAddress,
                                facilityPhoneNumber: req.body.facilityPhoneNumber || findPatientTracking.facilityPhoneNumber,
                                placeOfBirth: req.body.placeOfBirth || findPatientTracking.placeOfBirth,
                                eyeColor: req.body.eyeColor || findPatientTracking.eyeColor,
                                race: req.body.race || findPatientTracking.race,
                                height: req.body.height || findPatientTracking.height,
                                weight: req.body.weight || findPatientTracking.weight,
                                hairColor: req.body.hairColor || findPatientTracking.hairColor,
                                identifiableMarks: req.body.identifiableMarks || findPatientTracking.identifiableMarks,
                                primaryLanguage: req.body.primaryLanguage || findPatientTracking.primaryLanguage,
                                courtOrderedTreatment: req.body.courtOrderedTreatment || findPatientTracking.courtOrderedTreatment,
                                familyGuardianEmergencyName: req.body.familyGuardianEmergencyName || findPatientTracking.familyGuardianEmergencyName,
                                familyGuardianEmergencyContact: req.body.familyGuardianEmergencyContact || findPatientTracking.familyGuardianEmergencyContact,
                                facilityEmergencyContact: req.body.facilityEmergencyContact || findPatientTracking.facilityEmergencyContact,
                                medicationAllergies: req.body.medicationAllergies || findPatientTracking.medicationAllergies,
                                otherAllergies: req.body.otherAllergies || findPatientTracking.otherAllergies,
                                primaryCareProvider: req.body.primaryCareProvider || findPatientTracking.primaryCareProvider,
                                primaryCareProviderOtherSpecialists: req.body.primaryCareProviderOtherSpecialists || findPatientTracking.primaryCareProviderOtherSpecialists,
                                psychiatricProvider: req.body.psychiatricProvider || findPatientTracking.psychiatricProvider,
                                psychiatricProviderOtherSpecialists: req.body.psychiatricProviderOtherSpecialists || findPatientTracking.psychiatricProviderOtherSpecialists,
                                caseManagerName: req.body.caseManagerName || findPatientTracking.caseManagerName,
                                caseManagerPhone: req.body.caseManagerPhone || findPatientTracking.caseManagerPhone,
                                caseManagerEmail: req.body.caseManagerEmail || findPatientTracking.caseManagerEmail,
                                socialSecurityRepresentativePayeeName: req.body.socialSecurityRepresentativePayeeName || findPatientTracking.socialSecurityRepresentativePayeeName,
                                socialSecurityRepresentativePayeePhone: req.body.socialSecurityRepresentativePayeePhone || findPatientTracking.socialSecurityRepresentativePayeePhone,
                                socialSecurityRepresentativePayeeEmail: req.body.socialSecurityRepresentativePayeeEmail || findPatientTracking.socialSecurityRepresentativePayeeEmail,
                                mentalHealthDiagnoses: req.body.mentalHealthDiagnoses || findPatientTracking.mentalHealthDiagnoses,
                                medicalDiagnosesHistory: req.body.medicalDiagnosesHistory || findPatientTracking.medicalDiagnosesHistory,
                                pastSurgeries: req.body.pastSurgeries || findPatientTracking.pastSurgeries,
                                bhpName: req.body.bhpName || findPatientTracking.bhpName,
                                bhpSignature: req.body.bhpSignature || findPatientTracking.bhpSignature,
                                bhpDate: req.body.bhpDate || findPatientTracking.bhpDate,
                                time: req.body.time || findPatientTracking.time,
                                saveAsDraft: req.body.saveAsDraft || findPatientTracking.saveAsDraft
                        };
                        let newEmployee = await faceSheet.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "ResidentSafety Plan add successfully.", data: newEmployee });
                        }
                } else {
                        req.body.adminId = patient.adminId;
                        const newConsentForm = await faceSheet.create(req.body);
                        if (newConsentForm) {
                                return res.status(200).send({ status: 200, message: "Face sheet added successfully.", data: newConsentForm });
                        }
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
exports.createInitialAssessment = async (req, res) => {
        try {
                const patient = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await initialAssessment.findOne({ adminId: patient.adminId, patientId: patient._id });
                if (findPatientTracking) {
                        const consentFormData = {
                                patientId: patient._id,
                                adminId: patient.adminId,
                                assessmentType: req.body.assessmentType || findPatientTracking.assessmentType,
                                assessmentOn: req.body.assessmentOn || findPatientTracking.assessmentOn,
                                hasNotified: req.body.hasNotified || findPatientTracking.hasNotified,
                                dob: req.body.dateOfBirth || findPatientTracking.dob,
                                companyName: patient.companyName || findPatientTracking.companyName,
                                residentName: req.body.residentName || findPatientTracking.residentName,
                                sex: req.body.sex || findPatientTracking.sex,
                                dateOfAssessment: req.body.dateOfAssessment || findPatientTracking.dateOfAssessment,
                                ahcccsNumber: req.body.ahcccsNumber || findPatientTracking.ahcccsNumber,
                                preferredLanguage: req.body.preferredLanguage || findPatientTracking.preferredLanguage,
                                ethnicity: req.body.ethnicity || findPatientTracking.ethnicity,
                                admissionStatus: req.body.admissionStatus || findPatientTracking.admissionStatus,
                                programLocation: req.body.programLocation || findPatientTracking.programLocation,
                                guardianship: req.body.guardianship || findPatientTracking.guardianship,
                                powerOfAttorneyStatus: req.body.powerOfAttorneyStatus || findPatientTracking.powerOfAttorneyStatus,
                                todayDate: req.body.todayDate || findPatientTracking.todayDate,
                                guardianshipPoaPubFidName: req.body.guardianshipPoaPubFidName || findPatientTracking.guardianshipPoaPubFidName,
                                approvedBy: req.body.approvedBy || findPatientTracking.approvedBy,
                                reasonForAdmission: req.body.reasonForAdmission || findPatientTracking.reasonForAdmission,
                                residentGoals: req.body.residentGoals || findPatientTracking.residentGoals,
                                residentStrengths: req.body.residentStrengths || findPatientTracking.residentStrengths,
                                residentStrengthsOther: req.body.residentStrengthsOther || findPatientTracking.residentStrengthsOther,
                                residentLimitations: req.body.residentLimitations || findPatientTracking.residentLimitations,
                                currentBehavioralIssues: req.body.currentBehavioralIssues || findPatientTracking.currentBehavioralIssues,
                                behavioralInterventions: req.body.behavioralInterventions || findPatientTracking.behavioralInterventions,
                                dischargePlan: req.body.dischargePlan || findPatientTracking.dischargePlan,
                                estimateDateOfDischarge: req.body.estimateDateOfDischarge || findPatientTracking.estimateDateOfDischarge,
                                agreementWithPlan: req.body.agreementWithPlan || findPatientTracking.agreementWithPlan,
                                residentGuardianAgreement: req.body.residentGuardianAgreement || findPatientTracking.residentGuardianAgreement,
                                staffAgreement: req.body.staffAgreement || findPatientTracking.staffAgreement,
                                bhpAgreement: req.body.bhpAgreement || findPatientTracking.bhpAgreement,
                                other: req.body.other || findPatientTracking.other,
                                medicalConditions: req.body.medicalConditions || findPatientTracking.medicalConditions,
                                SignificantFamilyMedicalPsychiatricHistory: req.body.SignificantFamilyMedicalPsychiatricHistory || findPatientTracking.SignificantFamilyMedicalPsychiatricHistory,
                                mentalHealthTreatmentHistory: req.body.mentalHealthTreatmentHistory || findPatientTracking.mentalHealthTreatmentHistory,
                                substanceAbuseHistory: req.body.substanceAbuseHistory || findPatientTracking.substanceAbuseHistory,
                                substanceAbuseDenies: req.body.substanceAbuseDenies || findPatientTracking.substanceAbuseDenies,
                                substanceAbuseHistoryData: req.body.substanceAbuseHistoryData || findPatientTracking.substanceAbuseHistoryData,
                                ActiveWithdrawalSymptoms: req.body.ActiveWithdrawalSymptoms || findPatientTracking.ActiveWithdrawalSymptoms,
                                mentalStatusExam: req.body.mentalStatusExam || findPatientTracking.mentalStatusExam,
                                significantSocialDevelopmentalHistory: req.body.significantSocialDevelopmentalHistory,
                                personalInformation: req.body.personalInformation || findPatientTracking.personalInformation,
                                employmentHistory: req.body.employmentHistory || findPatientTracking.employmentHistory,
                                workHistory: req.body.workHistory || findPatientTracking.workHistory,
                                militaryHistory: req.body.militaryHistory || findPatientTracking.militaryHistory,
                                legalHistory: req.body.legalHistory || findPatientTracking.legalHistory,
                                independentLivingSkills: req.body.independentLivingSkills || findPatientTracking.independentLivingSkills,
                                triggers: req.body.triggers || findPatientTracking.triggers,
                                fallRiskData: req.body.fallRiskData || findPatientTracking.fallRiskData,
                                hobbiesLeisureActivities: req.body.hobbiesLeisureActivities || findPatientTracking.hobbiesLeisureActivities,
                                medicalEquipment: req.body.medicalEquipmentOther || findPatientTracking.medicalEquipmentOther,
                                specialPrecautions: req.body.specialPrecautions || findPatientTracking.specialPrecautions,
                                currentThoughtsOfHarmingSelf: req.body.currentThoughtsOfHarmingSelf || findPatientTracking.currentThoughtsOfHarmingSelf,
                                suicidalIdeation: req.body.suicidalIdeation || findPatientTracking.suicidalIdeation,
                                currentThoughtsOfHarmingOthers: req.body.currentThoughtsOfHarmingOthers || findPatientTracking.currentThoughtsOfHarmingOthers,
                                riskFactors: req.body.riskFactors || findPatientTracking.riskFactors,
                                protectiveFactors: req.body.protectiveFactors || findPatientTracking.protectiveFactors,
                                riskLevel: req.body.riskLevel || findPatientTracking.riskLevel,
                                psychiatricDiagnoses: req.body.psychiatricDiagnoses || findPatientTracking.psychiatricDiagnoses,
                                medicalDiagnoses: req.body.medicalDiagnoses || findPatientTracking.medicalDiagnoses,
                                additionalDiagnoses: req.body.additionalDiagnoses || findPatientTracking.additionalDiagnoses,
                                psychosocialStressors: req.body.psychosocialStressors || findPatientTracking.psychosocialStressors,
                                significantRecentLosses: req.body.significantRecentLosses || findPatientTracking.significantRecentLosses,
                                additionalNotes: req.body.additionalNotes || findPatientTracking.additionalNotes,
                                residentInformation: req.body.residentInformation || findPatientTracking.residentInformation,
                                staffInformation: req.body.staffInformation || findPatientTracking.staffInformation,
                                bhpInformation: req.body.bhpInformation || findPatientTracking.bhpInformation,
                                saveAsDraft: req.body.saveAsDraft || findPatientTracking.saveAsDraft
                        };
                        let newEmployee = await initialAssessment.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: consentFormData }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "ResidentSafety Plan add successfully.", data: newEmployee });
                        }
                } else {
                        const consentFormData = {
                                patientId: patient._id,
                                adminId: patient.adminId,
                                assessmentType: req.body.assessmentType,
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
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        height: {
                                                average: req.body.average,
                                                short: req.body.short,
                                                tall: req.body.tall,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        weight: {
                                                average: req.body.average,
                                                obese: req.body.obese,
                                                overweight: req.body.overweight,
                                                thin: req.body.thin,
                                                emaciated: req.body.emaciated,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        attire: {
                                                Casual: req.body.Casual,
                                                Neat: req.body.Neat,
                                                Tattered: req.body.Tattered,
                                                Dirty: req.body.Dirty,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        grooming: {
                                                wellGroomed: req.body.wellGroomed,
                                                adequate: req.body.adequate,
                                                unkempt: req.body.unkempt,
                                                disheveled: req.body.disheveled,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Mood: {
                                                Euthymic: req.body.Euthymic,
                                                Irritable: req.body.Irritable,
                                                Elevated: req.body.Elevated,
                                                Depressed: req.body.Depressed,
                                                Anxious: req.body.Anxious,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Affect: {
                                                normalRange: req.body.normalRange,
                                                Depressed: req.body.Depressed,
                                                Labile: req.body.Labile,
                                                Constricted: req.body.Constricted,
                                                Other: req.body.Other,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        EyeContact: {
                                                Appropriate: req.body.eyeContactAppropriate,
                                                Minimal: req.body.eyeContactMinimal,
                                                Poor: req.body.eyeContactPoor,
                                                Adequate: req.body.eyeContactAdequate,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Cooperation: {
                                                Appropriate: req.body.Appropriate,
                                                Hostile: req.body.Hostile,
                                                Evasive: req.body.Evasive,
                                                Defensive: req.body.Defensive,
                                                Indifferent: req.body.Indifferent,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Articulation: {
                                                Normal: req.body.Normal,
                                                Unintelligible: req.body.Unintelligible,
                                                Mumbled: req.body.Mumbled,
                                                Slurred: req.body.Slurred,
                                                Stuttered: req.body.Stuttered,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Tone: {
                                                Normal: req.body.Normal,
                                                Soft: req.body.Soft,
                                                Loud: req.body.Loud,
                                                Pressured: req.body.Pressured,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Rate: {
                                                Normal: req.body.Normal,
                                                Slow: req.body.Slow,
                                                Fast: req.body.Fast,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Quantity: {
                                                Normal: req.body.Normal,
                                                Verbose: req.body.Verbose,
                                                Mutism: req.body.Mutism,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        responseLatency: {
                                                Normal: req.body.responseLatencyNormal,
                                                Delayed: req.body.responseLatencyDelayed,
                                                Shortened: req.body.responseLatencyShortened,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        thoughtContent: {
                                                Unremarkable: req.body.Unremarkable,
                                                Suspicious: req.body.Suspicious,
                                                Negative: req.body.Negative,
                                                Concrete: req.body.Concrete,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        thoughtProcesses: {
                                                logicalCoherent: req.body.logicalCoherent,
                                                Tangential: req.body.Tangential,
                                                Circumstantial: req.body.Circumstantial,
                                                Vague: req.body.Vague,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Delusions: {
                                                No: req.body.No,
                                                YesPersecutory: req.body.YesPersecutory,
                                                YesSomatic: req.body.YesSomatic,
                                                YesGrandiose: req.body.YesGrandiose,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
                                        },
                                        Hallucinations: {
                                                Unremarkable: req.body.Unremarkable,
                                                VisualHallucinations: req.body.VisualHallucinations,
                                                AuditoryHallucinations: req.body.AuditoryHallucinations,
                                                TactileHallucinations: req.body.TactileHallucinations,
                                                YesOther: req.body.YesOther,
                                                other: req.body.other,
                                                otherComment: req.body.otherComment
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
                                        educationalHistory: req.body.educationalHistory,
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
                                        name: req.body.name
                                }],
                                medicalDiagnoses: [{
                                        icdCode: req.body.icdCode,
                                        description: req.body.description,
                                        name: req.body.name
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
                                residentInformation: {
                                        ResidentName: req.body.ResidentName,
                                        ResidentTitle: req.body.ResidentTitle,
                                        ResidentSignature: req.body.ResidentSignature,
                                        ResidentDate: { type: Date, default: Date.now },
                                        time: req.body.time,
                                },
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
                                saveAsDraft: req.body.saveAsDraft
                        };
                        const newConsentForm = await initialAssessment.create(consentFormData);
                        if (newConsentForm) {
                                return res.status(200).send({ status: 200, message: "Initial assessment added successfully.", data: newConsentForm });
                        }
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
exports.createNursingAssessment = async (req, res) => {
        try {
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await nursingAssessment.findOne({ adminId: user1.adminId, patientId: user1._id });
                if (findPatientTracking) {
                        let consentFormData = {
                                adminId: user1.adminId,
                                patientId: user1._id,
                                residentFullName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                age: user1.age,
                                sex: req.body.gender || findPatientTracking.sex,
                                admissionDate: req.body.admissionDate || findPatientTracking.admissionDate,
                                todayDate: req.body.todayDate || findPatientTracking.todayDate,
                                admissionDiagnoses: req.body.admissionDiagnoses || findPatientTracking.admissionDiagnoses,
                                codeStatus: req.body.codeStatus || findPatientTracking.codeStatus,
                                lastTBScreeningDate: req.body.lastTBScreeningDate || findPatientTracking.lastTBScreeningDate,
                                tbScreeningResults: req.body.tbScreeningResults || findPatientTracking.tbScreeningResults,
                                careProvided: req.body.careProvided || findPatientTracking.careProvided,
                                vitalsBloodPressure: req.body.vitalsBloodPressure || findPatientTracking.vitalsBloodPressure,
                                vitalsPulse: req.body.vitalsPulse || findPatientTracking.vitalsPulse,
                                vitalsRespiratoryRate: req.body.vitalsRespiratoryRate || findPatientTracking.vitalsRespiratoryRate,
                                vitalsOxygenLevel: req.body.vitalsOxygenLevel || findPatientTracking.vitalsOxygenLevel,
                                vitalsTemperature: req.body.vitalsTemperature || findPatientTracking.vitalsTemperature,
                                vitalsWeight: req.body.vitalsWeight || findPatientTracking.vitalsWeight,
                                vitalsHeightFeet: req.body.vitalsHeightFeet || findPatientTracking.vitalsHeightFeet,
                                vitalsHeightInches: req.body.vitalsHeightInches || findPatientTracking.vitalsHeightInches,
                                allergies: req.body.allergies || findPatientTracking.allergies,
                                reviewOfSystemsConstitutional: req.body.reviewOfSystemsConstitutional || findPatientTracking.reviewOfSystemsConstitutional,
                                reviewOfSystemsConstitutionalComment: req.body.reviewOfSystemsConstitutionalComment || findPatientTracking.reviewOfSystemsConstitutionalComment,
                                reviewOfSystemsCardiovascular: req.body.reviewOfSystemsCardiovascular || findPatientTracking.reviewOfSystemsCardiovascular,
                                reviewOfSystemsCardiovascularComment: req.body.reviewOfSystemsCardiovascularComment || findPatientTracking.reviewOfSystemsCardiovascularComment,
                                reviewOfSystemsEndocrine: req.body.reviewOfSystemsEndocrine || findPatientTracking.reviewOfSystemsEndocrine,
                                reviewOfSystemsEndocrineComment: req.body.reviewOfSystemsEndocrineComment || findPatientTracking.reviewOfSystemsEndocrineComment,
                                reviewOfSystemsGastrointestinal: req.body.reviewOfSystemsGastrointestinal || findPatientTracking.reviewOfSystemsGastrointestinal,
                                reviewOfSystemsGastrointestinalComment: req.body.reviewOfSystemsGastrointestinalComment || findPatientTracking.reviewOfSystemsGastrointestinalComment,
                                reviewOfSystemsGenitourinary: req.body.reviewOfSystemsGenitourinary || findPatientTracking.reviewOfSystemsGenitourinary,
                                reviewOfSystemsGenitourinaryComment: req.body.reviewOfSystemsGenitourinaryComment || findPatientTracking.reviewOfSystemsGenitourinaryComment,
                                reviewOfSystemsHematologyOncology: req.body.reviewOfSystemsHematologyOncology || findPatientTracking.reviewOfSystemsHematologyOncology,
                                reviewOfSystemsHematologyOncologyComment: req.body.reviewOfSystemsHematologyOncologyComment || findPatientTracking.reviewOfSystemsHematologyOncologyComment,
                                reviewOfSystemsHeadNeckThroat: req.body.reviewOfSystemsHeadNeckThroat || findPatientTracking.reviewOfSystemsHeadNeckThroat,
                                reviewOfSystemsHeadNeckThroatComment: req.body.reviewOfSystemsHeadNeckThroatComment || findPatientTracking.sex,
                                reviewOfSystemsIntegumentary: req.body.reviewOfSystemsHeadNeckThroatComment || findPatientTracking.reviewOfSystemsHeadNeckThroatComment,
                                reviewOfSystemsIntegumentaryComment: req.body.reviewOfSystemsIntegumentaryComment || findPatientTracking.reviewOfSystemsIntegumentaryComment,
                                reviewOfSystemsMusculoskeletal: req.body.reviewOfSystemsMusculoskeletal || findPatientTracking.reviewOfSystemsMusculoskeletal,
                                reviewOfSystemsMusculoskeletalComment: req.body.reviewOfSystemsMusculoskeletalComment || findPatientTracking.reviewOfSystemsMusculoskeletalComment,
                                reviewOfSystemsPsychiatric: req.body.reviewOfSystemsPsychiatric || findPatientTracking.reviewOfSystemsPsychiatric,
                                reviewOfSystemsPsychiatricComment: req.body.reviewOfSystemsPsychiatricComment || findPatientTracking.reviewOfSystemsPsychiatricComment,
                                reviewOfSystemsNeurologic: req.body.reviewOfSystemsNeurologic || findPatientTracking.reviewOfSystemsNeurologic,
                                reviewOfSystemsNeurologicComment: req.body.reviewOfSystemsNeurologicComment || findPatientTracking.reviewOfSystemsNeurologicComment,
                                reviewOfSystemsRespiratory: req.body.reviewOfSystemsRespiratory || findPatientTracking.reviewOfSystemsRespiratory,
                                reviewOfSystemsRespiratoryComment: req.body.reviewOfSystemsRespiratoryComment || findPatientTracking.reviewOfSystemsRespiratoryComment,
                                reviewOfSystemsAllergicImmunologic: req.body.reviewOfSystemsAllergicImmunologic || findPatientTracking.reviewOfSystemsAllergicImmunologic,
                                reviewOfSystemsAllergicImmunologicComment: req.body.reviewOfSystemsAllergicImmunologicComment || findPatientTracking.reviewOfSystemsAllergicImmunologicComment,
                                suicidalRiskAssessmentDeniesSymptomsBellow: req.body.suicidalRiskAssessmentDeniesSymptomsBellow || findPatientTracking.suicidalRiskAssessmentDeniesSymptomsBellow,
                                behavioralSymptoms: req.body.behavioralSymptoms || findPatientTracking.behavioralSymptoms,
                                physicalSymptoms: req.body.physicalSymptoms || findPatientTracking.physicalSymptoms,
                                psychosocialSymptoms: req.body.psychosocialSymptoms || findPatientTracking.psychosocialSymptoms,
                                currentMedications: req.body.currentMedications || findPatientTracking.currentMedications,
                                nutritionDiet: req.body.nutritionDiet || findPatientTracking.nutritionDiet,
                                nutritionSpecialDietOrder: req.body.nutritionSpecialDietOrder || findPatientTracking.nutritionSpecialDietOrder,
                                nutritionFluidRestrictions: req.body.nutritionFluidRestrictions || findPatientTracking.nutritionFluidRestrictions,
                                skinCheck: req.body.skinCheck || findPatientTracking.skinCheck,
                                residentDeniesSkinConcerns: req.body.residentDeniesSkinConcerns || findPatientTracking.residentDeniesSkinConcerns,
                                front: req.body.front || findPatientTracking.front,
                                back: req.body.back || findPatientTracking.back,
                                sideLeft: req.body.sideLeft || findPatientTracking.sideLeft,
                                sideRight: req.body.sideRight || findPatientTracking.sideRight,
                                legFront: req.body.legFront || findPatientTracking.legFront,
                                legBack: req.body.legBack || findPatientTracking.legBack,
                                legLeft: req.body.legLeft || findPatientTracking.legLeft,
                                legRight: req.body.legRight || findPatientTracking.legRight,
                                legComment: req.body.legComment || findPatientTracking.legComment,
                                bhtName: req.body.bhtName || findPatientTracking.bhtName,
                                bhtSignature: req.body.bhtSignature || findPatientTracking.bhtSignature,
                                bhpDate: req.body.bhpDate || findPatientTracking.bhpDate,
                                bhpTime: req.body.bhpTime || findPatientTracking.bhpTime,
                                rnName: req.body.rnName || findPatientTracking.rnName,
                                rnSignature: req.body.rnSignature || findPatientTracking.rnSignature,
                                rnDate: req.body.rnDate || findPatientTracking.rnDate,
                                rnTime: req.body.rnTime || findPatientTracking.rnTime,
                                saveAsDraft: req.body.saveAsDraft || findPatientTracking.saveAsDraft
                        }
                        let newEmployee = await nursingAssessment.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: consentFormData }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "ResidentSafety Plan add successfully.", data: newEmployee });
                        }
                } else {
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
                                saveAsDraft: req.body.saveAsDraft
                        }
                        let newEmployee = await nursingAssessment.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Nursing assesment add successfully.", data: newEmployee });
                        }
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
                const filteredTasks = await nursingAssessment.findOne({ patientId: user._id }).populate('bhtName rnName');
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
                let findPatientTracking = await residentIntake.findOne({ adminId: user1.adminId, patientId: user1._id });
                if (findPatientTracking) {
                        const consentFormData = {
                                adminId: patient.adminId || findPatientTracking.adminId || findPatientTracking.residentName,
                                patientId: patient._id || findPatientTracking.patientId || findPatientTracking.residentName,
                                companyName: patient.companyName || findPatientTracking.companyName || findPatientTracking.residentName,
                                iAgree: req.body.iAgree || findPatientTracking.iAgree || findPatientTracking.residentName,
                                residentName: req.body.residentName || findPatientTracking.residentName,
                                residentSignature: req.body.residentSignature || findPatientTracking.residentSignature,
                                residentDate: req.body.residentDate || findPatientTracking.residentDate,
                                residentSignatureTime: req.body.residentSignatureTime || findPatientTracking.residentSignatureTime,
                                guardianRepresentativeName: req.body.guardianRepresentativeName || findPatientTracking.guardianRepresentativeName,
                                guardianRepresentativeSignature: req.body.guardianRepresentativeSignature || findPatientTracking.guardianRepresentativeSignature,
                                guardianRepresentativeDate: req.body.guardianRepresentativeDate || findPatientTracking.guardianRepresentativeDate,
                                guardianRepresentativeTime: req.body.guardianRepresentativeTime || findPatientTracking.guardianRepresentativeTime,
                                staffName: req.body.staffName || findPatientTracking.staffName,
                                staffSignature: req.body.staffSignature || findPatientTracking.staffSignature,
                                staffDate: req.body.staffDate || findPatientTracking.staffDate,
                                staffTime: req.body.staffTime || findPatientTracking.staffTime,
                                internalDisclosureList: req.body.internalDisclosureList || findPatientTracking.internalDisclosureList,
                                internalDisclosureListExpire: req.body.internalDisclosureListExpire || findPatientTracking.internalDisclosureListExpire,
                                internalDisclosureListResidentName: req.body.internalDisclosureListResidentName || findPatientTracking.internalDisclosureListResidentName,
                                internalDisclosureListResidentSignature: req.body.internalDisclosureListResidentSignature || findPatientTracking.internalDisclosureListResidentSignature,
                                internalDisclosureListResidentDate: req.body.internalDisclosureListResidentDate || findPatientTracking.internalDisclosureListResidentDate,
                                internalDisclosureListResidentTime: req.body.internalDisclosureListResidentTime || findPatientTracking.internalDisclosureListResidentTime,
                                internalDisclosureListGuardianRepresentativeName: req.body.internalDisclosureListGuardianRepresentativeName || findPatientTracking.internalDisclosureListGuardianRepresentativeName,
                                internalDisclosureListGuardianRepresentativeSignature: req.body.internalDisclosureListGuardianRepresentativeSignature || findPatientTracking.internalDisclosureListGuardianRepresentativeSignature,
                                internalDisclosureListGuardianRepresentativeDate: req.body.internalDisclosureListGuardianRepresentativeDate || findPatientTracking.internalDisclosureListGuardianRepresentativeDate,
                                internalDisclosureListGuardianRepresentativeTime: req.body.internalDisclosureListGuardianRepresentativeTime || findPatientTracking.internalDisclosureListGuardianRepresentativeTime,
                                internalDisclosureListStaffName: req.body.internalDisclosureListStaffName || findPatientTracking.internalDisclosureListStaffName,
                                internalDisclosureListStaffSignature: req.body.internalDisclosureListStaffSignature || findPatientTracking.internalDisclosureListStaffSignature,
                                internalDisclosureListStaffDate: req.body.internalDisclosureListStaffDate || findPatientTracking.internalDisclosureListStaffDate,
                                internalDisclosureListStaffTime: req.body.internalDisclosureListStaffTime || findPatientTracking.internalDisclosureListStaffTime,
                                residentRightsResidentName: req.body.residentRightsResidentName || findPatientTracking.residentRightsResidentName,
                                residentRightsResidentSignature: req.body.residentRightsResidentSignature || findPatientTracking.residentRightsResidentSignature,
                                residentRightsResidentDate: req.body.residentRightsResidentDate || findPatientTracking.residentRightsResidentDate,
                                residentRightsResidentTime: req.body.residentRightsResidentTime || findPatientTracking.residentRightsResidentTime,
                                residentRightsGuardianRepresentativeName: req.body.residentRightsGuardianRepresentativeName || findPatientTracking.residentRightsGuardianRepresentativeName,
                                residentRightsGuardianRepresentativeSignature: req.body.residentRightsGuardianRepresentativeSignature || findPatientTracking.residentRightsGuardianRepresentativeSignature,
                                residentRightsGuardianRepresentativeDate: req.body.residentRightsGuardianRepresentativeDate || findPatientTracking.residentRightsGuardianRepresentativeDate,
                                residentRightsGuardianRepresentativeTime: req.body.residentRightsGuardianRepresentativeTime || findPatientTracking.residentRightsGuardianRepresentativeTime,
                                photoVideoConsentResidentName: req.body.photoVideoConsentResidentName || findPatientTracking.photoVideoConsentResidentName,
                                photoVideoConsentDateOfBirth: req.body.photoVideoConsentDateOfBirth || findPatientTracking.photoVideoConsentDateOfBirth,
                                photoVideoConsentAdmissionDate: req.body.photoVideoConsentAdmissionDate || findPatientTracking.photoVideoConsentAdmissionDate,
                                photoVideoConsentConsentGiven: req.body.photoVideoConsentConsentGiven || findPatientTracking.photoVideoConsentConsentGiven,
                                photoVideoConsentConsentWithdrawn: req.body.photoVideoConsentConsentWithdrawn || findPatientTracking.photoVideoConsentConsentWithdrawn,
                                photoVideoConsentResidentSignature: req.body.photoVideoConsentResidentSignature || findPatientTracking.photoVideoConsentResidentSignature,
                                photoVideoConsentResidentDate: req.body.photoVideoConsentResidentDate || findPatientTracking.photoVideoConsentResidentDate,
                                photoVideoConsentResidentTime: req.body.photoVideoConsentResidentTime || findPatientTracking.photoVideoConsentResidentTime,
                                photoVideoConsentGuardianRepresentativeName: req.body.photoVideoConsentGuardianRepresentativeName || findPatientTracking.photoVideoConsentGuardianRepresentativeName,
                                photoVideoConsentGuardianRepresentativeSignature: req.body.photoVideoConsentGuardianRepresentativeSignature || findPatientTracking.photoVideoConsentGuardianRepresentativeSignature,
                                photoVideoConsentGuardianRepresentativeDate: req.body.photoVideoConsentGuardianRepresentativeDate || findPatientTracking.photoVideoConsentGuardianRepresentativeDate,
                                photoVideoConsentGuardianRepresentativeTime: req.body.photoVideoConsentGuardianRepresentativeTime || findPatientTracking.photoVideoConsentGuardianRepresentativeTime,
                                advanceDirectivesResidentName: req.body.advanceDirectivesResidentName || findPatientTracking.advanceDirectivesResidentName,
                                advanceDirectivesResidentGender: req.body.advanceDirectivesResidentGender || findPatientTracking.advanceDirectivesResidentGender,
                                advanceDirectivesResidentDateOfBirth: req.body.advanceDirectivesResidentDateOfBirth || findPatientTracking.advanceDirectivesResidentDateOfBirth,
                                advanceDirectivesResidentAddress: req.body.advanceDirectivesResidentAddress || findPatientTracking.advanceDirectivesResidentAddress,
                                advanceDirectivesResidentDate: req.body.advanceDirectivesResidentDate || findPatientTracking.advanceDirectivesResidentDate,
                                advanceDirectivesProvidedInfoInitials: req.body.advanceDirectivesProvidedInfoInitials || findPatientTracking.advanceDirectivesProvidedInfoInitials,
                                advanceDirectivesProvidedInfoDate: req.body.advanceDirectivesProvidedInfoDate || findPatientTracking.advanceDirectivesProvidedInfoDate,
                                advanceDirectivesProvidedInfoTime: req.body.advanceDirectivesProvidedInfoTime || findPatientTracking.advanceDirectivesProvidedInfoTime,
                                advanceDirectivesProvidedInfoRefusingInitials: req.body.advanceDirectivesProvidedInfoRefusingInitials || findPatientTracking.advanceDirectivesProvidedInfoRefusingInitials,
                                advanceDirectivesProvidedInfoRefusingDate: req.body.advanceDirectivesProvidedInfoRefusingDate || findPatientTracking.advanceDirectivesProvidedInfoRefusingDate,
                                advanceDirectivesProvidedInfoRefusingTime: req.body.advanceDirectivesProvidedInfoRefusingTime || findPatientTracking.advanceDirectivesProvidedInfoRefusingTime,
                                advanceDirectivesDeveloped: req.body.advanceDirectivesDeveloped || findPatientTracking.advanceDirectivesDeveloped,
                                advanceDirectivesDevelopedComment: req.body.advanceDirectivesDevelopedComment || findPatientTracking.advanceDirectivesDevelopedComment,
                                advanceDirectivesExecutedInRecord: req.body.advanceDirectivesExecutedInRecord || findPatientTracking.advanceDirectivesExecutedInRecord,
                                advanceDirectivesExecutedInRecordComment: req.body.advanceDirectivesExecutedInRecordComment || findPatientTracking.advanceDirectivesExecutedInRecordComment,
                                advanceDirectivesFilingStatusWishNotFiled: req.body.advanceDirectivesFilingStatusWishNotFiled || findPatientTracking.advanceDirectivesFilingStatusWishNotFiled,
                                advanceDirectivesFilingStatusAskedForCopyNotProvided: req.body.advanceDirectivesFilingStatusAskedForCopyNotProvided || findPatientTracking.advanceDirectivesFilingStatusAskedForCopyNotProvided,
                                advanceDirectivesFilingStatusOther: req.body.advanceDirectivesFilingStatusOther || findPatientTracking.advanceDirectivesFilingStatusOther,
                                advanceDirectivesCoordinationOfCareCopySentToPCP: req.body.advanceDirectivesCoordinationOfCareCopySentToPCP || findPatientTracking.advanceDirectivesCoordinationOfCareCopySentToPCP,
                                advanceDirectivesCoordinationOfCareActedOn: req.body.advanceDirectivesCoordinationOfCareActedOn || findPatientTracking.advanceDirectivesCoordinationOfCareActedOn,
                                advanceDirectivesCoordinationOfCareAppropriatePartiesNotified: req.body.advanceDirectivesCoordinationOfCareAppropriatePartiesNotified || findPatientTracking.advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
                                advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment: req.body.advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment || findPatientTracking.advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
                                complaintProcessAcknowledgementCompany: req.body.complaintProcessAcknowledgementCompany || findPatientTracking.complaintProcessAcknowledgementCompany,
                                complaintProcessAcknowledgementResidentName: req.body.complaintProcessAcknowledgementResidentName || findPatientTracking.complaintProcessAcknowledgementResidentName,
                                complaintProcessAcknowledgementResidentSignature: req.body.complaintProcessAcknowledgementResidentSignature || findPatientTracking.complaintProcessAcknowledgementResidentSignature,
                                complaintProcessAcknowledgementResidentDate: req.body.complaintProcessAcknowledgementResidentDate || findPatientTracking.complaintProcessAcknowledgementResidentDate,
                                complaintProcessAcknowledgementResidentTime: req.body.complaintProcessAcknowledgementResidentTime || findPatientTracking.complaintProcessAcknowledgementResidentTime,
                                complaintProcessAcknowledgementGuardianRepresentativeName: req.body.complaintProcessAcknowledgementGuardianRepresentativeName || findPatientTracking.complaintProcessAcknowledgementGuardianRepresentativeName,
                                complaintProcessAcknowledgementGuardianRepresentativeSignature: req.body.complaintProcessAcknowledgementGuardianRepresentativeSignature || findPatientTracking.complaintProcessAcknowledgementGuardianRepresentativeSignature,
                                complaintProcessAcknowledgementGuardianRepresentativeDate: req.body.complaintProcessAcknowledgementGuardianRepresentativeDate || findPatientTracking.complaintProcessAcknowledgementGuardianRepresentativeDate,
                                complaintProcessAcknowledgementGuardianRepresentativeTime: req.body.complaintProcessAcknowledgementGuardianRepresentativeTime || findPatientTracking.complaintProcessAcknowledgementGuardianRepresentativeTime,
                                orientationToAgencyCompanyFollowing: req.body.orientationToAgencyCompanyFollowing || findPatientTracking.orientationToAgencyCompanyFollowing,
                                orientationToAgencyCompany: req.body.orientationToAgencyCompany || findPatientTracking.orientationToAgencyCompany,
                                orientationToAgencyResidentName: req.body.orientationToAgencyResidentName || findPatientTracking.orientationToAgencyResidentName,
                                orientationToAgencyResidentSignature: req.body.orientationToAgencyResidentSignature || findPatientTracking.orientationToAgencyResidentSignature,
                                orientationToAgencyResidentDate: req.body.orientationToAgencyResidentDate || findPatientTracking.orientationToAgencyResidentDate,
                                orientationToAgencyResidentTime: req.body.orientationToAgencyResidentTime || findPatientTracking.orientationToAgencyResidentTime,
                                orientationToAgencyGuardianRepresentativeName: req.body.orientationToAgencyGuardianRepresentativeName || findPatientTracking.orientationToAgencyGuardianRepresentativeName,
                                orientationToAgencyGuardianRepresentativeSignature: req.body.orientationToAgencyGuardianRepresentativeSignature || findPatientTracking.orientationToAgencyGuardianRepresentativeSignature,
                                orientationToAgencyGuardianRepresentativeDate: req.body.orientationToAgencyGuardianRepresentativeDate || findPatientTracking.orientationToAgencyGuardianRepresentativeDate,
                                orientationToAgencyGuardianRepresentativeTime: req.body.orientationToAgencyGuardianRepresentativeTime || findPatientTracking.orientationToAgencyGuardianRepresentativeTime,
                                promotionTalkStrategicApproach: req.body.promotionTalkStrategicApproach || findPatientTracking.promotionTalkStrategicApproach,
                                lockBoxKeyIssueReturnDateKeyIssued: req.body.lockBoxKeyIssueReturnDateKeyIssued || findPatientTracking.lockBoxKeyIssueReturnDateKeyIssued,
                                lockBoxKeyIssueReturnDateKeyReturned: req.body.lockBoxKeyIssueReturnDateKeyReturned || findPatientTracking.lockBoxKeyIssueReturnDateKeyReturned,
                                lockBoxKeyIssueReturnAddress: req.body.lockBoxKeyIssueReturnAddress || findPatientTracking.lockBoxKeyIssueReturnAddress,
                                lockBoxKeyIssueReturnResponsibleFor: req.body.lockBoxKeyIssueReturnResponsibleFor || findPatientTracking.lockBoxKeyIssueReturnResponsibleFor,
                                lockBoxKeyIssueReturnResponsibleForCorporation: req.body.lockBoxKeyIssueReturnResponsibleForCorporation || findPatientTracking.lockBoxKeyIssueReturnResponsibleForCorporation,
                                lockBoxKeyIssueReturnCharged: req.body.lockBoxKeyIssueReturnCharged || findPatientTracking.lockBoxKeyIssueReturnCharged,
                                lockBoxKeyIssueReturnResidentName: req.body.lockBoxKeyIssueReturnResidentName || findPatientTracking.lockBoxKeyIssueReturnResidentName,
                                lockBoxKeyIssueReturnResidentSignature: req.body.lockBoxKeyIssueReturnResidentSignature || findPatientTracking.lockBoxKeyIssueReturnResidentSignature,
                                lockBoxKeyIssueReturnResidentDate: req.body.lockBoxKeyIssueReturnResidentDate || findPatientTracking.lockBoxKeyIssueReturnResidentDate,
                                lockBoxKeyIssueReturnResidentTime: req.body.lockBoxKeyIssueReturnResidentTime || findPatientTracking.lockBoxKeyIssueReturnResidentTime,
                                lockBoxKeyIssueReturnGuardianRepresentativeName: req.body.lockBoxKeyIssueReturnGuardianRepresentativeName || findPatientTracking.lockBoxKeyIssueReturnGuardianRepresentativeName,
                                lockBoxKeyIssueReturnGuardianRepresentativeSignature: req.body.lockBoxKeyIssueReturnGuardianRepresentativeSignature || findPatientTracking.lockBoxKeyIssueReturnGuardianRepresentativeSignature,
                                lockBoxKeyIssueReturnGuardianRepresentativeDate: req.body.lockBoxKeyIssueReturnGuardianRepresentativeDate || findPatientTracking.lockBoxKeyIssueReturnGuardianRepresentativeDate,
                                lockBoxKeyIssueReturnGuardianRepresentativeTime: req.body.lockBoxKeyIssueReturnGuardianRepresentativeTime || findPatientTracking.lockBoxKeyIssueReturnGuardianRepresentativeTime,
                                lockBoxKeyIssueReturnStaffName: req.body.lockBoxKeyIssueReturnStaffName || findPatientTracking.lockBoxKeyIssueReturnStaffName,
                                lockBoxKeyIssueReturnStaffSignature: req.body.lockBoxKeyIssueReturnStaffSignature || findPatientTracking.lockBoxKeyIssueReturnStaffSignature,
                                lockBoxKeyIssueReturnStaffDate: req.body.lockBoxKeyIssueReturnStaffDate || findPatientTracking.lockBoxKeyIssueReturnStaffDate,
                                lockBoxKeyIssueReturnStaffTime: req.body.lockBoxKeyIssueReturnStaffTime || findPatientTracking.lockBoxKeyIssueReturnStaffTime,
                                insuranceInformationPrimaryInsurancePolicyholderName: req.body.insuranceInformationPrimaryInsurancePolicyholderName || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderName,
                                insuranceInformationPrimaryInsurancePolicyholderDateOfBirth: req.body.insuranceInformationPrimaryInsurancePolicyholderDateOfBirth || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
                                insuranceInformationPrimaryInsurancePolicyholderAddress: req.body.insuranceInformationPrimaryInsurancePolicyholderAddress || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderAddress,
                                insuranceInformationPrimaryInsurancePolicyholderCity: req.body.insuranceInformationPrimaryInsurancePolicyholderCity || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderCity,
                                insuranceInformationPrimaryInsurancePolicyholderState: req.body.insuranceInformationPrimaryInsurancePolicyholderState || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderState,
                                insuranceInformationPrimaryInsurancePolicyholderZip: req.body.insuranceInformationPrimaryInsurancePolicyholderZip || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderZip,
                                insuranceInformationPrimaryInsurancePolicyholderPhone: req.body.insuranceInformationPrimaryInsurancePolicyholderPhone || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderPhone,
                                insuranceInformationPrimaryInsurancePolicyholderRelationship: req.body.insuranceInformationPrimaryInsurancePolicyholderRelationship || findPatientTracking.insuranceInformationPrimaryInsurancePolicyholderRelationship,
                                insuranceInformationPrimaryInsuranceCompany: req.body.insuranceInformationPrimaryInsuranceCompany || findPatientTracking.insuranceInformationPrimaryInsuranceCompany,
                                insuranceInformationPrimaryInsuranceCustomerServicePhone: req.body.insuranceInformationPrimaryInsuranceCustomerServicePhone || findPatientTracking.insuranceInformationPrimaryInsuranceCustomerServicePhone,
                                insuranceInformationPrimaryInsuranceSubscriberNumber: req.body.insuranceInformationPrimaryInsuranceSubscriberNumber || findPatientTracking.insuranceInformationPrimaryInsuranceSubscriberNumber,
                                insuranceInformationPrimaryInsuranceSubscriberGroup: req.body.insuranceInformationPrimaryInsuranceSubscriberGroup || findPatientTracking.insuranceInformationPrimaryInsuranceSubscriberGroup,
                                insuranceInformationPrimaryInsuranceSubscriberEffectiveDate: req.body.insuranceInformationPrimaryInsuranceSubscriberEffectiveDate || findPatientTracking.insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
                                insuranceInformationSecondaryInsurancePolicyholderName: req.body.insuranceInformationSecondaryInsurancePolicyholderName || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderName,
                                insuranceInformationSecondaryInsurancePolicyholderDateOfBirth: req.body.insuranceInformationSecondaryInsurancePolicyholderDateOfBirth || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
                                insuranceInformationSecondaryInsurancePolicyholderAddress: req.body.insuranceInformationSecondaryInsurancePolicyholderAddress || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderAddress,
                                insuranceInformationSecondaryInsurancePolicyholderCity: req.body.insuranceInformationSecondaryInsurancePolicyholderCity || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderCity,
                                insuranceInformationSecondaryInsurancePolicyholderState: req.body.insuranceInformationSecondaryInsurancePolicyholderState || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderState,
                                insuranceInformationSecondaryInsurancePolicyholderZip: req.body.insuranceInformationSecondaryInsurancePolicyholderZip || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderZip,
                                insuranceInformationSecondaryInsurancePolicyholderPhone: req.body.insuranceInformationSecondaryInsurancePolicyholderPhone || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderPhone,
                                insuranceInformationSecondaryInsurancePolicyholderRelationship: req.body.insuranceInformationSecondaryInsurancePolicyholderRelationship || findPatientTracking.insuranceInformationSecondaryInsurancePolicyholderRelationship,
                                insuranceInformationSecondaryInsuranceCompany: req.body.insuranceInformationSecondaryInsuranceCompany || findPatientTracking.insuranceInformationSecondaryInsuranceCompany,
                                insuranceInformationSecondaryInsuranceCustomerServicePhone: req.body.insuranceInformationSecondaryInsuranceCustomerServicePhone || findPatientTracking.insuranceInformationSecondaryInsuranceCustomerServicePhone,
                                insuranceInformationSecondaryInsuranceSubscriberNumber: req.body.insuranceInformationSecondaryInsuranceSubscriberNumber || findPatientTracking.insuranceInformationSecondaryInsuranceSubscriberNumber,
                                insuranceInformationSecondaryInsuranceSubscriberGroup: req.body.insuranceInformationSecondaryInsuranceSubscriberGroup || findPatientTracking.insuranceInformationSecondaryInsuranceSubscriberGroup,
                                insuranceInformationSecondaryInsuranceSubscriberEffectiveDate: req.body.insuranceInformationSecondaryInsuranceSubscriberEffectiveDate || findPatientTracking.insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
                                obligationsAndAuthorizationResidentName: req.body.obligationsAndAuthorizationResidentName || findPatientTracking.obligationsAndAuthorizationResidentName,
                                obligationsAndAuthorizationResidentSignature: req.body.obligationsAndAuthorizationResidentSignature || findPatientTracking.obligationsAndAuthorizationResidentSignature,
                                obligationsAndAuthorizationResidentDate: req.body.obligationsAndAuthorizationResidentDate || findPatientTracking.obligationsAndAuthorizationResidentDate,
                                obligationsAndAuthorizationResidentTime: req.body.obligationsAndAuthorizationResidentTime || findPatientTracking.obligationsAndAuthorizationResidentTime,
                                obligationsAndAuthorizationGuardianRepresentativeName: req.body.obligationsAndAuthorizationGuardianRepresentativeName || findPatientTracking.obligationsAndAuthorizationGuardianRepresentativeName,
                                obligationsAndAuthorizationGuardianRepresentativeSignature: req.body.obligationsAndAuthorizationGuardianRepresentativeSignature || findPatientTracking.obligationsAndAuthorizationGuardianRepresentativeSignature,
                                obligationsAndAuthorizationGuardianRepresentativeDate: req.body.obligationsAndAuthorizationGuardianRepresentativeDate || findPatientTracking.obligationsAndAuthorizationGuardianRepresentativeDate,
                                obligationsAndAuthorizationGuardianRepresentativeTime: req.body.obligationsAndAuthorizationGuardianRepresentativeTime || findPatientTracking.obligationsAndAuthorizationGuardianRepresentativeTime,
                                saveAsDraft: req.body.saveAsDraft || findPatientTracking.saveAsDraft
                        };
                        let newEmployee = await residentIntake.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: consentFormData }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "ResidentSafety Plan add successfully.", data: newEmployee });
                        }
                } else {
                        const consentFormData = {
                                adminId: patient.adminId,
                                patientId: patient._id,
                                companyName: patient.companyName,
                                iAgree: req.body.iAgree,
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
                                orientationToAgencyCompanyFollowing: req.body.orientationToAgencyCompanyFollowing,
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
                                obligationsAndAuthorizationGuardianRepresentativeTime: req.body.obligationsAndAuthorizationGuardianRepresentativeTime,
                                saveAsDraft: req.body.saveAsDraft
                        };
                        const newConsentForm = await residentIntake.create(consentFormData);
                        if (newConsentForm) {
                                return res.status(200).send({ status: 200, message: "Resident Intake added successfully.", data: newConsentForm });
                        }
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
                                professionalsClinicianName: req.body.professionalsClinicianName || findPatientTracking.professionalsClinicianName,
                                professionalsPhone: req.body.professionalsPhone || findPatientTracking.professionalsPhone,
                                professionalsRelationship: req.body.professionalsRelationship || findPatientTracking.professionalsRelationship,
                                helpContactsPeople: req.body.helpContactsPeople || findPatientTracking.helpContactsPeople,
                                professionals: req.body.professionals || findPatientTracking.professionals,
                                suicidePrevention: req.body.suicidePrevention || findPatientTracking.suicidePrevention,
                                localEmergencyHelp: req.body.localEmergencyHelp || findPatientTracking.localEmergencyHelp,
                                environmentSafetyMedications: req.body.environmentSafetyMedications || findPatientTracking.environmentSafetyMedications,
                                signature: req.body.signature || findPatientTracking.signature,
                                signatureDate: req.body.signatureDate || findPatientTracking.signatureDate,
                                signatureTime: req.body.signatureTime || findPatientTracking.signatureTime,
                                saveAsDraft: req.body.saveAsDraft || findPatientTracking.saveAsDraft
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
                                professionalsClinicianName: req.body.professionalsClinicianName,
                                professionalsPhone: req.body.professionalsPhone,
                                professionalsRelationship: req.body.professionalsRelationship,
                                professionals: req.body.professionals,
                                suicidePrevention: req.body.suicidePrevention,
                                localEmergencyHelp: req.body.localEmergencyHelp,
                                environmentSafetyMedications: req.body.environmentSafetyMedications,
                                signature: req.body.signature,
                                signatureDate: req.body.signatureDate,
                                signatureTime: req.body.signatureTime,
                                saveAsDraft: req.body.saveAsDraft
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
                                name: req.body.name,
                                address: req.body.address || findPatientTracking.address,
                                number: req.body.number || findPatientTracking.number,
                                residentName: user1.firstName,
                                dateOfBirth: user1.dateOfBirth,
                                date: req.body.date || findPatientTracking.date,
                                admitDate: req.body.admitDate || findPatientTracking.admitDate,
                                care: req.body.care || findPatientTracking.care,
                                medicationService: req.body.medicationService || findPatientTracking.medicationService,
                                presentingProblems: req.body.presentingProblems || findPatientTracking.presentingProblems,
                                diagonsis: req.body.diagonsis || findPatientTracking.diagonsis,
                                mentalStatus: req.body.mentalStatus || findPatientTracking.mentalStatus,
                                mentalStatusOther: req.body.mentalStatusOther || findPatientTracking.mentalStatusOther,
                                moodLevel: req.body.moodLevel || findPatientTracking.moodLevel,
                                moodLevelOther: req.body.moodLevelOther || findPatientTracking.moodLevelOther,
                                adls: req.body.adls || findPatientTracking.adls,
                                adlsOther: req.body.adlsOther || findPatientTracking.adlsOther,
                                behavioralHealthServices: req.body.behavioralHealthServices || findPatientTracking.behavioralHealthServices,
                                behavioralHealthServicesOther: req.body.behavioralHealthServicesOther || findPatientTracking.behavioralHealthServicesOther,
                                primaryCareProvider: req.body.primaryCareProvider || findPatientTracking.primaryCareProvider,
                                psychiatricProvider: req.body.psychiatricProvider || findPatientTracking.psychiatricProvider,
                                residentGoals: req.body.residentGoals || findPatientTracking.residentGoals,
                                allergies: req.body.allergies || findPatientTracking.allergies,
                                triggers: req.body.triggers || findPatientTracking.triggers,
                                strengths: req.body.strengths || findPatientTracking.strengths,
                                barriers: req.body.barriers || findPatientTracking.barriers,
                                riskAssessment: req.body.riskAssessment || findPatientTracking.riskAssessment,
                                interventions: req.body.interventions || findPatientTracking.interventions,
                                interventionsComment: req.body.interventionsComment || findPatientTracking.interventionsComment,
                                counselingFrequency: req.body.counselingFrequency || findPatientTracking.counselingFrequency,
                                counselingFrequencyMinimum: req.body.counselingFrequencyMinimum || findPatientTracking.counselingFrequencyMinimum,
                                counselingFrequencyComment: req.body.counselingFrequencyComment || findPatientTracking.counselingFrequencyComment,
                                maintainSobriety: req.body.maintainSobriety || findPatientTracking.maintainSobriety,
                                independentLivingSkills: req.body.independentLivingSkills || findPatientTracking.independentLivingSkills,
                                employment: req.body.employment || findPatientTracking.employment,
                                adlsSecond: req.body.adlsSecond || findPatientTracking.adlsSecond,
                                safety: req.body.safety || findPatientTracking.safety,
                                medicationEducation: req.body.medicationEducation || findPatientTracking.medicationEducation,
                                managingMentalHealth: req.body.managingMentalHealth || findPatientTracking.managingMentalHealth,
                                legal: req.body.legal || findPatientTracking.legal,
                                other: req.body.other || findPatientTracking.other,
                                residentParticipation: req.body.residentParticipation || findPatientTracking.residentParticipation,
                                residentAttitude: req.body.residentAttitude || findPatientTracking.residentAttitude,
                                residentProgress: req.body.residentProgress || findPatientTracking.residentProgress,
                                supportSystem: req.body.supportSystem || findPatientTracking.supportSystem,
                                supportSystemPhoneNumber: req.body.supportSystemPhoneNumber || findPatientTracking.supportSystemPhoneNumber,
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
                                residentAgreementIsReason: req.body.residentAgreementIsReason || findPatientTracking.residentAgreementIsReason,
                                residentAgreementRefusalReason: req.body.residentAgreementRefusalReason || findPatientTracking.residentAgreementRefusalReason,
                                signaturesResident: req.body.signaturesResident || findPatientTracking.signaturesResident,
                                signaturesFacilityRep: req.body.signaturesFacilityRep || findPatientTracking.signaturesFacilityRep,
                                signaturesBhp: req.body.signaturesBhp || findPatientTracking.signaturesBhp,
                                saveAsDraft: req.body.saveAsDraft || findPatientTracking.saveAsDraft
                        }
                        let newEmployee = await treatmentPlan.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "ResidentSafety Plan add successfully.", data: newEmployee });
                        }
                } else {
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
                                medicationService: req.body.medicationService,
                                presentingProblems: req.body.presentingProblems,
                                diagonsis: req.body.diagonsis,
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
                                maintainSobriety: req.body.maintainSobriety,
                                independentLivingSkills: req.body.independentLivingSkills,
                                employment: req.body.employment,
                                adlsSecond: req.body.adlsSecond,
                                safety: req.body.safety,
                                medicationEducation: req.body.medicationEducation,
                                managingMentalHealth: req.body.managingMentalHealth,
                                legal: req.body.legal,
                                other: req.body.other,
                                residentParticipation: req.body.residentParticipation,
                                residentAttitude: req.body.residentAttitude,
                                residentProgress: req.body.residentProgress,
                                supportSystem: req.body.supportSystem,
                                supportSystemPhoneNumber: req.body.supportSystemPhoneNumber,
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
                                residentAgreementIsReason: req.body.residentAgreementIsReason,
                                residentAgreementRefusalReason: req.body.residentAgreementRefusalReason,
                                signaturesResident: req.body.signaturesResident,
                                signaturesFacilityRep: req.body.signaturesFacilityRep,
                                signaturesBhp: req.body.signaturesBhp,
                                saveAsDraft: req.body.saveAsDraft
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