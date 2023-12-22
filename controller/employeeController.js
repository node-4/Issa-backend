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
const employeeApplication = require('../model/Employee/employeeApplication');
const employeeEducation = require('../model/Employee/employeeEducation');
const employeeHistory = require('../model/Employee/employeeHistory');
const employeeOtherInfo = require('../model/Employee/employeeOtherInfo');
const employeeSkillAndQualification = require('../model/Employee/employeeSkillAndQualification');
const visitLog = require('../model/GroupNotes/theropyNotes/visitLog');
const mileageLog = require('../model/GroupNotes/theropyNotes/mileageLog');
const staffSchedule = require('../model/GroupNotes/theropyNotes/staffSchedule');
const EmployeeInServiceLog = require('../model/Training/employeeInServiceLog');
const onSiteFacility = require('../model/Training/onSiteFacility');
const skillAndKnowledge = require('../model/Training/skillAndKnowledge');
const bhrfTherapyTopic = require('../model/GroupNotes/NotesLiabrary/bhrfTherapyTopic');
const TherapySession = require('../model/GroupNotes/theropyNotes/therapyNotes');
const timeOffRequest = require('../model/timeOffRequest/timeOffrequest');
const employeePerformanceReview = require('../model/EmployeePerformanceReview/employeePerformanceReview');
const patientTracking = require('../model/Tracking/patientTracking');
const patientVitals = require('../model/patientVitals/patientVitals');
const PrnMedicationLog = require('../model/Medication/employeeMedication/PrnMedicationLog');
const informedConsentForMedication = require('../model/Medication/employeeMedication/informedConsentForMedication');
const medicationOpioidCount = require('../model/Medication/employeeMedication/medicationOpioidCount');
const medicationReconciliation = require('../model/Medication/employeeMedication/medicationReconciliation');

exports.signin = async (req, res) => {
        try {
                const { email, password } = req.body;
                req.body.email = email.split(" ").join("").toLowerCase();
                const user = await User.findOne({ email: req.body.email, userType: "Employee" });
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
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                return res.status(200).send({ status: 200, message: "Profile get successfully.", data: user })
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getPatient = async (req, res) => {
        try {
                const findEmployee = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!findEmployee) {
                        return res.status(403).send({ status: 403, message: "Unauthorized access", data: {} });
                }
                const filters = { userType: "Patient", adminId: findEmployee.adminId };
                const users = await User.find(filters);
                if (users.length === 0) {
                        return res.status(404).send({ status: 404, message: "No Patient found matching the criteria", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Patient fetched successfully.", data: users });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.updateProfile = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
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
                        proffession: req.body.proffession || user.proffession,
                        profilePic: req.body.profilePic,
                }
                let update = await User.findOneAndUpdate({ _id: req.user }, { $set: obj }, { new: true });
                if (update) {
                        return res.status(200).send({ status: 200, message: "Profile get successfully.", data: update })
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addEmployeeApplication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeApplication.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        req.body.employeeId = user._id;
                        let newEmployee = await employeeApplication.create(req.body);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Employee application add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                employeeId: user._id,
                                today: req.body.today || findEmployee.today,
                                hireDate: req.body.hireDate || findEmployee.hireDate,
                                addressNumber: req.body.addressNumber || findEmployee.addressNumber,
                                streetAddress: req.body.streetAddress || findEmployee.streetAddress,
                                cityAddress: req.body.cityAddress || findEmployee.cityAddress,
                                zipCode: req.body.zipCode || findEmployee.zipCode,
                                howLong: req.body.howLong || findEmployee.howLong,
                                primaryPhoneNumber: req.body.primaryPhoneNumber || findEmployee.primaryPhoneNumber,
                                alternativePhoneNumber: req.body.alternativePhoneNumber || findEmployee.alternativePhoneNumber,
                                underAgee18: req.body.underAgee18 || findEmployee.underAgee18,
                                ssn: req.body.ssn || findEmployee.ssn,
                                legallyEligible: req.body.legallyEligible || findEmployee.legallyEligible,
                                desirePosition: req.body.desirePosition || findEmployee.desirePosition,
                                desireSalary: req.body.desireSalary || findEmployee.desireSalary,
                                dateAvailableToStart: req.body.dateAvailableToStart || findEmployee.dateAvailableToStart,
                                hourworkWeekly: req.body.hourworkWeekly || findEmployee.hourworkWeekly,
                                fullTimeOnly: req.body.fullTimeOnly || findEmployee.fullTimeOnly,
                                partTimeOnly: req.body.partTimeOnly || findEmployee.partTimeOnly,
                                fullPartTimeOnly: req.body.fullPartTimeOnly || findEmployee.fullPartTimeOnly,
                                onCall: req.body.onCall || findEmployee.onCall,
                                monday: req.body.monday || findEmployee.monday,
                                tuesday: req.body.tuesday || findEmployee.tuesday,
                                wednesday: req.body.wednesday || findEmployee.wednesday,
                                thursday: req.body.thursday || findEmployee.thursday,
                                friday: req.body.friday || findEmployee.friday,
                                saturday: req.body.saturday || findEmployee.saturday,
                                sunday: req.body.sunday || findEmployee.sunday,
                        }
                        let update = await employeeApplication.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Employee application add successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeApplication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeApplication.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee application not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee application found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeApplicationByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeApplication.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee application not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee application found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addEmployeeEducation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeEducation.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        req.body.employeeId = user._id;
                        let newEmployee = await employeeEducation.create(req.body);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Employee education add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                employeeId: user._id,
                                highSchoolGraduate: req.body.highSchoolGraduate || findEmployee.highSchoolGraduate,
                                highSchoolName: req.body.highSchoolName || findEmployee.highSchoolName,
                                completeAddress: req.body.completeAddress || findEmployee.completeAddress,
                                lastYearCompleted: req.body.lastYearCompleted || findEmployee.lastYearCompleted,
                                collegeGraduate: req.body.collegeGraduate || findEmployee.collegeGraduate,
                                collegeSubject: req.body.collegeSubject || findEmployee.collegeSubject,
                                collegeName: req.body.collegeName || findEmployee.collegeName,
                                collegeAddress: req.body.collegeAddress || findEmployee.collegeAddress,
                                collegeLastYearCompleted: req.body.collegeLastYearCompleted || findEmployee.collegeLastYearCompleted,
                                youTradeGraduate: req.body.youTradeGraduate || findEmployee.youTradeGraduate,
                                tradeSubject: req.body.tradeSubject || findEmployee.tradeSubject,
                                tradeSchoolName: req.body.tradeSchoolName || findEmployee.tradeSchoolName,
                                tradeAddress: req.body.tradeAddress || findEmployee.tradeAddress,
                                tradeLastYearCompleted: req.body.tradeLastYearCompleted || findEmployee.tradeLastYearCompleted,
                                youOtherGraduate: req.body.youOtherGraduate || findEmployee.youOtherGraduate,
                                otherSubject: req.body.otherSubject || findEmployee.otherSubject,
                                otherSchoolName: req.body.otherSchoolName || findEmployee.otherSchoolName,
                                otherAddress: req.body.otherAddress || findEmployee.otherAddress,
                                otherLastYearCompleted: req.body.otherLastYearCompleted || findEmployee.otherLastYearCompleted,
                                subject: req.body.subject || findEmployee.subject,
                                convictedCrime: req.body.convictedCrime || findEmployee.convictedCrime,
                                convictedCrimeExplain: req.body.convictedCrimeExplain || findEmployee.convictedCrimeExplain,
                        }
                        let update = await employeeEducation.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Employee education add successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeEducation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeEducation.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee education not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee education found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeEducationByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeEducation.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee education not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee education found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addEmployeeHistory = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeHistory.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        req.body.employeeId = user._id;
                        let newEmployee = await employeeHistory.create(req.body);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Employee history add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                employeeId: user._id,
                                streetAddress: req.body.streetAddress || findEmployee.streetAddress,
                                city: req.body.city || findEmployee.city,
                                state: req.body.state || findEmployee.state,
                                zipCode: req.body.zipCode || findEmployee.zipCode,
                                phoneNumber: req.body.phoneNumber || findEmployee.phoneNumber,
                                supervisorNameAndTitle: req.body.supervisorNameAndTitle || findEmployee.supervisorNameAndTitle,
                                previousCompany: req.body.previousCompany || findEmployee.previousCompany,
                        }
                        let update = await employeeHistory.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Employee history add successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeHistory = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeHistory.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee history not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee history found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeHistoryByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeHistory.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee history not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee history found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addEmployeeOtherInfo = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeOtherInfo.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        req.body.employeeId = user._id;
                        let newEmployee = await employeeOtherInfo.create(req.body);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Employee OtherInfo add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                employeeId: user._id,
                                militaryExperience: req.body.militaryExperience || findEmployee.militaryExperience,
                                ifYesSpecialty: req.body.ifYesSpecialty || findEmployee.ifYesSpecialty,
                                dateEntered: req.body.dateEntered || findEmployee.dateEntered,
                                dateDischarged: req.body.dateDischarged || findEmployee.dateDischarged,
                                nationalGuard: req.body.nationalGuard || findEmployee.nationalGuard,
                                validLicense: req.body.validLicense || findEmployee.validLicense,
                                driverLicenseNumber: req.body.driverLicenseNumber || findEmployee.driverLicenseNumber,
                                driverLicenseClass: req.body.driverLicenseClass || findEmployee.driverLicenseClass,
                                driverLicenseStatusIssued: req.body.driverLicenseStatusIssued || findEmployee.driverLicenseStatusIssued,
                                typingSkill: req.body.typingSkill || findEmployee.typingSkill,
                                wordsPerMinute: req.body.wordsPerMinute || findEmployee.wordsPerMinute,
                                familiarWithMicrosoft: req.body.familiarWithMicrosoft || findEmployee.familiarWithMicrosoft,
                                otherSkill: req.body.otherSkill || findEmployee.otherSkill,
                                professionalReferences: req.body.professionalReferences || findEmployee.professionalReferences,
                        }
                        let update = await employeeOtherInfo.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Employee OtherInfo add successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeOtherInfo = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeOtherInfo.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee OtherInfo not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee OtherInfo found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeOtherInfoByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeOtherInfo.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee OtherInfo not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee OtherInfo found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addEmployeeSkillAndQualification = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeSkillAndQualification.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        let savedSigned = `${user.firstName} ${user.lastName}`
                        let obj = {
                                employeeId: user._id,
                                companyName: req.body.companyName,
                                skill: req.body.skill,
                                nameOfApplicant: req.body.nameOfApplicant,
                                savedSigned: savedSigned,
                        }
                        let newEmployee = await employeeSkillAndQualification.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Employee Skill And Qualification add successfully.", data: newEmployee });
                        }
                } else {
                        let savedSigned = `${user.firstName} ${user.lastName}`
                        let obj = {
                                employeeId: user._id,
                                companyName: req.body.companyName || findEmployee.companyName,
                                skill: req.body.skill || findEmployee.skill,
                                nameOfApplicant: req.body.nameOfApplicant || findEmployee.nameOfApplicant,
                                savedSigned: savedSigned,
                        }
                        let update = await employeeSkillAndQualification.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Employee Skill And Qualification add successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeSkillAndQualification = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeSkillAndQualification.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee Skill And Qualification not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee Skill And Qualification found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.viewEmployeeSkillAndQualificationByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeeSkillAndQualification.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee Skill And Qualification not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee Skill And Qualification found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createVisitLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        date: req.body.date,
                        visitorName: req.body.visitorName,
                        timeIn: req.body.timeIn,
                        reason: req.body.reason,
                        timeOut: req.body.timeOut,
                }
                let newEmployee = await visitLog.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Visit Log add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllVisitLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await visitLog.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Visit Log not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Visit Log found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllVisitLogByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await visitLog.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Visit Log  not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Visit Log  found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getVisitLogById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await visitLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Visit Log  not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Visit Log  found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateVisitLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await visitLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Visit Log  not found", data: {} });
                } else {
                        let obj = {
                                employeeId: user1.employeeId,
                                date: req.body.date || user1.date,
                                visitorName: req.body.visitorName || user1.visitorName,
                                timeIn: req.body.timeIn || user1.timeIn,
                                reason: req.body.reason || user1.reason,
                                timeOut: req.body.timeOut || user1.timeOut,
                        }
                        let update = await visitLog.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Visit Log update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteVisitLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await visitLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Visit Log  not found", data: {} });
                } else {
                        await visitLog.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Visit Log delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createMileageLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        date: req.body.date,
                        residentInitials: req.body.residentInitials,
                        beginningMileage: req.body.beginningMileage,
                        endingMileage: req.body.endingMileage,
                        totalMileage: req.body.totalMileage,
                        driverSignature: req.body.driverSignature,
                        anyIssues: req.body.anyIssues,
                }
                let newEmployee = await mileageLog.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Mileage Log add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllMileageLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await mileageLog.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Mileage Log not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Mileage Log found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllMileageLogByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await mileageLog.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Mileage Log  not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Mileage Log  found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getMileageLogById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await mileageLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Mileage Log  not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Mileage Log  found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateMileageLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await mileageLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Mileage Log  not found", data: {} });
                } else {
                        let obj = {
                                employeeId: user1.employeeId,
                                date: req.body.date || user1.date,
                                residentInitials: req.body.residentInitials || user1.residentInitials,
                                beginningMileage: req.body.beginningMileage || user1.beginningMileage,
                                endingMileage: req.body.endingMileage || user1.endingMileage,
                                totalMileage: req.body.totalMileage || user1.totalMileage,
                                driverSignature: req.body.driverSignature || user1.driverSignature,
                                anyIssues: req.body.anyIssues || user1.anyIssues,
                        }
                        let update = await mileageLog.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Mileage Log update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteMileageLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await mileageLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Mileage Log  not found", data: {} });
                } else {
                        await mileageLog.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Mileage Log delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addStaffSchedule = async (req, res) => {
        try {
                const user = await User.findById(req.user);
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const findEmployee = await User.findById(req.body.employeeId);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee not found.", data: {} });
                }
                let findStaffSchedule = await staffSchedule.findOne({ employeeId: findEmployee._id, year: req.body.year, month: req.body.month });
                if (findStaffSchedule) {
                        const scheduleWithDays = req.body.schedule.map(scheduleItem => {
                                const date = new Date(req.body.year, req.body.month - 1, scheduleItem.date);
                                const day = date.toLocaleString('en-us', { weekday: 'long' });
                                return { ...scheduleItem, day };
                        });
                        let savedSigned = `${user.firstName} ${user.lastName}`;
                        let obj = {
                                employeeId: findEmployee._id,
                                year: findStaffSchedule.year,
                                month: findStaffSchedule.month,
                                schedule: scheduleWithDays || findStaffSchedule.schedule,
                                administratorAndNumber: req.body.administratorAndNumber || findStaffSchedule.administratorAndNumber,
                                registeredNurseAndNumber: req.body.registeredNurseAndNumber || findStaffSchedule.registeredNurseAndNumber,
                                bhtNameAndNumber: req.body.bhtNameAndNumber || findStaffSchedule.bhtNameAndNumber,
                                savedSigned: savedSigned,
                        };
                        let update = await staffSchedule.findOneAndUpdate({ _id: findStaffSchedule._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Staff Schedule updated successfully.", data: update });
                        }
                } else {
                        const scheduleWithDays = req.body.schedule.map(scheduleItem => {
                                const date = new Date(req.body.year, req.body.month - 1, scheduleItem.date);
                                const day = date.toLocaleString('en-us', { weekday: 'long' });
                                return { ...scheduleItem, day };
                        });
                        let savedSigned = `${user.firstName} ${user.lastName}`;
                        let obj = {
                                employeeId: findEmployee._id,
                                year: req.body.year,
                                month: req.body.month,
                                schedule: scheduleWithDays,
                                administratorAndNumber: req.body.administratorAndNumber,
                                registeredNurseAndNumber: req.body.registeredNurseAndNumber,
                                bhtNameAndNumber: req.body.bhtNameAndNumber,
                                savedSigned: savedSigned,
                        };
                        let newEmployee = await staffSchedule.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Staff Schedule added successfully.", data: newEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getStaffSchedule = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await staffSchedule.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Staff schedule not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Staff schedule found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getStaffScheduleByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await staffSchedule.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Staff schedule  not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Staff schedule  found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createEmployeeInServiceLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let employeeSignature = `${user.firstName} ${user.lastName}`
                let obj = {
                        employeeId: user._id,
                        employeeName: req.body.employeeName,
                        dateOfTraining: req.body.dateOfTraining,
                        trainingSubject: req.body.trainingSubject,
                        hoursOrUnits: req.body.hoursOrUnits,
                        administratorSignature: req.body.administratorSignature,
                        employeeSignature: employeeSignature
                }
                let newEmployee = await EmployeeInServiceLog.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Employee In ServiceLog add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getEmployeeInServiceLogById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await EmployeeInServiceLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "EmployeeInServiceLog not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "EmployeeInServiceLog found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteEmployeeInServiceLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await EmployeeInServiceLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "EmployeeInServiceLog  not found", data: {} });
                } else {
                        await EmployeeInServiceLog.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "EmployeeInServiceLog delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllEmployeeInServiceLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await EmployeeInServiceLog.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "EmployeeInServiceLog not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "EmployeeInServiceLog found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllEmployeeInServiceLogByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await EmployeeInServiceLog.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "EmployeeInServiceLog  not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "EmployeeInServiceLog  found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateEmployeeInServiceLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await EmployeeInServiceLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "EmployeeInServiceLog  not found", data: {} });
                } else {
                        let employeeSignature = `${user.firstName} ${user.lastName}`
                        let obj = {
                                employeeId: user1.employeeId,
                                employeeName: req.body.employeeName || user1.employeeName,
                                dateOfTraining: req.body.dateOfTraining || user1.dateOfTraining,
                                trainingSubject: req.body.trainingSubject || user1.trainingSubject,
                                hoursOrUnits: req.body.hoursOrUnits || user1.hoursOrUnits,
                                administratorSignature: req.body.administratorSignature || user1.administratorSignature,
                                employeeSignature: employeeSignature || user1.employeeSignature,
                        }
                        let update = await EmployeeInServiceLog.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "EmployeeInServiceLog update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createOnSiteFacility = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let employeeSignature = `${user.firstName} ${user.lastName}`
                let obj = {
                        employeeId: user._id,
                        training: req.body.training,
                        description: req.body.description,
                        employeeSignature: req.body.employeeSignature,
                        employeeDate: req.body.employeeDate,
                        trainerSignature: req.body.trainerSignature,
                        trainerDate: req.body.trainerDate,
                        savedSigned: employeeSignature
                }
                let newEmployee = await onSiteFacility.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "OnSite facility add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getOnSiteFacilityById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await onSiteFacility.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "OnSite facility not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "OnSite facility found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteOnSiteFacility = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await onSiteFacility.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "OnSite facility  not found", data: {} });
                } else {
                        await onSiteFacility.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "OnSite facility delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllOnSiteFacility = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await onSiteFacility.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "OnSiteFacility not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "OnSiteFacility found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllOnSiteFacilityByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await onSiteFacility.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "On Site Facility  not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "On Site Facility  found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateOnSiteFacility = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await onSiteFacility.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "OnSiteFacility  not found", data: {} });
                } else {
                        let employeeSignature = `${user.firstName} ${user.lastName}`
                        let obj = {
                                employeeId: user._id,
                                training: req.body.training || user1.training,
                                description: req.body.description || user1.description,
                                employeeSignature: req.body.employeeSignature || user1.employeeSignature,
                                employeeDate: req.body.employeeDate || user1.employeeDate,
                                trainerSignature: req.body.trainerSignature || user1.trainerSignature,
                                trainerDate: req.body.trainerDate || user1.trainerDate,
                                savedSigned: employeeSignature || user1.employeeSignature,
                        }
                        let update = await onSiteFacility.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "OnSiteFacility update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createSkillAndKnowledge = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let employeeSignature = `${user.firstName} ${user.lastName}`
                let obj = {
                        employeeId: user._id,
                        employeeName: user.firstName,
                        hoursCompleted: req.body.hoursCompleted,
                        companyName: req.body.companyName,
                        selectedTrainingTopics: req.body.selectedTrainingTopics,
                        verificationMethod: req.body.verificationMethod,
                        employeeSignature: employeeSignature,
                        employeeTitle: req.body.employeeTitle,
                        employeeDate: req.body.employeeDate,
                        verifiedBySignature: req.body.verifiedBySignature,
                        verifiedByTitle: req.body.verifiedByTitle,
                        verifiedByDate: req.body.verifiedByDate,
                }
                let newEmployee = await skillAndKnowledge.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Skill and knowledge add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getSkillAndKnowledgeById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await skillAndKnowledge.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Skill and knowledge not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Skill and knowledge found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteSkillAndKnowledge = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await skillAndKnowledge.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Skill and knowledge  not found", data: {} });
                } else {
                        await skillAndKnowledge.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Skill and knowledge delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllSkillAndKnowledge = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await skillAndKnowledge.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Skill and knowledge not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Skill and knowledge found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllSkillAndKnowledgeByEmployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await skillAndKnowledge.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "SkillAndKnowledge  not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "SkillAndKnowledge  found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateSkillAndKnowledge = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await skillAndKnowledge.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Skill and knowledge  not found", data: {} });
                } else {
                        let employeeSignature = `${user.firstName} ${user.lastName}`
                        let obj = {
                                employeeId: user._id,
                                employeeName: user.firstName,
                                hoursCompleted: req.body.hoursCompleted || user1.hoursCompleted,
                                companyName: req.body.companyName || user1.companyName,
                                selectedTrainingTopics: req.body.selectedTrainingTopics || user1.selectedTrainingTopics,
                                verificationMethod: req.body.verificationMethod || user1.verificationMethod,
                                employeeSignature: employeeSignature || user1.employeeSignature,
                                employeeTitle: req.body.employeeTitle || user1.employeeTitle,
                                employeeDate: req.body.employeeDate || user1.employeeDate,
                                verifiedBySignature: req.body.verifiedBySignature || user1.verifiedBySignature,
                                verifiedByTitle: req.body.verifiedByTitle || user1.verifiedByTitle,
                                verifiedByDate: req.body.verifiedByDate || user1.verifiedByDate,
                        }
                        let update = await skillAndKnowledge.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Skill and knowledge update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllBhrfTherapyTopic = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const filteredTasks = await bhrfTherapyTopic.find({ $or: [{ adminId: user.adminId }], addBy: "superAdmin" }).sort({ createdAt: -1 });
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No bhrfTherapy Topic found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "BhrfTherapy Topic found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createTherapySession = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let data = []
                let employeeSignature = `${user.firstName} ${user.lastName}`
                for (let i = 0; i < req.body.residentId.length; i++) {
                        let obj = {
                                employeeId: user._id,
                                date: req.body.date,
                                startTime: req.body.startTime,
                                endTime: req.body.endTime,
                                totalDuration: req.body.totalDuration,
                                behaviorTech: req.body.behaviorTech,
                                location: req.body.location,
                                topic: req.body.topicId,
                                residentId: req.body.residentId[i],
                                residentCompletedSession: req.body.residentCompletedSession,
                                attitude: req.body.attitude,
                                treatmentGoalsAddressed: req.body.treatmentGoalsAddressed,
                                residentParticipation: req.body.residentParticipation,
                                residentQuality: req.body.residentQuality,
                                significantInfoNotSpecifiedAbove: req.body.significantInfoNotSpecifiedAbove,
                                residentAppearance: req.body.residentAppearance,
                                residentMood: req.body.residentMood,
                                residentProgress: req.body.residentProgress,
                                pleaseSpecify: req.body.pleaseSpecify,
                                residentResponse: req.body.residentResponse,
                                significantInfoNotSpecifiedAbove1: req.body.significantInfoNotSpecifiedAbove1,
                                pleaseSpecify1: req.body.pleaseSpecify1,
                                date: req.body.date,
                                behavioralHealthProfessionalName: user.firstName,
                                behavioralHealthProfessionalSignature: employeeSignature,
                                behavioralTechnicianName: user.firstName,
                                behavioralTechnicianSignature: employeeSignature,
                        }
                        let newEmployee = await TherapySession.create(obj);
                        data.push(newEmployee)
                }
                return res.status(200).send({ status: 200, message: "TherapySession add successfully.", data: date });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getTherapySessionById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await TherapySession.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "TherapySession not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "TherapySession found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteTherapySession = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await TherapySession.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Therapy Session  not found", data: {} });
                } else {
                        await TherapySession.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Therapy Session delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllTherapySession = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await TherapySession.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Therapy session not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Therapy session found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllTherapySessionByemployeeId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await TherapySession.findOne({ employeeId: req.params.employeeId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "TherapySession  not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "TherapySession  found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllTherapySessionForResident = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await TherapySession.findOne({ residentId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Therapy session not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Therapy session found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createTimeOffRequest = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let employeeSignature = `${user.firstName} ${user.lastName}`
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
                        beginDate: req.body.beginDate,
                        endDate: req.body.endDate,
                        normalShift: req.body.normalShift,
                        unPaidHrLeft: req.body.unPaidHrLeft,
                        vacationPersonTimeUsed: req.body.vacationPersonTimeUsed,
                        sickTimeUsed: req.body.sickTimeUsed,
                        notes: req.body.notes,
                        signature: employeeSignature,
                        requestType: req.body.requestType,
                }
                let newEmployee = await timeOffRequest.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Time Off Request add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getTimeOffRequestById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await timeOffRequest.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Time off request not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Time off request found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteTimeOffRequest = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await timeOffRequest.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Time Off Request  not found", data: {} });
                } else {
                        await timeOffRequest.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Time Off Request delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllTimeOffRequest = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await timeOffRequest.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Time Off Request not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Time Off Request found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createEmployeePerformanceReview = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let employeeSignature = `${user.firstName} ${user.lastName}`
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
                        name: req.body.name,
                        employeeDate: req.body.employeeDate,
                        employeeJobTitle: req.body.employeeJobTitle,
                        employeeManager: req.body.employeeManager,
                        typeOfReview: req.body.typeOfReview,
                        employeeHireDate: req.body.employeeHireDate,
                        ratingsPerformanceAndQualityOfWork: req.body.ratingsPerformanceAndQualityOfWork,
                        ratingsCommunication: req.body.ratingsCommunication,
                        ratingsProfessionalism: req.body.ratingsProfessionalism,
                        ratingsAttendanceAndPunctuality: req.body.ratingsAttendanceAndPunctuality,
                        ratingsTimeManagement: req.body.ratingsTimeManagement,
                        ratingsReliabilityDependability: req.body.ratingsReliabilityDependability,
                        overallRating: req.body.overallRating,
                        evaluation: req.body.evaluation,
                        additionalComments: req.body.additionalComments,
                        employeeName: req.body.employeeName,
                        employeeSignature: employeeSignature,
                        employeeDate: req.body.employeeDate,
                }
                let newEmployee = await employeePerformanceReview.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Employee performance Review add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getEmployeePerformanceReviewById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await employeePerformanceReview.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Employee performance Review not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee performance Review found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteEmployeePerformanceReview = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await employeePerformanceReview.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Employee performance Review  not found", data: {} });
                } else {
                        await employeePerformanceReview.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Employee performance Review delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllEmployeePerformanceReview = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeePerformanceReview.findOne({ employeeId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Employee performance Review not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee performance Review found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createPatientTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await patientTracking.findOne({ patientId: user1._id });
                if (findPatientTracking) {
                        let obj = {
                                employeeId: user._id,
                                patientId: user1._id,
                                adminId: user.adminId,
                                tbTest: req.body.tbTest || findPatientTracking.tbTest,
                                tbTestDate: req.body.tbTestDate || findPatientTracking.tbTestDate,
                                tbTestExpire: req.body.tbTestExpire || findPatientTracking.tbTestExpire,
                                expireDate: req.body.expireDate || findPatientTracking.expireDate,
                                initialAssessment: req.body.initialAssessment || findPatientTracking.initialAssessment,
                                nursingAssessment: req.body.nursingAssessment || findPatientTracking.nursingAssessment,
                                treatmentPlanReviewDate: req.body.treatmentPlanReviewDate || findPatientTracking.treatmentPlanReviewDate,
                                treatmentPlanTestDate: req.body.treatmentPlanTestDate || findPatientTracking.treatmentPlanTestDate,
                                treatmentPlanTestExpire: req.body.treatmentPlanTestExpire || findPatientTracking.treatmentPlanTestExpire,
                                treatmentPlanExpireDate: req.body.treatmentPlanExpireDate || findPatientTracking.treatmentPlanExpireDate,
                                staffing: req.body.staffing || findPatientTracking.staffing,
                                fluShot: req.body.fluShot || findPatientTracking.fluShot,
                                otherTestDate: req.body.otherTestDate || findPatientTracking.otherTestDate,
                                otherTestExpire: req.body.otherTestExpire || findPatientTracking.otherTestExpire,
                                otherExpireDate: req.body.otherExpireDate || findPatientTracking.otherExpireDate,
                                timeOffRequestApproved: req.body.timeOffRequestApproved || findPatientTracking.timeOffRequestApproved,
                                note: req.body.note || findPatientTracking.note,
                                signature: req.body.signature || findPatientTracking.signature,
                                additionalDocument: req.body.additionalDocument || findPatientTracking.additionalDocument,
                        }
                        let newEmployee = await patientTracking.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Patient Tracking add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                employeeId: user._id,
                                patientId: user1._id,
                                adminId: user.adminId,
                                tbTest: req.body.tbTest,
                                tbTestDate: req.body.tbTestDate,
                                tbTestExpire: req.body.tbTestExpire,
                                expireDate: req.body.expireDate,
                                initialAssessment: req.body.initialAssessment,
                                nursingAssessment: req.body.nursingAssessment,
                                treatmentPlanReviewDate: req.body.treatmentPlanReviewDate,
                                treatmentPlanTestDate: req.body.treatmentPlanTestDate,
                                treatmentPlanTestExpire: req.body.treatmentPlanTestExpire,
                                treatmentPlanExpireDate: req.body.treatmentPlanExpireDate,
                                staffing: req.body.staffing,
                                fluShot: req.body.fluShot,
                                otherTestDate: req.body.otherTestDate,
                                otherTestExpire: req.body.otherTestExpire,
                                otherExpireDate: req.body.otherExpireDate,
                                timeOffRequestApproved: req.body.timeOffRequestApproved,
                                note: req.body.note,
                                signature: req.body.signature,
                                additionalDocument: req.body.additionalDocument,
                        }
                        let newEmployee = await patientTracking.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Patient Tracking add successfully.", data: newEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getPatientTrackingById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await patientTracking.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient tracking not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Patient tracking found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllPatientTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await patientTracking.findOne({ employeeId: user._id, patientId: req.params.patientId });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Patient tracking not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Patient tracking found.", data: findEmployee });
                }
        } catch (error) {
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createPatientVitals = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findPatientTracking = await patientVitals.findOne({ patientId: user1._id, exDate: req.body.date });
                if (findPatientTracking) {
                        let obj = {
                                employeeId: user._id,
                                patientId: user1._id,
                                adminId: user.adminId,
                                exDate: req.body.date || findPatientTracking.exDate,
                                date: req.body.date || findPatientTracking.date,
                                bodyTemperature: req.body.bodyTemperature || findPatientTracking.bodyTemperature,
                                pulseRate: req.body.pulseRate || findPatientTracking.pulseRate,
                                respirationRate: req.body.respirationRate || findPatientTracking.respirationRate,
                                bloodPressure: req.body.bloodPressure || findPatientTracking.bloodPressure,
                                bloodOxygen: req.body.bloodOxygen || findPatientTracking.bloodOxygen,
                                weight: req.body.weight || findPatientTracking.weight,
                                bloodGlucoseLevel: req.body.bloodGlucoseLevel || findPatientTracking.bloodGlucoseLevel,
                                height: req.body.height || findPatientTracking.height,
                        }
                        let newEmployee = await patientVitals.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Patient Vitals add successfully.", data: newEmployee });
                        }
                } else {
                        let obj = {
                                employeeId: user._id,
                                patientId: user1._id,
                                adminId: user.adminId,
                                exDate: req.body.date,
                                date: req.body.date,
                                bodyTemperature: req.body.bodyTemperature,
                                pulseRate: req.body.pulseRate,
                                respirationRate: req.body.respirationRate,
                                bloodPressure: req.body.bloodPressure,
                                bloodOxygen: req.body.bloodOxygen,
                                weight: req.body.weight,
                                bloodGlucoseLevel: req.body.bloodGlucoseLevel,
                                height: req.body.height,
                        }
                        let newEmployee = await patientVitals.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Patient Vitals add successfully.", data: newEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getPatientVitalsByPatientId = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found! Not registered", data: {} });
                }
                const user2 = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user2) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let filter = { patientId: user2._id };
                if (req.query.for == 'today') {
                        const todayStart = new Date();
                        todayStart.setHours(0, 0, 0, 0);
                        filter.date = { $gte: todayStart };
                } else if (req.query.for == 'week') {
                        const lastWeekStart = new Date();
                        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
                        lastWeekStart.setHours(0, 0, 0, 0);
                        filter.date = { $gte: lastWeekStart };
                } else if (req.query.for == 'month') {
                        const firstDayOfMonth = new Date();
                        firstDayOfMonth.setDate(1);
                        firstDayOfMonth.setHours(0, 0, 0, 0);
                        filter.date = { $gte: firstDayOfMonth };
                }
                const user1 = await patientVitals.find(filter);
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient tracking not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Patient tracking found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
exports.createPrnMedicationLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
                        patientId: user1._id,
                        residentName: user1.firstName,
                        medicationAndStrength: req.body.medicationAndStrength,
                        instructions: req.body.instructions,
                        prescriberName: req.body.prescriberName,
                        site: req.body.site,
                        tableData: req.body.tableData,
                        staff: req.body.staff,
                }
                let newEmployee = await PrnMedicationLog.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Prn Medication Log add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getPrnMedicationLogById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await PrnMedicationLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Prn Medication Log not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Prn Medication Log found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editPrnMedicationLogById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await PrnMedicationLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Prn Medication Log not found", data: {} });
                } else {
                        let patientId, residentName;
                        if (req.body.patientId != (null || undefined)) {
                                const user2 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                                if (!user2) {
                                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                                }
                                patientId = user2._id;
                                residentName = user2.firstName;
                        } else {
                                patientId = user1.patientId;
                                residentName = user1.firstName;
                        }
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                patientId: patientId,
                                residentName: residentName,
                                medicationAndStrength: req.body.medicationAndStrength || user1.medicationAndStrength,
                                instructions: req.body.instructions || user1.instructions,
                                prescriberName: req.body.prescriberName || user1.prescriberName,
                                site: req.body.site || user1.site,
                                tableData: req.body.tableData || user1.tableData,
                                staff: req.body.staff || user1.staff,
                        }
                        let update = await PrnMedicationLog.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Prn Medication Log update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deletePrnMedicationLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await PrnMedicationLog.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Prn Medication Log  not found", data: {} });
                } else {
                        await PrnMedicationLog.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Prn Medication Log delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllPrnMedicationLog = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter;
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient" });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter = { patientId: user2._id, employeeId: user._id };
                }
                filter = { employeeId: user._id };
                let findEmployee = await PrnMedicationLog.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Prn Medication Log not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Prn Medication Log found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createInformedConsentForMedication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
                        patientId: user1._id,
                        name: user1.firstName,
                        dateOfBirth: user1.dateOfBirth,
                        admitDate: req.body.admitDate,
                        tableDate: req.body.tableDate,
                        staff: req.body.staff,
                        residentGuardianSignature: req.body.residentGuardianSignature
                }
                let newEmployee = await informedConsentForMedication.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Informed Consent For Medication add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getInformedConsentForMedicationById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await informedConsentForMedication.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Informed Consent For Medication not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Informed Consent For Medication found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editInformedConsentForMedicationById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await informedConsentForMedication.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Informed Consent For Medication not found", data: {} });
                } else {
                        let patientId, residentName, dateOfBirth;
                        if (req.body.patientId != (null || undefined)) {
                                const user2 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                                if (!user2) {
                                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                                }
                                patientId = user2._id;
                                residentName = user2.firstName;
                                dateOfBirth = user2.dateOfBirth
                        } else {
                                patientId = user1.patientId;
                                residentName = user1.residentName;
                                dateOfBirth = user1.dateOfBirth
                        }
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                patientId: patientId,
                                name: residentName,
                                dateOfBirth: dateOfBirth,
                                admitDate: req.body.admitDate || user1.admitDate,
                                tableDate: req.body.tableDate || user1.tableDate,
                                staff: req.body.staff || user1.staff,
                                residentGuardianSignature: req.body.residentGuardianSignature || user1.residentGuardianSignature
                        }
                        let update = await informedConsentForMedication.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Informed Consent For Medication update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteInformedConsentForMedication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await informedConsentForMedication.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Informed Consent For Medication  not found", data: {} });
                } else {
                        await informedConsentForMedication.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Informed Consent For Medication delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllInformedConsentForMedication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter;
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient" });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter = { patientId: user2._id, employeeId: user._id };
                }
                filter = { employeeId: user._id };
                let findEmployee = await informedConsentForMedication.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Informed Consent For Medication not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Informed Consent For Medication found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createMedicationOpioidCount = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
                        patientId: user1._id,
                        location: req.body.location,
                        medicationName: req.body.medicationName,
                        dose: req.body.dose,
                        prescriptionInstruction: req.body.prescriptionInstruction,
                        prescribingProvider: req.body.prescribingProvider,
                        beginningMedCount: req.body.beginningMedCount,
                        monthYear: req.body.monthYear,
                        data: req.body.data,
                        staff: req.body.staff,
                        countType: req.body.countType
                }
                let newEmployee = await medicationOpioidCount.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Medication Opioid Count add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getMedicationOpioidCountById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await medicationOpioidCount.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication Opioid Count not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Medication Opioid Count found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editMedicationOpioidCountById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await medicationOpioidCount.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication Opioid Count not found", data: {} });
                } else {
                        let patientId;
                        if (req.body.patientId != (null || undefined)) {
                                const user2 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                                if (!user2) {
                                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                                }
                                patientId = user2._id;
                        } else {
                                patientId = user1.patientId;
                        }
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                patientId: patientId,
                                location: req.body.location || user1.location,
                                medicationName: req.body.medicationName || user1.medicationName,
                                dose: req.body.dose || user1.dose,
                                prescriptionInstruction: req.body.prescriptionInstruction || user1.prescriptionInstruction,
                                prescribingProvider: req.body.prescribingProvider || user1.prescribingProvider,
                                beginningMedCount: req.body.beginningMedCount || user1.beginningMedCount,
                                monthYear: req.body.monthYear || user1.monthYear,
                                data: req.body.data || user1.data,
                                staff: req.body.staff || user1.staff,
                                countType: req.body.countType || user1.countType,
                        }
                        let update = await medicationOpioidCount.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Medication Opioid Count update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteMedicationOpioidCount = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await medicationOpioidCount.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication Opioid Count  not found", data: {} });
                } else {
                        await medicationOpioidCount.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Medication Opioid Count delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllMedicationOpioidCount = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter;
                if (req.query.countType != (null || undefined)) {
                        filter = { countType: req.query.countType, employeeId: user._id };
                } else {
                        filter = { employeeId: user._id };
                }
                let findEmployee = await medicationOpioidCount.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Medication Opioid Count not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Medication Opioid Count found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createMedicationReconciliation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
                        patientId: user1._id,
                        residentName: req.body.residentName,
                        allergiesAndReactions: req.body.allergiesAndReactions,
                        medications: req.body.medications,
                        providerName: req.body.providerName,
                        data: req.body.data,
                        providerSignature: req.body.providerSignature
                }
                let newEmployee = await medicationReconciliation.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Medication Reconciliation add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getMedicationReconciliationById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await medicationReconciliation.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication Reconciliation not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Medication Reconciliation found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editMedicationReconciliationById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await medicationReconciliation.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication Reconciliation not found", data: {} });
                } else {
                        let patientId;
                        if (req.body.patientId != (null || undefined)) {
                                const user2 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                                if (!user2) {
                                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                                }
                                patientId = user2._id;
                        } else {
                                patientId = user1.patientId;
                        }
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                patientId: patientId,
                                residentName: req.body.residentName || user1.residentName,
                                allergiesAndReactions: req.body.allergiesAndReactions || user1.allergiesAndReactions,
                                medications: req.body.medications || user1.medications,
                                providerName: req.body.providerName || user1.providerName,
                                data: req.body.data || user1.data,
                                providerSignature: req.body.providerSignature || user1.providerSignature,
                        }
                        let update = await medicationReconciliation.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Medication Reconciliation update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteMedicationReconciliation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await medicationReconciliation.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication Reconciliation  not found", data: {} });
                } else {
                        await medicationReconciliation.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Medication Reconciliation delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllMedicationReconciliation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                filter.employeeId = user._id;
                if (req.query.patientId != (null || undefined)) {
                        filter.patientId = req.query.patientId;
                }
                if (req.query.allergiesAndReactions != (null || undefined)) {
                        filter.allergiesAndReactions = req.query.allergiesAndReactions;
                }
                let findEmployee = await medicationReconciliation.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Medication Reconciliation not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Medication Reconciliation found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};