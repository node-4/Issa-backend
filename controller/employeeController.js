const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const User = require('../model/userModel');
const AdminTracking = require('../model/adminTracking');
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