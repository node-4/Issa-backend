const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const User = require('../model/userModel');
const AdminTracking = require('../model/Tracking/adminTracking');
const admitDetail = require('../model/admitDetail');
const task = require('../model/task');
const appointment = require('../model/appointment');
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
const employeeTracking = require('../model/Tracking/employeeTracking');
const patientVitals = require('../model/patientVitals/patientVitals');
const PrnMedicationLog = require('../model/Medication/employeeMedication/PrnMedicationLog');
const informedConsentForMedication = require('../model/Medication/employeeMedication/informedConsentForMedication');
const mars = require('../model/Medication/employeeMedication/mars');
const MarsMedications = require('../model/Medication/employeeMedication/MarsMedications');
const medicationOpioidCount = require('../model/Medication/employeeMedication/medicationOpioidCount');
const medicationReconciliation = require('../model/Medication/employeeMedication/medicationReconciliation');
const ADLTrackingForm = require('../model/patientChart/ADLTrackingForm');
const dischargeSummary = require('../model/patientChart/DischargeSummary');
const financialTransactionsRecord = require('../model/patientChart/financialTransactionsRecord');
const progressNote = require('../model/patientChart/progressNote');
const staffingNote = require('../model/patientChart/StaffingNote');
const authorizationForReleaseOfInformation = require('../model/patientChart/authorizationForReleaseOfInformation');
const contactNote = require('../model/patientChart/contactNote');
const uploadAnyWordOrPdfDocument = require('../model/patientChart/uploadAnyWordOrPdfDocument');
const patientMedication = require('../model/Medication/patientMedication/patientMedication');
const medicationEmployee = require('../model/Medication/employeeMedication/medicationEmployee');
const forms2023 = require('../model/EmployeeInformation/2023Forms');
const appendix = require('../model/EmployeeInformation/appendix');
const apsConsent = require('../model/EmployeeInformation/apsConsent');
const fw4 = require('../model/EmployeeInformation/fw4');
const fw9 = require('../model/EmployeeInformation/fw9');
const i9 = require('../model/EmployeeInformation/i9');
const jobDescription = require('../model/EmployeeInformation/jobDescription');
const lrc1031A = require('../model/EmployeeInformation/lrc1031A');
const offerLetter = require('../model/EmployeeInformation/offerLetter');
const personalInformation = require('../model/EmployeeInformation/personalInformation');
const referenceCheck = require('../model/EmployeeInformation/referenceCheck');
const termination = require('../model/EmployeeInformation/termination');
const notification = require('../model/notification');
const timeSheet = require('../model/GroupNotes/theropyNotes/timeSheet');
const timeWorkSheet = require('../model/GroupNotes/theropyNotes/timeWorkSheet');
const attendanceModel = require('../model/attendance');
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
exports.forgetPassword = async (req, res) => {
        try {
                const data = await User.findOne({ email: req.body.email });
                if (!data) {
                        return res.status(400).send({ status: 400, data: {}, msg: "Please use same email id as signup!" });
                } else {
                        let otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                        // var transporter = nodemailer.createTransport({ service: 'gmail', auth: { "user": "info@shahinahoja.com", "pass": "gganlypsemwqhwlh" } });
                        // // var transporter = nodemailer.createTransport({ service: 'gmail', auth: { "user": "vcjagal1994@gmail.com", "pass": "kjoayiyibyjfwxbo" } });
                        // let mailOptions;
                        // mailOptions = {
                        //         from: 'info@shahinahoja.com',
                        //         to: req.body.email,
                        //         subject: 'Forget password verification',
                        //         text: `Your Account Verification Code is ${otp}`,
                        // };
                        // let info = await transporter.sendMail(mailOptions);
                        // if (info) {
                        let accountVerification = false;
                        let otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                        const updated = await User.findOneAndUpdate({ _id: data._id }, { $set: { isVerified: accountVerification, otp: otp, otpExpiration: otpExpiration } }, { new: true, });
                        if (updated) {
                                return res.status(200).json({ message: "Otp send to your email.", status: 200, data: updated });
                        }
                        // } else {
                        //         return res.status(200).json({ message: "Otp not send on your mail please check.", status: 200, data: {} });
                        // }
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.forgotVerifyotp = async (req, res) => {
        try {
                const { otp } = req.body;
                const user = await User.findOne({ email: req.body.email });
                if (!user) {
                        return res.status(404).send({ message: "user not found" });
                }
                if (user.otp !== otp || user.otpExpiration < Date.now()) {
                        return res.status(400).json({ message: "Invalid OTP" });
                }
                const updated = await User.findByIdAndUpdate({ _id: user._id }, { isVerified: true }, { new: true });
                let obj = { userId: updated._id, otp: updated.otp, }
                return res.status(200).send({ status: 200, message: "Verify otp successfully", data: obj });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ error: "internal server error" + err.message });
        }
};
exports.changePassword = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.id });
                if (user) {
                        if (req.body.newPassword == req.body.confirmPassword) {
                                const updated = await User.findOneAndUpdate({ _id: user._id }, { $set: { password: bcrypt.hashSync(req.body.newPassword), accountVerification: true } }, { new: true });
                                return res.status(200).send({ message: "Password update successfully.", data: updated, });
                        } else {
                                return res.status(501).send({ message: "Password Not matched.", data: {}, });
                        }
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPatient = async (req, res) => {
        try {
                const findEmployee = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!findEmployee) {
                        return res.status(403).json({ status: 403, message: "Unauthorized access", data: {} });
                }
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;
                const searchQuery = req.query.search || '';
                const query = { userType: "Patient", employeesId: { $in: [findEmployee._id.toString()] }, };
                if (searchQuery) {
                        query.$or = [
                                { name: { $regex: new RegExp(searchQuery, 'i') } },
                        ];
                }
                const findPatients = await User.find(query).skip(skip).limit(limit);
                if (findPatients.length === 0) {
                        return res.status(404).json({ status: 404, message: "No patients found matching the criteria", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "Patients fetched successfully.", data: findPatients, page: page, limit: limit, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getPatientById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found ! not registered", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Patient fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
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
                if (req.body.dateOfBirth) {
                        const age = calculateAge(req.body.dateOfBirth);
                        req.body.age = age;
                }
                function calculateAge(dateOfBirth) {
                        const dob = new Date(dateOfBirth);
                        const currentDate = new Date();
                        let age = currentDate.getFullYear() - dob.getFullYear();
                        if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
                                age--;
                        }
                        return age;
                }
                let obj = {
                        fullName: req.body.fullName || user.fullName,
                        email: req.body.email || user.email,
                        mobileNumber: req.body.mobileNumber || user.mobileNumber,
                        gender: req.body.gender || user.gender,
                        address: req.body.address || user.address,
                        proffession: req.body.proffession || user.proffession,
                        profilePic: req.body.profilePic,
                        dateOfBirth: req.body.dateOfBirth,
                        age: req.body.age
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
                                firstName: req.body.firstName || findEmployee.firstName,
                                lastName: req.body.lastName || findEmployee.lastName,
                                middle: req.body.middle || findEmployee.middle,
                                maiden: req.body.maiden || findEmployee.maiden,
                                today: req.body.today || findEmployee.today,
                                hireDate: req.body.hireDate || findEmployee.hireDate,
                                addressNumber: req.body.addressNumber || findEmployee.addressNumber,
                                streetAddress: req.body.streetAddress || findEmployee.streetAddress,
                                cityAddress: req.body.cityAddress || findEmployee.cityAddress,
                                stateAddress: req.body.stateAddress || findEmployee.stateAddress,
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
                                employeeName: req.body.employeeName || findEmployee.employeeName,
                                streetAddress: req.body.streetAddress || findEmployee.streetAddress,
                                city: req.body.city || findEmployee.city,
                                state: req.body.state || findEmployee.state,
                                zipCode: req.body.zipCode || findEmployee.zipCode,
                                phoneNumber: req.body.phoneNumber || findEmployee.phoneNumber,
                                supervisorNameAndTitle: req.body.supervisorNameAndTitle || findEmployee.supervisorNameAndTitle,
                                to: req.body.to || findEmployee.to,
                                from: req.body.from || findEmployee.from,
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
                                ifSpecialty: req.body.ifSpecialty || findEmployee.ifSpecialty,
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
                let findEmployee = await visitLog.find({ employeeId: user._id });
                if (findEmployee.length == 0) {
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
                let findEmployee = await mileageLog.find({ employeeId: user._id });
                if (findEmployee.length == 0) {
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
                                adminId: user._id,
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
                                adminId: user._id,
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
                        return res.status(404).json({ status: 404, message: "User not found! Not registered", data: {} });
                }
                let filter = { adminId: user._id };
                if (req.query.employeeId != (null || undefined)) {
                        filter = { employeeId: req.query.employeeId };
                }
                const year = req.query.year || moment().format('YYYY');
                const month = req.query.month || moment().format('MM');
                filter.year = year;
                filter.month = month;
                let findEmployee = await staffSchedule.findOne(filter);
                if (!findEmployee) {
                        return res.status(404).json({ status: 404, message: "Staff schedule not found.", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "Staff schedule found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: "Server error" + error.message });
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
                let findEmployee = await EmployeeInServiceLog.find({ employeeId: user._id });
                if (findEmployee.length == 0) {
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
                let findEmployee = await onSiteFacility.find({ employeeId: user._id });
                if (findEmployee.length == 0) {
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
                let findEmployee = await skillAndKnowledge.find({ employeeId: user._id });
                if (findEmployee.length == 0) {
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
                let filter;
                if (req.params.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.params.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter = { patientId: user2._id };
                }
                let findEmployee = await patientTracking.findOne(filter);
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
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter = { patientId: user2._id };
                }
                let findEmployee = await PrnMedicationLog.find(filter).populate('employeeId adminId patientId');
                if (findEmployee.length == 0) {
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
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter = { patientId: user2._id };
                }
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
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
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
exports.createProgressNote = async (req, res) => {
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
                        dateOfBirth: req.body.dateOfBirth,
                        admitDate: req.body.admitDate,
                        date: req.body.date,
                        shift: req.body.shift,
                        medicationAdministrationCompleted: req.body.medicationAdministrationCompleted,
                        assistanceInMedicationAdministrationCompleted: req.body.assistanceInMedicationAdministrationCompleted,
                        healthAndWelfareChecksCompleted: req.body.healthAndWelfareChecksCompleted,
                        communityLivingSupport: req.body.communityLivingSupport,
                        groupTherapy: req.body.groupTherapy,
                        individualTherapy: req.body.individualTherapy,
                        refusedTherapy: req.body.refusedTherapy,
                        isolation: req.body.isolation,
                        anxious: req.body.anxious,
                        depressed: req.body.depressed,
                        excited: req.body.excited,
                        respondingToInternalStimuli: req.body.respondingToInternalStimuli,
                        inappropriateSexualComment: req.body.inappropriateSexualComment,
                        paranoia: req.body.paranoia,
                        verballyAggressive: req.body.verballyAggressive,
                        physicallyAggressive: req.body.physicallyAggressive,
                        agitated: req.body.agitated,
                        suicidalIdeation: req.body.suicidalIdeation,
                        PCP: req.body.PCP,
                        psychiatric: req.body.psychiatric,
                        otherSpecialist: req.body.otherSpecialist,
                        none: req.body.none,
                        emergencyRoomVisit: req.body.emergencyRoomVisit,
                        inpatient: req.body.inpatient,
                        urgentCare: req.body.urgentCare,
                        communityOutings: req.body.communityOutings,
                        religiousService: req.body.religiousService,
                        adlsCompleted: req.body.adlsCompleted,
                        mealPreparation: req.body.mealPreparation,
                        transportation: req.body.transportation,
                        residentRedirectedOnBehaviors: req.body.residentRedirectedOnBehaviors,
                        awolElopement: req.body.awolElopement,
                        noteSummary: req.body.noteSummary,
                        bhtName: req.body.bhtName,
                        bhtSignature: req.body.bhtSignature,
                };
                let newEmployee = await progressNote.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Progress note add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getProgressNoteById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await progressNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Progress note not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Progress note found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editProgressNoteById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await progressNote.findOne({ _id: req.params.id });
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
                                dateOfBirth: req.body.dateOfBirth || user1.dateOfBirth,
                                admitDate: req.body.admitDate || user1.admitDate,
                                date: req.body.date || user1.date,
                                shift: req.body.shift || user1.shift,
                                medicationAdministrationCompleted: req.body.medicationAdministrationCompleted || user1.medicationAdministrationCompleted,
                                assistanceInMedicationAdministrationCompleted: req.body.assistanceInMedicationAdministrationCompleted || user1.assistanceInMedicationAdministrationCompleted,
                                healthAndWelfareChecksCompleted: req.body.healthAndWelfareChecksCompleted || user1.healthAndWelfareChecksCompleted,
                                communityLivingSupport: req.body.communityLivingSupport || user1.communityLivingSupport,
                                groupTherapy: req.body.groupTherapy || user1.groupTherapy,
                                individualTherapy: req.body.individualTherapy || user1.individualTherapy,
                                refusedTherapy: req.body.refusedTherapy || user1.refusedTherapy,
                                isolation: req.body.isolation || user1.isolation,
                                anxious: req.body.anxious || user1.anxious,
                                depressed: req.body.depressed || user1.depressed,
                                excited: req.body.excited || user1.excited,
                                respondingToInternalStimuli: req.body.respondingToInternalStimuli || user1.respondingToInternalStimuli,
                                inappropriateSexualComment: req.body.inappropriateSexualComment || user1.inappropriateSexualComment,
                                paranoia: req.body.paranoia || user1.paranoia,
                                verballyAggressive: req.body.verballyAggressive || user1.verballyAggressive,
                                physicallyAggressive: req.body.physicallyAggressive || user1.physicallyAggressive,
                                agitated: req.body.agitated || user1.agitated,
                                suicidalIdeation: req.body.suicidalIdeation || user1.suicidalIdeation,
                                PCP: req.body.PCP || user1.PCP,
                                psychiatric: req.body.psychiatric || user1.psychiatric,
                                otherSpecialist: req.body.otherSpecialist || user1.otherSpecialist,
                                none: req.body.none || user1.none,
                                emergencyRoomVisit: req.body.emergencyRoomVisit || user1.emergencyRoomVisit,
                                inpatient: req.body.inpatient || user1.inpatient,
                                urgentCare: req.body.urgentCare || user1.urgentCare,
                                communityOutings: req.body.communityOutings || user1.communityOutings,
                                religiousService: req.body.religiousService || user1.religiousService,
                                adlsCompleted: req.body.adlsCompleted || user1.adlsCompleted,
                                mealPreparation: req.body.mealPreparation || user1.mealPreparation,
                                transportation: req.body.transportation || user1.transportation,
                                residentRedirectedOnBehaviors: req.body.residentRedirectedOnBehaviors || user1.residentRedirectedOnBehaviors,
                                awolElopement: req.body.awolElopement || user1.awolElopement,
                                noteSummary: req.body.noteSummary || user1.noteSummary,
                                bhtName: req.body.bhtName || user1.bhtName,
                                bhtSignature: req.body.bhtSignature || user1.bhtSignature,
                        };
                        let update = await progressNote.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Medication Reconciliation update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteProgressNote = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await progressNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Progress note  not found", data: {} });
                } else {
                        await progressNote.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Progress note delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllProgressNote = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter.patientId = req.query.patientId;
                }
                let findEmployee = await progressNote.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Progress note not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Medication Reconciliation found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createDischargeSummary = async (req, res) => {
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
                        clientName: req.body.clientName,
                        dateOfBirth: req.body.dateOfBirth,
                        dateOfAdmission: req.body.dateOfAdmission,
                        dateOfDischarge: req.body.dateOfDischarge,
                        presentingIssue: req.body.presentingIssue,
                        treatmentProvided: req.body.treatmentProvided,
                        progress: req.body.progress,
                        medicationUponDischarge: req.body.medicationUponDischarge,
                        fundsPropertiesUponDischarge: req.body.fundsPropertiesUponDischarge,
                        reasonForDischarge: req.body.reasonForDischarge,
                        dischargePlanReferralAftercarePlan: req.body.dischargePlanReferralAftercarePlan,
                        patientGuardianSignature: req.body.patientGuardianSignature,
                        patientGuardianSignatureDate: req.body.patientGuardianSignatureDate,
                        staffNameAndTitle: req.body.staffNameAndTitle,
                        staffSignature: req.body.staffSignature,
                        staffSignatureDate: req.body.staffSignatureDate,
                        bhpNameAndCredentials: req.body.bhpNameAndCredentials,
                        bhpSignature: req.body.bhpSignature,
                        bhpSignatureDate: req.body.bhpSignatureDate,
                };
                let newEmployee = await dischargeSummary.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Discharge summary add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getDischargeSummaryById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await dischargeSummary.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Discharge summary not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Discharge summary found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editDischargeSummaryById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await dischargeSummary.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Discharge summary not found", data: {} });
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
                                clientName: req.body.clientName || user1.clientName,
                                dateOfBirth: req.body.dateOfBirth || user1.dateOfBirth,
                                dateOfAdmission: req.body.dateOfAdmission || user1.dateOfAdmission,
                                dateOfDischarge: req.body.dateOfDischarge || user1.dateOfDischarge,
                                presentingIssue: req.body.presentingIssue || user1.presentingIssue,
                                treatmentProvided: req.body.treatmentProvided || user1.treatmentProvided,
                                progress: req.body.progress || user1.progress,
                                medicationUponDischarge: req.body.medicationUponDischarge || user1.medicationUponDischarge,
                                fundsPropertiesUponDischarge: req.body.fundsPropertiesUponDischarge || user1.fundsPropertiesUponDischarge,
                                reasonForDischarge: req.body.reasonForDischarge || user1.reasonForDischarge,
                                dischargePlanReferralAftercarePlan: req.body.dischargePlanReferralAftercarePlan || user1.dischargePlanReferralAftercarePlan,
                                patientGuardianSignature: req.body.patientGuardianSignature || user1.patientGuardianSignature,
                                patientGuardianSignatureDate: req.body.patientGuardianSignatureDate || user1.patientGuardianSignatureDate,
                                staffNameAndTitle: req.body.staffNameAndTitle || user1.staffNameAndTitle,
                                staffSignature: req.body.staffSignature || user1.staffSignature,
                                staffSignatureDate: req.body.staffSignatureDate || user1.staffSignatureDate,
                                bhpNameAndCredentials: req.body.bhpNameAndCredentials || user1.bhpNameAndCredentials,
                                bhpSignature: req.body.bhpSignature || user1.bhpSignature,
                                bhpSignatureDate: req.body.bhpSignatureDate || user1.bhpSignatureDate,
                        };
                        let update = await dischargeSummary.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Medication Reconciliation update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteDischargeSummary = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await dischargeSummary.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Discharge summary  not found", data: {} });
                } else {
                        await dischargeSummary.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Discharge summary delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllDischargeSummary = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter.patientId = req.query.patientId;
                }
                let findEmployee = await dischargeSummary.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Discharge summary not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Discharge summary found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createADLTrackingForm = async (req, res) => {
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
                        date: req.body.date,
                        selectingClothes: req.body.selectingClothes,
                        bathingOrShowering: req.body.bathingOrShowering,
                        combingHair: req.body.combingHair,
                        applyingLotion: req.body.applyingLotion,
                        laundry: req.body.laundry,
                        dressing: req.body.dressing,
                        shampooingHair: req.body.shampooingHair,
                        oralCareMorning: req.body.oralCareMorning,
                        oralCareEvening: req.body.oralCareEvening,
                        breakfast: req.body.breakfast,
                        lunch: req.body.lunch,
                        dinner: req.body.dinner,
                        amSnack: req.body.amSnack,
                        pmSnack: req.body.pmSnack,
                        amBowelMovement: req.body.amBowelMovement,
                        pmBowelMovement: req.body.pmBowelMovement,
                        overnightBowelMovement: req.body.overnightBowelMovement,
                        handAndFootNailCare: req.body.handAndFootNailCare,
                        bedMobility: req.body.bedMobility,
                };
                let newEmployee = await ADLTrackingForm.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "ADLTrackingForm add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getADLTrackingFormById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await ADLTrackingForm.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "ADLTrackingForm not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "ADLTrackingForm found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editADLTrackingFormById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await ADLTrackingForm.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "ADLTrackingForm not found", data: {} });
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
                                date: req.body.date || user1.date,
                                selectingClothes: req.body.selectingClothes || user1.selectingClothes,
                                bathingOrShowering: req.body.bathingOrShowering || user1.bathingOrShowering,
                                combingHair: req.body.combingHair || user1.combingHair,
                                applyingLotion: req.body.applyingLotion || user1.applyingLotion,
                                laundry: req.body.laundry || user1.laundry,
                                dressing: req.body.dressing || user1.dressing,
                                shampooingHair: req.body.shampooingHair || user1.shampooingHair,
                                oralCareMorning: req.body.oralCareMorning || user1.oralCareMorning,
                                oralCareEvening: req.body.oralCareEvening || user1.oralCareEvening,
                                breakfast: req.body.breakfast || user1.breakfast,
                                lunch: req.body.lunch || user1.lunch,
                                dinner: req.body.dinner || user1.dinner,
                                amSnack: req.body.amSnack || user1.amSnack,
                                pmSnack: req.body.pmSnack || user1.pmSnack,
                                amBowelMovement: req.body.amBowelMovement || user1.amBowelMovement,
                                pmBowelMovement: req.body.pmBowelMovement || user1.pmBowelMovement,
                                overnightBowelMovement: req.body.overnightBowelMovement || user1.overnightBowelMovement,
                                handAndFootNailCare: req.body.handAndFootNailCare || user1.handAndFootNailCare,
                                bedMobility: req.body.bedMobility || user1.bedMobility,
                        };
                        let update = await ADLTrackingForm.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "ADLTrackingForm update.", data: update });
                        }
                };
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteADLTrackingForm = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await ADLTrackingForm.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "ADLTrackingForm  not found", data: {} });
                } else {
                        await ADLTrackingForm.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "ADLTrackingForm delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllADLTrackingForm = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter.patientId = req.query.patientId;
                }
                let findEmployee = await ADLTrackingForm.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "ADLTrackingForm not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "ADLTrackingForm found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createFinancialTransactionsRecord = async (req, res) => {
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
                        dateOfBirth: req.body.dateOfBirth,
                        admitDate: req.body.admitDate,
                        transactions: req.body.transactions,
                };
                let newEmployee = await financialTransactionsRecord.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Financial transactions record add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getFinancialTransactionsRecordById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await financialTransactionsRecord.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Financial transactions record not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Financial transactions record found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editFinancialTransactionsRecordById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await financialTransactionsRecord.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Financial transactions record not found", data: {} });
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
                                admitDate: req.body.admitDate || user1.admitDate,
                                dateOfBirth: req.body.dateOfBirth || user1.dateOfBirth,
                                transactions: req.body.transactions || user1.transactions,
                        };
                        let update = await financialTransactionsRecord.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Financial transactions record update.", data: update });
                        }
                };
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteFinancialTransactionsRecord = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await financialTransactionsRecord.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Financial transactions record  not found", data: {} });
                } else {
                        await financialTransactionsRecord.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Financial transactions record delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllFinancialTransactionsRecord = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter.patientId = req.query.patientId;
                }
                let findEmployee = await financialTransactionsRecord.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Financial transactions record not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Financial transactions record found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createStaffingNote = async (req, res) => {
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
                        dateOfBirth: req.body.dateOfBirth,
                        todayDate: req.body.todayDate,
                        beginTime: req.body.beginTime,
                        endTime: req.body.endTime,
                        participantsPresent: req.body.participantsPresent,
                        presentingIssues: req.body.presentingIssues,
                        progress: req.body.progress,
                        barriers: req.body.barriers,
                        recommendations: req.body.recommendations,
                        staffSignature: req.body.staffSignature,
                };
                let newEmployee = await staffingNote.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Staffing Note add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getStaffingNoteById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await staffingNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Staffing Note not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Staffing Note found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editStaffingNoteById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await staffingNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Staffing Note not found", data: {} });
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
                                dateOfBirth: req.body.dateOfBirth || user1.dateOfBirth,
                                todayDate: req.body.todayDate || user1.todayDate,
                                beginTime: req.body.beginTime || user1.beginTime,
                                endTime: req.body.endTime || user1.endTime,
                                participantsPresent: req.body.participantsPresent || user1.participantsPresent,
                                presentingIssues: req.body.presentingIssues || user1.presentingIssues,
                                progress: req.body.progress || user1.progress,
                                barriers: req.body.barriers || user1.barriers,
                                recommendations: req.body.recommendations || user1.recommendations,
                                staffSignature: req.body.staffSignature || user1.staffSignature,
                        };
                        let update = await staffingNote.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Staffing Note update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteStaffingNote = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await staffingNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Staffing Note  not found", data: {} });
                } else {
                        await staffingNote.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Staffing Note delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllStaffingNote = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter.patientId = req.query.patientId;
                }
                let findEmployee = await staffingNote.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Staffing Note not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Staffing Note found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createAuthorizationForReleaseOfInformation = async (req, res) => {
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
                        dateOfBirth: req.body.dateOfBirth,
                        authorizedPersonName: req.body.authorizedPersonName,
                        authorizedPersonAgency: req.body.authorizedPersonAgency,
                        authorizedPersonAddress: req.body.authorizedPersonAddress,
                        authorizedPersonPhone: req.body.authorizedPersonPhone,
                        authorizedPersonFax: req.body.authorizedPersonFax,
                        authorizedPersonEmail: req.body.authorizedPersonEmail,
                        dropDown: req.body.dropDown,
                        purposeOfDisclosure: req.body.purposeOfDisclosure,
                        companyName: req.body.companyName,
                        expirationFrom: req.body.expirationFrom,
                        expirationTo: req.body.expirationTo,
                        revocation: req.body.revocation,
                        specify: req.body.specify,
                        signature: req.body.signature,
                        dateSigned: req.body.dateSigned,
                        relationshipToPerson: req.body.relationshipToPerson,
                        witness: req.body.witness,
                };
                let newEmployee = await authorizationForReleaseOfInformation.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Authorization For Release Of Information add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAuthorizationForReleaseOfInformationById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await authorizationForReleaseOfInformation.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Authorization For Release Of Information not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Authorization For Release Of Information found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editAuthorizationForReleaseOfInformationById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await authorizationForReleaseOfInformation.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Authorization For Release Of Information not found", data: {} });
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
                                dateOfBirth: req.body.dateOfBirth || user1.dateOfBirth,
                                authorizedPersonName: req.body.authorizedPersonName || user1.authorizedPersonName,
                                authorizedPersonAgency: req.body.authorizedPersonAgency || user1.authorizedPersonAgency,
                                authorizedPersonAddress: req.body.authorizedPersonAddress || user1.authorizedPersonAddress,
                                authorizedPersonPhone: req.body.authorizedPersonPhone || user1.authorizedPersonPhone,
                                authorizedPersonFax: req.body.authorizedPersonFax || user1.authorizedPersonFax,
                                authorizedPersonEmail: req.body.authorizedPersonEmail || user1.authorizedPersonEmail,
                                dropDown: req.body.dropDown || user1.dropDown,
                                purposeOfDisclosure: req.body.purposeOfDisclosure || user1.purposeOfDisclosure,
                                companyName: req.body.companyName || user1.companyName,
                                expirationFrom: req.body.expirationFrom || user1.expirationFrom,
                                expirationTo: req.body.expirationTo || user1.expirationTo,
                                revocation: req.body.revocation || user1.revocation,
                                specify: req.body.specify || user1.specify,
                                signature: req.body.signature || user1.signature,
                                dateSigned: req.body.dateSigned || user1.dateSigned,
                                relationshipToPerson: req.body.relationshipToPerson || user1.relationshipToPerson,
                                witness: req.body.witness || user1.witness,
                        };
                        let update = await authorizationForReleaseOfInformation.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Authorization For Release Of Information update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteAuthorizationForReleaseOfInformation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await authorizationForReleaseOfInformation.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Authorization For Release Of Information  not found", data: {} });
                } else {
                        await authorizationForReleaseOfInformation.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Authorization For Release Of Information delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllAuthorizationForReleaseOfInformation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                if (req.query.patientId != (null || undefined)) {
                        const user2 = await User.findOne({ _id: req.query.patientId, userType: "Patient", employeesId: { $in: [user._id.toString()] } });
                        if (!user2) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        filter.patientId = req.query.patientId;
                }
                let findEmployee = await authorizationForReleaseOfInformation.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Authorization For Release Of Information not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Authorization For Release Of Information found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createIncidentReportPartA = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let residentsInvolved = [], employeesInvolved = [];
                employeesInvolved.push(user._id);
                residentsInvolved.push(user1._id)
                let obj = {
                        residentsInvolved: residentsInvolved,
                        adminId: user.adminId,
                        employeesInvolved: employeesInvolved,
                        dateOfIncident: req.body.dateOfIncident,
                        timeOfIncident: req.body.timeOfIncident,
                        personObservingReporting: req.body.personObservingReporting,
                        incidentsAltercationVerbal: req.body.incidentsAltercationVerbal,
                        incidentsPropertyLoss: req.body.incidentsPropertyLoss,
                        incidentsWeapon: req.body.incidentsWeapon,
                        incidentsRuleViolation: req.body.incidentsRuleViolation,
                        incidentsAltercationPhysical: req.body.incidentsAltercationPhysical,
                        incidentsPropertyDamage: req.body.incidentsPropertyDamage,
                        incidentsContraband: req.body.incidentsContraband,
                        incidentsSeizure: req.body.incidentsSeizure,
                        incidentsViolentThreatSelf: req.body.incidentsViolentThreatSelf,
                        incidentsVehicularAccident: req.body.incidentsVehicularAccident,
                        incidentsAlcoholDrugUse: req.body.incidentsAlcoholDrugUse,
                        incidentsMedicationErrors: req.body.incidentsMedicationErrors,
                        incidentsViolentThreatOthers: req.body.incidentsViolentThreatOthers,
                        incidentsMedicalEmergency911: req.body.incidentsMedicalEmergency911,
                        incidentsEquipmentUtilityFailure: req.body.incidentsEquipmentUtilityFailure,
                        incidentsAWOL: req.body.incidentsAWOL,
                        incidentsViolentActionSelf: req.body.incidentsViolentActionSelf,
                        incidentsEmployeeInjury: req.body.incidentsEmployeeInjury,
                        incidentsBiohazardousMaterial: req.body.incidentsBiohazardousMaterial,
                        incidentsPsychiatricEmergency: req.body.incidentsPsychiatricEmergency,
                        incidentsViolentActionOthers: req.body.incidentsViolentActionOthers,
                        incidentsClientConsumerInjury: req.body.incidentsClientConsumerInjury,
                        incidentsAMA: req.body.incidentsAMA,
                        incidentsAbuseNeglect: req.body.incidentsAbuseNeglect,
                        incidentsTrespassing: req.body.incidentsTrespassing,
                        incidentsProceduralBreak: req.body.incidentsProceduralBreak,
                        incidentsSlipFall: req.body.incidentsSlipFall,
                        incidentsCutAbrasion: req.body.incidentsCutAbrasion,
                        incidentspharmacyError: req.body.incidentspharmacyError,
                        eventDetails: req.body.eventDetails,
                        medicationErrorsMissedDose: req.body.medicationErrorsMissedDose,
                        medicationErrorsRefusedMedication: req.body.medicationErrorsRefusedMedication,
                        medicationErrorsWrongClient: req.body.medicationErrorsWrongClient,
                        medicationErrorsWrongTime: req.body.medicationErrorsWrongTime,
                        medicationErrorsWrongMed: req.body.medicationErrorsWrongMed,
                        actionsTakenSenttoERHospital: req.body.actionsTakenSenttoERHospital,
                        actionsTakenFirstAid: req.body.actionsTakenFirstAid,
                        actionsTakenNoMedicalCareRequired: req.body.actionsTakenNoMedicalCareRequired,
                        CareRefused: req.body.CareRefused,
                        actionsTakenFireDepartmentCalled: req.body.actionsTakenFireDepartmentCalled,
                        actionsTakenPoliceCalled: req.body.actionsTakenPoliceCalled,
                        actionsTakenReferredtoAdministratorRiskManagement: req.body.actionsTakenReferredtoAdministratorRiskManagement,
                        actionsTakenMaintenanceCalledWorkOrderCompleted: req.body.actionsTakenMaintenanceCalledWorkOrderCompleted,
                        actionsTakenOther: req.body.actionsTakenOther,
                        abuseNeglectInvolved: req.body.abuseNeglectInvolved,
                        abuseNeglectInvolvedifYes: req.body.abuseNeglectInvolvedifYes,
                        notificationsFamily: req.body.notificationsFamily,
                        notificationsGuardian: req.body.notificationsGuardian,
                        notificationsCaseManager: req.body.notificationsCaseManager,
                        notificationsOther: req.body.notificationsOther,
                        notificationIfOther: req.body.notificationIfOther,
                        notificationDate: req.body.notificationDate,
                        notificationTime: req.body.notificationTime,
                        reportCompletedBy: req.body.reportCompletedBy,
                        partType: "A",
                };
                let newEmployee = await incidentReport.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Authorization For Release Of Information add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createIncidentReportPartB = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const checklist = await incidentReport.findOne({ _id: req.body.aPartId });
                if (checklist) {
                        let obj1 = {
                                residentsInvolved: checklist.residentsInvolved,
                                adminId: checklist.adminId,
                                employeesInvolved: checklist.employeesInvolved,
                                partId: checklist._id,
                                investigationDetails: req.body.investigationDetails,
                                investigationRecommendationsAndActions: req.body.investigationRecommendationsAndActions,
                                investigationFollowUp: req.body.investigationFollowUp,
                                investigationCompletedBy: req.body.investigationCompletedBy,
                                investigationCompletionDate: req.body.investigationCompletionDate,
                                partType: "B",
                        };
                        const checklist1 = await incidentReport.create(obj1);
                        if (checklist1) {
                                return res.status(200).send({ status: 200, message: "Incident Report added successfully.", data: checklist1 });
                        }
                } else {
                        return res.status(404).send({ status: 404, message: "Incident Report not found", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getIncidentReportById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await incidentReport.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Incident report not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Incident report found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editIncidentReportPartA = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user2 = await incidentReport.findOne({ _id: req.params.id, partType: "A" });
                if (!user2) {
                        return res.status(404).send({ status: 404, message: "Incident report not found", data: {} });
                }
                let residentsInvolved = [], employeesInvolved = [];
                if (req.body.patientId != (null || undefined)) {
                        const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                        if (!user1) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        employeesInvolved.push(user._id);
                        residentsInvolved.push(user1._id)
                } else {
                        residentsInvolved = user2.residentsInvolved;
                        employeesInvolved = user2.employeesInvolved;
                }
                let obj = {
                        residentsInvolved: residentsInvolved,
                        adminId: user.adminId,
                        employeesInvolved: employeesInvolved,
                        dateOfIncident: req.body.dateOfIncident || user2.dateOfIncident,
                        timeOfIncident: req.body.timeOfIncident || user2.timeOfIncident,
                        personObservingReporting: req.body.personObservingReporting || user2.personObservingReporting,
                        incidentsAltercationVerbal: req.body.incidentsAltercationVerbal || user2.incidentsAltercationVerbal,
                        incidentsPropertyLoss: req.body.incidentsPropertyLoss || user2.incidentsPropertyLoss,
                        incidentsWeapon: req.body.incidentsWeapon || user2.incidentsWeapon,
                        incidentsRuleViolation: req.body.incidentsRuleViolation || user2.incidentsRuleViolation,
                        incidentsAltercationPhysical: req.body.incidentsAltercationPhysical || user2.incidentsAltercationPhysical,
                        incidentsPropertyDamage: req.body.incidentsPropertyDamage || user2.incidentsPropertyDamage,
                        incidentsContraband: req.body.incidentsContraband || user2.incidentsContraband,
                        incidentsSeizure: req.body.incidentsSeizure || user2.incidentsSeizure,
                        incidentsViolentThreatSelf: req.body.incidentsViolentThreatSelf || user2.incidentsViolentThreatSelf,
                        incidentsVehicularAccident: req.body.incidentsVehicularAccident || user2.incidentsVehicularAccident,
                        incidentsAlcoholDrugUse: req.body.incidentsAlcoholDrugUse || user2.incidentsAlcoholDrugUse,
                        incidentsMedicationErrors: req.body.incidentsMedicationErrors || user2.incidentsMedicationErrors,
                        incidentsViolentThreatOthers: req.body.incidentsViolentThreatOthers || user2.incidentsViolentThreatOthers,
                        incidentsMedicalEmergency911: req.body.incidentsMedicalEmergency911 || user2.incidentsMedicalEmergency911,
                        incidentsEquipmentUtilityFailure: req.body.incidentsEquipmentUtilityFailure || user2.incidentsEquipmentUtilityFailure,
                        incidentsAWOL: req.body.incidentsAWOL || user2.incidentsAWOL,
                        incidentsViolentActionSelf: req.body.incidentsViolentActionSelf || user2.incidentsViolentActionSelf,
                        incidentsEmployeeInjury: req.body.incidentsEmployeeInjury || user2.incidentsEmployeeInjury,
                        incidentsBiohazardousMaterial: req.body.incidentsBiohazardousMaterial || user2.incidentsBiohazardousMaterial,
                        incidentsPsychiatricEmergency: req.body.incidentsPsychiatricEmergency || user2.incidentsPsychiatricEmergency,
                        incidentsViolentActionOthers: req.body.incidentsViolentActionOthers || user2.incidentsViolentActionOthers,
                        incidentsClientConsumerInjury: req.body.incidentsClientConsumerInjury || user2.incidentsClientConsumerInjury,
                        incidentsAMA: req.body.incidentsAMA || user2.incidentsAMA,
                        incidentsAbuseNeglect: req.body.incidentsAbuseNeglect || user2.incidentsAbuseNeglect,
                        incidentsTrespassing: req.body.incidentsTrespassing || user2.incidentsTrespassing,
                        incidentsProceduralBreak: req.body.incidentsProceduralBreak || user2.incidentsProceduralBreak,
                        incidentsSlipFall: req.body.incidentsSlipFall || user2.incidentsSlipFall,
                        incidentsCutAbrasion: req.body.incidentsCutAbrasion || user2.incidentsCutAbrasion,
                        incidentspharmacyError: req.body.incidentspharmacyError || user2.incidentspharmacyError,
                        eventDetails: req.body.eventDetails || user2.eventDetails,
                        medicationErrorsMissedDose: req.body.medicationErrorsMissedDose || user2.medicationErrorsMissedDose,
                        medicationErrorsRefusedMedication: req.body.medicationErrorsRefusedMedication || user2.medicationErrorsRefusedMedication,
                        medicationErrorsWrongClient: req.body.medicationErrorsWrongClient || user2.medicationErrorsWrongClient,
                        medicationErrorsWrongTime: req.body.medicationErrorsWrongTime || user2.medicationErrorsWrongTime,
                        medicationErrorsWrongMed: req.body.medicationErrorsWrongMed || user2.medicationErrorsWrongMed,
                        actionsTakenSenttoERHospital: req.body.actionsTakenSenttoERHospital || user2.actionsTakenSenttoERHospital,
                        actionsTakenFirstAid: req.body.actionsTakenFirstAid || user2.actionsTakenFirstAid,
                        actionsTakenNoMedicalCareRequired: req.body.actionsTakenNoMedicalCareRequired || user2.actionsTakenNoMedicalCareRequired,
                        CareRefused: req.body.CareRefused || user2.CareRefused,
                        actionsTakenFireDepartmentCalled: req.body.actionsTakenFireDepartmentCalled || user2.actionsTakenFireDepartmentCalled,
                        actionsTakenPoliceCalled: req.body.actionsTakenPoliceCalled || user2.actionsTakenPoliceCalled,
                        actionsTakenReferredtoAdministratorRiskManagement: req.body.actionsTakenReferredtoAdministratorRiskManagement || user2.actionsTakenReferredtoAdministratorRiskManagement,
                        actionsTakenMaintenanceCalledWorkOrderCompleted: req.body.actionsTakenMaintenanceCalledWorkOrderCompleted || user2.actionsTakenMaintenanceCalledWorkOrderCompleted,
                        actionsTakenOther: req.body.actionsTakenOther || user2.actionsTakenOther,
                        abuseNeglectInvolved: req.body.abuseNeglectInvolved || user2.abuseNeglectInvolved,
                        abuseNeglectInvolvedifYes: req.body.abuseNeglectInvolvedifYes || user2.abuseNeglectInvolvedifYes,
                        notificationsFamily: req.body.notificationsFamily || user2.notificationsFamily,
                        notificationsGuardian: req.body.notificationsGuardian || user2.notificationsGuardian,
                        notificationsCaseManager: req.body.notificationsCaseManager || user2.notificationsCaseManager,
                        notificationsOther: req.body.notificationsOther || user2.notificationsOther,
                        notificationIfOther: req.body.notificationIfOther || user2.notificationIfOther,
                        notificationDate: req.body.notificationDate || user2.notificationDate,
                        notificationTime: req.body.notificationTime || user2.notificationTime,
                        reportCompletedBy: req.body.reportCompletedBy || user2.reportCompletedBy,
                        partType: "A",
                };
                let update = await incidentReport.findByIdAndUpdate({ _id: user2._id }, { $set: obj }, { new: true });
                if (update) {
                        return res.status(200).send({ status: 200, message: "Incident report update.", data: update });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editIncidentReportPartB = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user2 = await incidentReport.findOne({ _id: req.params.id, partType: "B" });
                if (!user2) {
                        return res.status(404).send({ status: 404, message: "Incident report not found", data: {} });
                }
                let partId;
                if (req.body.aPartId != (null || undefined)) {
                        const checklist = await incidentReport.findOne({ _id: req.body.aPartId });
                        if (checklist) {
                                partId = checklist._id;
                        }
                } else {
                        partId = user2.partId
                }
                let obj1 = {
                        residentsInvolved: user2.residentsInvolved,
                        adminId: user2.adminId,
                        employeesInvolved: user2.employeesInvolved,
                        partId: partId,
                        investigationDetails: req.body.investigationDetails || user2.investigationDetails,
                        investigationRecommendationsAndActions: req.body.investigationRecommendationsAndActions || user2.investigationRecommendationsAndActions,
                        investigationFollowUp: req.body.investigationFollowUp || user2.investigationFollowUp,
                        investigationCompletedBy: req.body.investigationCompletedBy || user2.investigationCompletedBy,
                        investigationCompletionDate: req.body.investigationCompletionDate || user2.investigationCompletionDate,
                        partType: "B",
                };
                let update = await incidentReport.findByIdAndUpdate({ _id: user2._id }, { $set: obj1 }, { new: true });
                if (update) {
                        return res.status(200).send({ status: 200, message: "Incident report update.", data: update });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteIncidentReport = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await incidentReport.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Incident report  not found", data: {} });
                } else {
                        await incidentReport.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Incident report delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllIncidentReport = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = { employeesInvolved: { $in: [user._id.toString()] } };
                if (req.query.partType != (null || undefined)) {
                        filter.partType = req.query.partType;
                }
                let findEmployee = await incidentReport.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Incident report not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Incident report found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createContactNote = async (req, res) => {
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
                        guardian: req.body.guardian,
                        caseManager: req.body.caseManager,
                        pharmacy: req.body.pharmacy,
                        familyMember: req.body.familyMember,
                        doctorsOffice: req.body.doctorsOffice,
                        personContactedOther: req.body.personContactedOther,
                        contactName: req.body.contactName,
                        email: req.body.email,
                        textMessage: req.body.textMessage,
                        phoneCall: req.body.phoneCall,
                        inPerson: req.body.inPerson,
                        modeOfContactOther: req.body.modeOfContactOther,
                        contactSummaryNote: req.body.contactSummaryNote,
                        emergencyIssue: req.body.emergencyIssue
                };
                let newEmployee = await contactNote.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Contact note add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getContactNoteById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await contactNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Contact note not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Contact note found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editContactNoteById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await contactNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Authorization For Release Of Information not found", data: {} });
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
                                guardian: req.body.guardian || user1.guardian,
                                caseManager: req.body.caseManager || user1.caseManager,
                                pharmacy: req.body.pharmacy || user1.pharmacy,
                                familyMember: req.body.familyMember || user1.familyMember,
                                doctorsOffice: req.body.doctorsOffice || user1.doctorsOffice,
                                personContactedOther: req.body.personContactedOther || user1.personContactedOther,
                                contactName: req.body.contactName || user1.contactName,
                                email: req.body.email || user1.email,
                                textMessage: req.body.textMessage || user1.textMessage,
                                phoneCall: req.body.phoneCall || user1.phoneCall,
                                inPerson: req.body.inPerson || user1.inPerson,
                                modeOfContactOther: req.body.modeOfContactOther || user1.modeOfContactOther,
                                contactSummaryNote: req.body.contactSummaryNote || user1.contactSummaryNote,
                                emergencyIssue: req.body.emergencyIssue || user1.emergencyIssue,
                        };
                        let update = await contactNote.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Contact note update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteContactNote = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await contactNote.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Contact note  not found", data: {} });
                } else {
                        await contactNote.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Contact note delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllContactNote = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                filter.employeeId = user._id;
                let findEmployee = await contactNote.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Contact note not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Contact note found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createUploadDocument = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found! Not registered.", data: {} });
                } else {
                        const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                        if (!user1) {
                                return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                        }
                        let uploadDate = new Date(), documentType, size, document;
                        let getDate = new Date();
                        let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
                        let formattedDate = getDate.toLocaleDateString('en-IN', options);
                        uploadDate = formattedDate;
                        if (req.file) {
                                const fullMimeType = req.file.mimetype;
                                documentType = fullMimeType.startsWith('application/') ? fullMimeType.substring(12) : fullMimeType;
                                if (req.file.size < 1024 * 1024) {
                                        size = (req.file.size / 1024).toFixed(2) + ' KB';
                                } else {
                                        size = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
                                }
                                document = req.file.path;
                        }
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                patientId: user1._id,
                                uploadDate: uploadDate,
                                documentType: documentType,
                                document: document,
                                size: size,
                        };
                        const userCreate = await uploadAnyWordOrPdfDocument.create(obj);
                        return res.status(200).send({ status: 200, message: "Upload Document added successfully", data: userCreate, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {}, });
        }
};
exports.getUploadDocumentById = async (req, res) => {
        try {
                const user1 = await uploadAnyWordOrPdfDocument.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Upload Document not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Upload Document fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteUploadDocument = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await uploadAnyWordOrPdfDocument.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Upload document not found", data: {} });
                } else {
                        await uploadAnyWordOrPdfDocument.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Upload document delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllUploadDocument = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await uploadAnyWordOrPdfDocument.find({ employeeId: user._id }).sort({ createdAt: -1 })
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No Upload Document found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Upload Document found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createAppointment = async (req, res) => {
        try {
                let { name, contactNumber, reasonForVisit, appointmentDate, appointmentTime } = req.body;
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found! Not registered.", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, employeesId: { $in: [user._id.toString()] }, adminId: user.adminId, userType: "Patient", });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        name: name,
                        contactNumber: contactNumber,
                        reasonForVisit: reasonForVisit,
                        date: appointmentDate,
                        time: appointmentTime,
                        patientId: user1._id,
                        employeeId: user._id,
                        adminId: user1.adminId,
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
exports.getAllUpcomingAppointments = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const currentDate = new Date();
                const upcomingAppointments = await appointment.find({ employeeId: user._id, date: { $gte: currentDate }, }).sort({ date: 1 });
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
                const upcomingAppointments = await appointment.find({ employeeId: user._id, date: currentDate, }).sort({ date: 1 });
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
                const upcomingAppointments = await appointment.find({ employeeId: user._id, date: { $lt: currentDate }, }).sort({ date: 1 });
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
exports.getAllMedicationEmployee = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await medicationEmployee.find({ adminId: user.adminId }).sort({ createdAt: -1 })
                if (tasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No Medication employee found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Medication employee found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createPersonalInformation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await personalInformation.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await personalInformation.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "Personal information add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        employeeId: user._id,
                                        adminId: user.adminId,
                                        date: req.body.date || findEmployee.date,
                                        lastName: req.body.lastName || findEmployee.lastName,
                                        firstName: req.body.firstName || findEmployee.firstName,
                                        middleInitial: req.body.middleInitial || findEmployee.middleInitial,
                                        addressStreet: req.body.addressStreet || findEmployee.address.street,
                                        addressCity: req.body.addressCity || findEmployee.address.city,
                                        addressState: req.body.addressState || findEmployee.address.state,
                                        addressZip: req.body.addressZip || findEmployee.address.zip,
                                        socSecNo: req.body.socSecNo || findEmployee.socSecNo,
                                        birthDate: req.body.birthDate || findEmployee.birthDate,
                                        telephoneHome: req.body.telephoneHome || findEmployee.telephone.home,
                                        telephonePersonalCell: req.body.telephonePersonalCell || findEmployee.telephone.personalCell,
                                        telephoneWork: req.body.telephoneWork || findEmployee.telephone.work,
                                        telephoneBusinessCell: req.body.telephoneBusinessCell || findEmployee.telephone.businessCell,
                                        dLStateOfIssue: req.body.dLStateOfIssue || findEmployee.driversLicense.stateOfIssue,
                                        dLNumber: req.body.dLNumber || findEmployee.driversLicense.number,
                                        dLExpirationDate: req.body.dLExpirationDate || findEmployee.driversLicense.expirationDate,
                                        businessEmail: req.body.businessEmail || findEmployee.businessEmail,
                                        personalEmail: req.body.personalEmail || findEmployee.personalEmail,
                                        emergencyContactName: req.body.emergencyContactName || findEmployee.emergencyContact.name,
                                        emergencyContactRelationship: req.body.emergencyContactRelationship || findEmployee.emergencyContactRelationship,
                                        emergencyContactNumber: req.body.emergencyContactNumber || findEmployee.emergencyContact.phone,
                                        savedSigned: req.body.savedSigned || findEmployee.savedSigned,
                                };
                                let update = await personalInformation.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "Personal information add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getPersonalInformation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await personalInformation.findOne({ employeeId: user._id }).sort({ createdAt: -1 })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Personal information found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Personal information found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deletePersonalInformation = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await personalInformation.findOne({ employeeId: user._id });
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Personal information found.", data: {} });
                }
                await personalInformation.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "Personal Information delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllOfferLetter = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await offerLetter.findOne({ employeeId: user._id }).sort({ createdAt: -1 })
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No OfferLetter found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "OfferLetter found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createAppendix = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await appendix.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await appendix.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "Appendix add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        employeeId: user._id,
                                        adminId: user.adminId,
                                        name: req.body.name || findEmployee.name,
                                        date: req.body.date || findEmployee.date,
                                        preferredContactInformation: req.body.preferredContactInformation || findEmployee.preferredContactInformation,
                                        positionHiredFor: req.body.positionHiredFor || findEmployee.positionHiredFor,
                                        startDate: req.body.startDate || findEmployee.startDate,
                                        spentMoreThan30DaysAbroad: req.body.spentMoreThan30DaysAbroad || findEmployee.spentMoreThan30DaysAbroad,
                                        closeContactWithActiveTB: req.body.closeContactWithActiveTB || findEmployee.closeContactWithActiveTB,
                                        symptomsFever: req.body.symptomsFever || findEmployee.symptomsFever,
                                        symptomsCough: req.body.symptomsCough || findEmployee.symptomsCough,
                                        symptomsBloodySputum: req.body.symptomsBloodySputum || findEmployee.symptomsBloodySputum,
                                        symptomsUnintendedWeightLoss: req.body.symptomsUnintendedWeightLoss || findEmployee.symptomsUnintendedWeightLoss,
                                        symptomsNightSweats: req.body.symptomsNightSweats || findEmployee.symptomsNightSweats,
                                        symptomsUnexplainedFatigue: req.body.symptomsUnexplainedFatigue || findEmployee.symptomsUnexplainedFatigue,
                                        diagnosedWithActiveTB: req.body.diagnosedWithActiveTB || findEmployee.diagnosedWithActiveTB,
                                        diagnosedWithLatentTB: req.body.diagnosedWithLatentTB || findEmployee.diagnosedWithLatentTB,
                                        tbTreatmentHistoryYear: req.body.tbTreatmentHistoryYear || findEmployee.tbTreatmentHistoryYear,
                                        tbTreatmentHistoryMedication: req.body.tbTreatmentHistoryMedication || findEmployee.tbTreatmentHistoryMedication,
                                        tbTreatmentHistoryDuration: req.body.tbTreatmentHistoryDuration || findEmployee.tbTreatmentHistoryDuration,
                                        tbTreatmentHistoryCompletedTreatment: req.body.tbTreatmentHistoryCompletedTreatment || findEmployee.tbTreatmentHistoryCompletedTreatment,
                                        weakenedImmuneSystem: req.body.weakenedImmuneSystem || findEmployee.weakenedImmuneSystem,
                                        reviewerSignature: req.body.reviewerSignature || findEmployee.reviewerSignature,
                                        reviewDate: req.body.reviewDate || findEmployee.reviewDate,
                                };
                                let update = await appendix.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "Appendix add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAppendix = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await appendix.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Appendix found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Appendix found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteAppendix = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await appendix.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Appendix found.", data: {} });
                }
                await appendix.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "Appendix delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createForms2023 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await forms2023.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await forms2023.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "Forms2023 add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        employeeId: user._id,
                                        adminId: user.adminId,
                                        fullName: req.body.fullName || findEmployee.fullName,
                                        socialSecurityNumber: req.body.socialSecurityNumber || findEmployee.socialSecurityNumber,
                                        numberAndStreet: req.body.numberAndStreet || findEmployee.numberAndStreet,
                                        cityOrTown: req.body.cityOrTown || findEmployee.cityOrTown,
                                        state: req.body.state || findEmployee.state,
                                        zipCode: req.body.zipCode || findEmployee.zipCode,
                                        withholdingOption: req.body.withholdingOption || findEmployee.withholdingOption,
                                        signature: req.body.signature || findEmployee.signature,
                                        date: req.body.date || findEmployee.date,
                                };
                                let update = await forms2023.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "Forms2023 add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getForms2023 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await forms2023.findOne({ employeeId: user._id }).sort({ createdAt: -1 })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Forms2023 found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Forms2023 found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteForms2023 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await forms2023.findOne({ employeeId: user._id });
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Forms2023 found.", data: {} });
                }
                await forms2023.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "Forms2023 delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createReferenceCheck = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        req.body.employeeId = user._id;
                        req.body.adminId = user.adminId;
                        let newEmployee = await referenceCheck.create(req.body);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Reference check add successfully.", data: newEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getReferenceCheckById = async (req, res) => {
        try {
                const user1 = await referenceCheck.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Reference check not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Reference check fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editReferenceCheckById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await referenceCheck.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Reference check not found", data: {} });
                } else {
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                date: req.body.date || user1.date,
                                referenceName: req.body.referenceName || user1.referenceName,
                                referenceRecommendation: req.body.referenceRecommendation || user1.referenceRecommendation,
                                savedSigned: req.body.savedSigned || user1.savedSigned,
                        };
                        let update = await referenceCheck.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Reference check update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteReferenceCheck = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await referenceCheck.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Reference check not found", data: {} });
                } else {
                        await referenceCheck.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Reference check delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getReferenceCheck = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await referenceCheck.find({ employeeId: user._id }).sort({ createdAt: -1 })
                if (tasks.length == 0) {
                        return res.status(404).send({ status: 404, message: "No Reference check found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Reference check found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getJobDescription = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await jobDescription.findOne({ employeeId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No JobDescription found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "JobDescription found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.updateJobDescription = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findData = await jobDescription.findOne({ employeeId: user._id, adminId: user.adminId });
                        if (findData) {
                                let obj = {
                                        adminId: user.adminId,
                                        employeeId: user._id,
                                        employeeInfoDate: req.body.employeeInfoDate || findData.employeeInfoDate,
                                        employeeInfoSignature: req.body.employeeInfoSignature || findData.employeeInfoSignature,
                                }
                                const userCreate = await jobDescription.findByIdAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                                return res.status(200).send({ status: 200, message: "jobDescription add successfully ", data: userCreate, });
                        } else {
                                let obj = {
                                        adminId: user.adminId,
                                        employeeId: user._id,
                                        jobDescription: req.body.jobDescription,
                                        positionsSupervised: req.body.positionsSupervised,
                                        primaryResponsibilities: req.body.primaryResponsibilities,
                                        coreCompetencies: req.body.coreCompetencies,
                                        minimumQualifications: req.body.minimumQualifications,
                                        minimumDescription: req.body.minimumDescription,
                                        employeeInfoName: req.body.employeeInfoName,
                                        pleaseNote: req.body.pleaseNote,
                                        employeeInfoSignature: req.body.employeeInfoSignature,
                                        employeeInfoDate: req.body.employeeInfoDate
                                }
                                const userCreate = await jobDescription.create(obj);
                                return res.status(200).send({ status: 200, message: "jobDescription add successfully ", data: userCreate, });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createApsConsent = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
                        employeeName: req.body.employeeName,
                        employeeSignature: req.body.employeeSignature,
                        administratorName: req.body.administratorName,
                        administratorSignature: req.body.administratorSignature,
                        date: req.body.date,
                        classification: req.body.classification,
                        dateOfIncident: req.body.dateOfIncident,
                        noRecordFound: req.body.noRecordFound
                };
                let newEmployee = await apsConsent.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Aps consent add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getApsConsentById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await apsConsent.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Aps consent not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Aps consent found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editApsConsentById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await apsConsent.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Authorization For Release Of Information not found", data: {} });
                } else {
                        let obj = {
                                employeeId: user._id,
                                adminId: user.adminId,
                                employeeName: req.body.employeeName || user1.residentName,
                                employeeSignature: req.body.employeeSignature || user1.employeeSignature,
                                administratorName: req.body.administratorName || user1.administratorName,
                                administratorSignature: req.body.administratorSignature || user1.administratorSignature,
                                date: req.body.date || user1.date,
                                classification: req.body.classification || user1.classification,
                                dateOfIncident: req.body.dateOfIncident || user1.dateOfIncident,
                                noRecordFound: req.body.noRecordFound || user1.noRecordFound,
                        };
                        let update = await apsConsent.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Aps consent update.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteApsConsent = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await apsConsent.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Aps consent  not found", data: {} });
                } else {
                        await apsConsent.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Aps consent delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllApsConsent = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let filter = {};
                filter.employeeId = user._id;
                let findEmployee = await apsConsent.find(filter);
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Aps consent not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Aps consent found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createTermination = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await termination.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await termination.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "Termination add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        employeeId: user._id,
                                        adminId: user.adminId,
                                        date: req.body.date || findEmployee.date,
                                        terminatedEmployeeName: req.body.terminatedEmployeeName || findEmployee.terminatedEmployeeName,
                                        hireDate: req.body.hireDate || findEmployee.hireDate,
                                        terminationDate: req.body.terminationDate || findEmployee.terminationDate,
                                        voluntaryReason: req.body.voluntaryReason || findEmployee.voluntaryReason,
                                        involuntaryReason: req.body.involuntaryReason || findEmployee.involuntaryReason,
                                        disciplinaryAction: req.body.disciplinaryAction || findEmployee.disciplinaryAction,
                                        copyProvidedToEmployee: req.body.copyProvidedToEmployee || findEmployee.copyProvidedToEmployee,
                                        eligibleForRehire: req.body.eligibleForRehire || findEmployee.eligibleForRehire,
                                        explanationForNoRehire: req.body.explanationForNoRehire || findEmployee.explanationForNoRehire,
                                        employeeSignature: req.body.employeeSignature || findEmployee.employeeSignature,
                                        employeeDate: req.body.employeeDate || findEmployee.employeeDate,
                                        administratorSignature: req.body.administratorSignature || findEmployee.administratorSignature,
                                };
                                let update = await termination.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "Termination add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getTermination = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await termination.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Termination found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Termination found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteTermination = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await termination.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Termination found.", data: {} });
                }
                await termination.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "Termination delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createFw9 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await fw9.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await fw9.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "Fw9 add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        employeeId: user._id,
                                        adminId: user.adminId,
                                        name: req.body.name || findEmployee.name,
                                        businessName: req.body.businessName || findEmployee.businessName,
                                        taxClassification: req.body.taxClassification || findEmployee.taxClassification,
                                        llcTaxClassification: req.body.llcTaxClassification || findEmployee.llcTaxClassification,
                                        other: req.body.other || findEmployee.other,
                                        exemptionsPayeeCode: req.body.exemptionsPayeeCode || findEmployee.exemptionsPayeeCode,
                                        exemptionsFatCaExemptionCode: req.body.exemptionsFatCaExemptionCode || findEmployee.exemptionsFatCaExemptionCode,
                                        street: req.body.street || findEmployee.street,
                                        city: req.body.city || findEmployee.city,
                                        state: req.body.state || findEmployee.state,
                                        zipCode: req.body.zipCode || findEmployee.zipCode,
                                        requesterName: req.body.requesterName || findEmployee.requesterName,
                                        requesterAddress: req.body.requesterAddress || findEmployee.requesterAddress,
                                        accountNumbers: req.body.accountNumbers || findEmployee.accountNumbers,
                                        tinSsn: req.body.tinSsn || findEmployee.tinSsn,
                                        tinEin: req.body.tinEin || findEmployee.tinEin,
                                        certificationIsCorrectTIN: req.body.certificationIsCorrectTIN || findEmployee.certificationIsCorrectTIN,
                                        certificationIsExemptFromBackupWithholding: req.body.certificationIsExemptFromBackupWithholding || findEmployee.certificationIsExemptFromBackupWithholding,
                                        certificationIsUSPerson: req.body.certificationIsUSPerson || findEmployee.certificationIsUSPerson,
                                        certificationFatCaCodes: req.body.certificationFatCaCodes || findEmployee.certificationFatCaCodes,
                                        signature: req.body.signature || findEmployee.signature,
                                        date: req.body.date || findEmployee.date,
                                };
                                let update = await fw9.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "Fw9 add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getFw9 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await fw9.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Fw9 found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Fw9 found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteFw9 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await fw9.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Fw9 found.", data: {} });
                }
                await fw9.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "Fw9 delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createI9 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await i9.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await i9.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "I9 add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        employeeId: user._id,
                                        adminId: user.adminId,
                                        lastName: req.body.lastName || findEmployee.lastName,
                                        firstName: req.body.firstName || findEmployee.firstName,
                                        middleInitial: req.body.middleInitial || findEmployee.middleInitial,
                                        otherLastNames: req.body.otherLastNames || findEmployee.otherLastNames,
                                        address: req.body.address || findEmployee.address,
                                        aptNumber: req.body.aptNumber || findEmployee.aptNumber,
                                        city: req.body.city || findEmployee.city,
                                        state: req.body.state || findEmployee.state,
                                        zipCode: req.body.zipCode || findEmployee.zipCode,
                                        dateOfBirth: req.body.dateOfBirth || findEmployee.dateOfBirth,
                                        socialSecurityNumber: req.body.socialSecurityNumber || findEmployee.socialSecurityNumber,
                                        email: req.body.email || findEmployee.email,
                                        telephoneNumber: req.body.telephoneNumber || findEmployee.telephoneNumber,
                                        citizenshipStatus: req.body.citizenshipStatus || findEmployee.citizenshipStatus,
                                        lawfulPermanentResidentText: req.body.lawfulPermanentResidentText || findEmployee.lawfulPermanentResidentText,
                                        NoncitizenAuthorizedToWorExDate: req.body.NoncitizenAuthorizedToWorExDate || findEmployee.NoncitizenAuthorizedToWorExDate,
                                        citizenshipDetails: req.body.citizenshipDetails || findEmployee.citizenshipDetails,
                                        signature: req.body.signature || findEmployee.signature,
                                        attestationDate: req.body.attestationDate || findEmployee.attestationDate,
                                        listA: req.body.listA || findEmployee.listA,
                                        listB: req.body.listB || findEmployee.listB,
                                        listC: req.body.listC || findEmployee.listC,
                                        additionInfo: req.body.additionInfo || findEmployee.additionInfo,
                                        alternativeProcedureUsed: req.body.alternativeProcedureUsed || findEmployee.alternativeProcedureUsed,
                                        certification: req.body.certification || findEmployee.certification,
                                        SupplementASection1: req.body.SupplementASection1 || findEmployee.SupplementASection1,
                                        SupplementAAttest: req.body.SupplementAAttest || findEmployee.SupplementAAttest,
                                        SupplementBSection1: req.body.SupplementBSection1 || findEmployee.SupplementBSection1,
                                        SupplementBAttest: req.body.SupplementBAttest || findEmployee.SupplementBAttest,
                                };


                                let update = await i9.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "I9 add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getI9 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await i9.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No I9 found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "I9 found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteI9 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await i9.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No I9 found.", data: {} });
                }
                await i9.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "I9 delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createFW4 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await fw4.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await fw4.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "FW4 add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        employeeId: user._id,
                                        adminId: user.adminId,
                                        step1FirstName: req.body.step1FirstName || findEmployee.step1FirstName,
                                        step1LastName: req.body.step1LastName || findEmployee.step1LastName,
                                        step1Address: req.body.step1Address || findEmployee.step1Address,
                                        step1City: req.body.step1City || findEmployee.step1City,
                                        step1State: req.body.step1State || findEmployee.step1State,
                                        step1ZipCode: req.body.step1ZipCode || findEmployee.step1ZipCode,
                                        step1SocialSecurityNumber: req.body.step1SocialSecurityNumber || findEmployee.step1SocialSecurityNumber,
                                        step1IsNameMatched: req.body.step1IsNameMatched || findEmployee.step1IsNameMatched,
                                        step1FilingStatus: req.body.step1FilingStatus || findEmployee.step1FilingStatus,
                                        step2Choose: req.body.step2Choose || findEmployee.step2Choose,
                                        step2Ca: req.body.step2Ca || findEmployee.step2Ca,
                                        step2Cb: req.body.step2Cb || findEmployee.step2Cb,
                                        step3QualifyingChildrenCredit: req.body.step3QualifyingChildrenCredit || findEmployee.step3QualifyingChildrenCredit,
                                        step3OtherDependentsCredit: req.body.step3OtherDependentsCredit || findEmployee.step3OtherDependentsCredit,
                                        step3TotalCredits: req.body.step3TotalCredits || findEmployee.step3TotalCredits,
                                        step4OtherIncome: req.body.step4OtherIncome || findEmployee.step4OtherIncome,
                                        step4Deductions: req.body.step4Deductions || findEmployee.step4Deductions,
                                        step4ExtraWithholding: req.body.step4ExtraWithholding || findEmployee.step4ExtraWithholding,
                                        step5EmployeeSignature: req.body.step5EmployeeSignature || findEmployee.step5EmployeeSignature,
                                        step5Date: req.body.step5Date || findEmployee.step5Date,
                                        employerName: req.body.employerName || findEmployee.employerName,
                                        employerAddress: req.body.employerAddress || findEmployee.employerAddress,
                                        firstDateOfEmployment: req.body.firstDateOfEmployment || findEmployee.firstDateOfEmployment,
                                        employerEIN: req.body.employerEIN || findEmployee.employerEIN,
                                        step2bLine1: req.body.step2bLine1 || findEmployee.step2bLine1,
                                        step2bLine2a: req.body.step2bLine2a || findEmployee.step2bLine2a,
                                        step2bLine2b: req.body.step2bLine2b || findEmployee.step2bLine2b,
                                        step2bLine2c: req.body.step2bLine2c || findEmployee.step2bLine2c,
                                        step2bLine3: req.body.step2bLine3 || findEmployee.step2bLine3,
                                        step2bLine4: req.body.step2bLine4 || findEmployee.step2bLine4,
                                        step4bLine1: req.body.step4bLine1 || findEmployee.step4bLine1,
                                        step4bLine2: req.body.step4bLine2 || findEmployee.step4bLine2,
                                        step4bLine3: req.body.step4bLine3 || findEmployee.step4bLine3,
                                        step4bLine4: req.body.step4bLine4 || findEmployee.step4bLine4,
                                        step4bLine5: req.body.step4bLine5 || findEmployee.step4bLine5,
                                };
                                let update = await fw4.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "FW4 add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getFW4 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await fw4.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No FW4 found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "FW4 found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteFW4 = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await fw4.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No FW4 found.", data: {} });
                }
                await fw4.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "FW4 delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createLrc1031A = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let findEmployee = await lrc1031A.findOne({ employeeId: user._id });
                        if (!findEmployee) {
                                req.body.employeeId = user._id;
                                req.body.adminId = user.adminId;
                                let newEmployee = await lrc1031A.create(req.body);
                                if (newEmployee) {
                                        return res.status(200).send({ status: 200, message: "Lrc1031A add successfully.", data: newEmployee });
                                }
                        } else {
                                let obj = {
                                        adminId: user._id,
                                        employeeId: user.adminId,
                                        firstName: req.body.firstName || findEmployee.firstName,
                                        lastName: req.body.lastName || findEmployee.lastName,
                                        middleName: req.body.middleName || findEmployee.middleName,
                                        birthDate: req.body.birthDate || findEmployee.birthDate,
                                        address: req.body.address || findEmployee.address,
                                        street: req.body.street || findEmployee.street,
                                        apartNumber: req.body.apartNumber || findEmployee.apartNumber,
                                        city: req.body.city || findEmployee.city,
                                        state: req.body.state || findEmployee.state,
                                        zipCode: req.body.zipCode || findEmployee.zipCode,
                                        checkDirected: req.body.checkDirected || findEmployee.checkDirected,
                                        checkDirectedData: req.body.checkDirectedData || findEmployee.checkDirectedData,
                                        checkAlso: req.body.checkAlso || findEmployee.checkAlso,
                                        isCertified: req.body.isCertified || findEmployee.isCertified,
                                        certificationSignature: req.body.certificationSignature || findEmployee.certificationSignature,
                                        certificationDate: req.body.certificationDate || findEmployee.certificationDate,
                                        notaryPublicCountryOf: req.body.notaryPublicCountryOf || findEmployee.notaryPublicCountryOf,
                                        notaryPublicDate: req.body.notaryPublicDate || findEmployee.notaryPublicDate,
                                        notaryPublicMonth: req.body.notaryPublicMonth || findEmployee.notaryPublicMonth,
                                        notaryPublicYear: req.body.notaryPublicYear || findEmployee.notaryPublicYear,
                                        notaryPublicCommissionExpiration: req.body.notaryPublicCommissionExpiration || findEmployee.notaryPublicCommissionExpiration,
                                        notaryPublicSignature: req.body.notaryPublicSignature || findEmployee.notaryPublicSignature,
                                        nonAppealableOffenses: req.body.nonAppealableOffenses || findEmployee.nonAppealableOffenses,
                                        appealable5YearsAfterConviction: req.body.appealable5YearsAfterConviction || findEmployee.appealable5YearsAfterConviction,
                                        appealableOffensesn: req.body.appealableOffensesn || findEmployee.appealableOffensesn,
                                };
                                let update = await lrc1031A.findOneAndUpdate({ employeeId: user._id }, { $set: obj }, { new: true });
                                if (update) {
                                        return res.status(200).send({ status: 200, message: "Lrc1031A add successfully.", data: update })
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getLrc1031A = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await lrc1031A.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No lrc1031A found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "lrc1031A found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteLrc1031A = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const tasks = await lrc1031A.findOne({ employeeId: user._id })
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No lrc1031A found.", data: {} });
                }
                await lrc1031A.findOneAndDelete({ employeeId: user._id })
                return res.status(200).send({ status: 200, message: "lrc1031A delete successfully.", data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
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
                const user = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.body.patientId, adminId: user.adminId, userType: "Patient" });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let obj = {
                        employeeId: user._id,
                        adminId: user.adminId,
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
                const user = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found or not registered", data: {} });
                }
                const patient = await User.findOne({ _id: req.body.patientId, adminId: user.adminId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                const consentFormData = {
                        employeeId: user._id,
                        adminId: user.adminId,
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
exports.createEmployeeTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found or not registered", data: {} });
                }
                const existingEmployee = await EmployeeTracking.findOne({ employeeId: user._id });
                if (!existingEmployee) {
                        req.body.employeeId = user._id;
                        req.body.employeeSignature = req.body.employeeSignature;
                        req.body.adminId = user.adminId;
                        if (req.files['CPRFirstAid']) {
                                req.body.CPRFirstAid = req.files['CPRFirstAid'][0].path;
                                req.body.CPRFirstAidExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['TBTestChestXray']) {
                                req.body.TBTestChestXray = req.files['TBTestChestXray'][0].path;
                                req.body.TBTestChestXrayExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['TBtestQuestionnaire']) {
                                req.body.TBtestQuestionnaire = req.files['TBtestQuestionnaire'][0].path;
                                req.body.TBtestQuestionnaireExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['FingerprintClearanceCard']) {
                                req.body.FingerprintClearanceCard = req.files['FingerprintClearanceCard'][0].path;
                                req.body.FingerprintClearanceCardExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['InfectiousControlTraining']) {
                                req.body.InfectiousControlTraining = req.files['InfectiousControlTraining'][0].path;
                                req.body.InfectiousControlTrainingExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['TBAnnualEducation']) {
                                req.body.TBAnnualEducation = req.files['TBAnnualEducation'][0].path;
                                req.body.TBAnnualEducationExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['FallPreventionandFallRecovery']) {
                                req.body.FallPreventionandFallRecovery = req.files['FallPreventionandFallRecovery'][0].path;
                                req.body.FallPreventionandFallRecoveryExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['APSSearch']) {
                                req.body.APSSearch = req.files['APSSearch'][0].path;
                                req.body.APSSearchExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['CPIPreventionandControl']) {
                                req.body.CPIPreventionandControl = req.files['CPIPreventionandControl'][0].path;
                                req.body.CPIPreventionandControlExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['Annualabuseandneglecttraining']) {
                                req.body.Annualabuseandneglecttraining = req.files['Annualabuseandneglecttraining'][0].path;
                                req.body.AnnualabuseandneglecttrainingExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['vacationPersonalTimeUsed']) {
                                req.body.vacationPersonalTimeUsed = req.files['vacationPersonalTimeUsed'][0].path;
                                req.body.vacationPersonalTimeUsedExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        const newConsentForm = await EmployeeTracking.create(req.body);
                        if (newConsentForm) {
                                return res.status(200).send({ status: 200, message: "Employee Tracking added successfully.", data: newConsentForm });
                        }
                } else {
                        existingEmployee.employeeSignature = req.body.employeeSignature;
                        existingEmployee.adminId = user.adminId;
                        if (req.files['CPRFirstAid']) {
                                existingEmployee.CPRFirstAid = req.files['CPRFirstAid'][0].path;
                                existingEmployee.CPRFirstAidExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['TBTestChestXray']) {
                                existingEmployee.TBTestChestXray = req.files['TBTestChestXray'][0].path;
                                existingEmployee.TBTestChestXrayExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['TBtestQuestionnaire']) {
                                existingEmployee.TBtestQuestionnaire = req.files['TBtestQuestionnaire'][0].path;
                                existingEmployee.TBtestQuestionnaireExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['FingerprintClearanceCard']) {
                                existingEmployee.FingerprintClearanceCard = req.files['FingerprintClearanceCard'][0].path;
                                existingEmployee.FingerprintClearanceCardExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['InfectiousControlTraining']) {
                                existingEmployee.InfectiousControlTraining = req.files['InfectiousControlTraining'][0].path;
                                existingEmployee.InfectiousControlTrainingExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['TBAnnualEducation']) {
                                existingEmployee.TBAnnualEducation = req.files['TBAnnualEducation'][0].path;
                                existingEmployee.TBAnnualEducationExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['FallPreventionandFallRecovery']) {
                                existingEmployee.FallPreventionandFallRecovery = req.files['FallPreventionandFallRecovery'][0].path;
                                existingEmployee.FallPreventionandFallRecoveryExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['APSSearch']) {
                                existingEmployee.APSSearch = req.files['APSSearch'][0].path;
                                existingEmployee.APSSearchExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['CPIPreventionandControl']) {
                                existingEmployee.CPIPreventionandControl = req.files['CPIPreventionandControl'][0].path;
                                existingEmployee.CPIPreventionandControlExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['Annualabuseandneglecttraining']) {
                                existingEmployee.Annualabuseandneglecttraining = req.files['Annualabuseandneglecttraining'][0].path;
                                existingEmployee.AnnualabuseandneglecttrainingExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        if (req.files['vacationPersonalTimeUsed']) {
                                existingEmployee.vacationPersonalTimeUsed = req.files['vacationPersonalTimeUsed'][0].path;
                                existingEmployee.vacationPersonalTimeUsedExpireDate = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                        }
                        const updatedEmployee = await existingEmployee.save();
                        return res.status(200).json({ status: 200, message: 'Employee Tracking added successfully.', data: updatedEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
};
exports.getEmployeeTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await EmployeeTracking.findOne({ employeeId: user._id });
                if (!filteredTasks) {
                        return res.status(404).send({ status: 404, message: "No EmployeeTracking found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "EmployeeTracking found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getEmployeeTrackingById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await EmployeeTracking.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Employee tracking not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee tracking found.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createMars = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found or not registered", data: {} });
                }
                const patient = await User.findOne({ _id: req.body.patientId, adminId: user.adminId, userType: "Patient" });
                if (!patient) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                req.body.adminId = user.adminId;
                req.body.residentName = patient.firstName;
                req.body.dateOfBirth = patient.dateOfBirth;
                const newConsentForm = await mars.create(req.body);
                if (newConsentForm) {
                        const createMedicationStatusObject = async (requestBody) => {
                                let timeStatus = [];
                                let medicationStatus = [];
                                for (let l = 0; l < requestBody.length; l++) {
                                        let obs = {
                                                time: requestBody[l],
                                                status: ""
                                        };
                                        timeStatus.push(obs);
                                }
                                for (let i = 1; i <= 31; i++) {
                                        let dayObj = {
                                                date: i.toString(),
                                                timeStatus: [...timeStatus]
                                        };
                                        medicationStatus.push(dayObj);
                                }
                                return medicationStatus;
                        }
                        for (let z = 0; z < req.body.medicationsId.length; z++) {
                                let findMedicationEmployee = await medicationEmployee.findById({ _id: req.body.medicationsId[z] });
                                if (findMedicationEmployee) {
                                        let instruction = [];
                                        for (let i = 0; i < findMedicationEmployee.instruction.length; i++) {
                                                let isSelected = req.body.instruction[z].includes(findMedicationEmployee.instruction[i].instruction);
                                                let k = {
                                                        instruction: findMedicationEmployee.instruction[i].instruction,
                                                        select: isSelected,
                                                };
                                                instruction.push(k);
                                        }
                                        let obj = {
                                                adminId: user.adminId,
                                                patientId: req.body.patientId,
                                                month: req.body.month,
                                                year: req.body.year,
                                                MarsId: newConsentForm._id,
                                                name: findMedicationEmployee.name,
                                                instruction: instruction,
                                                medicationStatus: await createMedicationStatusObject(req.body.time),
                                        };
                                        const newConsentForm2 = await MarsMedications.create(obj);
                                        if (newConsentForm2) {
                                                let update = await mars.findByIdAndUpdate({ _id: newConsentForm._id }, { $push: { medications: newConsentForm2._id } }, { new: true })
                                        }
                                }
                        }
                        let update3 = await mars.findById({ _id: newConsentForm._id })
                        let obj1 = {
                                patientId: req.body.patientId,
                                title: 'New medication',
                                body: 'New medication come check now.',
                                forUser: "Patient"
                        }
                        await notification.create(obj1)
                        return res.status(200).send({ status: 200, message: "Mars added successfully.", data: update3 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
};
exports.getMars = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.params.patientId, userType: "Patient" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await mars.findOne({ patientId: user._id }).populate('medications');
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
exports.updateMarsStatus = async (req, res) => {
        try {
                const marsRecord = await MarsMedications.findOne({ MarsId: req.params.MarsId });
                if (!marsRecord) {
                        return res.status(404).send({ status: 404, message: "No mars found.", data: {} });
                }
                const { dateToUpdate, timeStatusToUpdate, remark, initials, timeStatusId } = req.body;
                const dateIndex = marsRecord.medicationStatus.findIndex(date => (date._id).toString() === dateToUpdate);
                if (dateIndex === -1) {
                        return res.status(404).send({ status: 404, message: "Date not found.", data: {} });
                }
                marsRecord.medicationStatus[dateIndex].timeStatus.forEach(timeStatus => {
                        if ((timeStatus._id).toString() === timeStatusId) {
                                timeStatus.status = timeStatusToUpdate;
                                timeStatus.remark = remark;
                                timeStatus.initials = initials;
                        }
                });
                await marsRecord.save();
                return res.status(200).send({ status: 200, message: "Time status updated successfully.", data: marsRecord });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.createTimeSheet = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found or not registered", data: {} });
                } else {
                        req.body.adminId = user.adminId;
                        const newConsentForm = await timeSheet.create(req.body);
                        if (newConsentForm) {
                                return res.status(200).send({ status: 200, message: "Create timeSheet successfully.", data: newConsentForm });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.attendanceMark = async (req, res) => {
        try {
                let user = await User.findOne({ _id: req.body.employeeId, });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found or not registered", data: {} });
                } else {
                        var currDate = new Date();
                        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        let hour = currDate.getHours();
                        let minute = currDate.getMinutes();
                        let second = currDate.getSeconds();
                        let year = currDate.getFullYear();
                        let month = currDate.getMonth() + 1;
                        let date = currDate.getDate();
                        let day = weekday[currDate.getDay()];
                        let dateMonth = await datemonthCalulate(date, month)
                        let fullDate = `${year}-${dateMonth}`
                        let attendanceFind = await attendanceModel.findOne({ userId: user._id, date: fullDate });
                        if (attendanceFind) {
                                if (req.body.lunch == "START") {
                                        if (attendanceFind.lunchType == "STOP") {
                                                let startBreak = await hourCalulate(hour, minute, second);
                                                let obj = {
                                                        startBreak: startBreak,
                                                        lunchType: "START"
                                                }
                                                let attendance = await attendanceModel.findOneAndUpdate({ date: fullDate, userId: user._id }, { $set: { lunchType: "START" }, $push: { lunch: obj } }, { new: true });
                                                if (attendance) {
                                                        response(res, SuccessCode.SUCCESS, attendance, SuccessMessage.TAKE_A_BREAK)
                                                }
                                        } else {
                                                response(res, ErrorCode.ALREADY_EXIST, attendanceFind, SuccessMessage.TAKE_A_BREAK)
                                        }
                                }
                                if (req.body.lunch == "STOP") {
                                        for (let i = 0; i < attendanceFind.lunch.length; i++) {
                                                if (attendanceFind.lunch[i].lunchType == "START") {
                                                        const element = attendanceFind.lunch[i].startBreak;
                                                        let timeTaken = await totalTime(element, hour, minute, second);
                                                        let stopBreak = await hourCalulate(hour, minute, second);
                                                        let hr = timeTaken.hr, min = timeTaken.min, sec = timeTaken.sec;
                                                        let totaltimeTake = hr + ':' + min + ':' + sec;
                                                        let obj = {
                                                                startBreak: element,
                                                                stopBreak: stopBreak,
                                                                timeTaken: totaltimeTake,
                                                                lunchType: "STOP"
                                                        }
                                                        await attendanceModel.findOneAndUpdate({ date: fullDate, userId: user._id }, { $pull: { 'lunch': { startBreak: element } } }, { new: true });
                                                        let attendance1 = await attendanceModel.findOneAndUpdate({ date: fullDate, userId: user._id }, { $set: { lunchType: "STOP" }, $push: { lunch: obj } }, { new: true });
                                                        if (attendance1.lunch.length == 1) {
                                                                let extra = attendance1.lunch[0].timeTaken;
                                                                let updateAttendance = await attendanceModel.findOneAndUpdate({ date: fullDate, userId: user._id }, { $set: { totalLunchtime: extra } }, { new: true });
                                                                if (updateAttendance) {
                                                                        return res.status(200).send({ status: 200, message: "Create attendance successfully.", data: updateAttendance });
                                                                }
                                                        } else {
                                                                let timeSum;
                                                                let extra = "00:00:00";
                                                                for (let i = 0; i < attendance1.lunch.length; i++) {
                                                                        let element = attendance1.lunch[i].timeTaken;
                                                                        timeSum = await addTimes(element, extra);
                                                                        extra = timeSum;
                                                                }
                                                                let updateAttendance = await attendanceModel.findOneAndUpdate({ date: fullDate, userId: user._id }, { $set: { totalLunchtime: timeSum } }, { new: true });
                                                                if (updateAttendance) {
                                                                        return res.status(200).send({ status: 200, message: "Create attendance successfully.", data: updateAttendance });
                                                                }
                                                        }
                                                }
                                        }
                                }
                        } else {
                                let startBreak = await hourCalulate(hour, minute, second);
                                let obj = {
                                        userId: user._id,
                                        adminId: user.adminId,
                                        currentDate: date,
                                        month: month,
                                        year: year,
                                        date: fullDate,
                                        day: day,
                                        lunch: [{
                                                startBreak: startBreak,
                                                lunchType: "START"
                                        }]
                                };
                                let result2 = await attendanceModel.create(obj);
                                return res.status(200).send({ status: 200, message: "Create attendance successfully.", data: result2 });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
// exports.attendanceMark = async (req, res) => {
//         try {
//                 let user = await userModel.findOne({ _id: req.userId, status: status.ACTIVE });
//                 if (!user) {
//                         response(res, ErrorCode.NOT_FOUND, {}, ErrorMessage.USER_NOT_FOUND);
//                 } else {
//                         var currDate = new Date();
//                         const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//                         let hour = currDate.getHours();
//                         let minute = currDate.getMinutes();
//                         let second = currDate.getSeconds();
//                         let year = currDate.getFullYear();
//                         let month = currDate.getMonth() + 1;
//                         let date = currDate.getDate();
//                         let day = weekday[currDate.getDay()];
//                         let dateMonth = await datemonthCalulate(date, month)
//                         let fullDate = `${dateMonth}-${year}`
//                         if (req.body.punchType == "IN") {
//                                 let shiftHr, shiftMin;
//                                 let findShift = await shiftTiming.findById({ _id: user.WorkingShiftId });
//                                 if (!findShift) {
//                                         shiftHr = 10;
//                                         shiftMin = 0;
//                                 } else {
//                                         shiftHr = findShift.startHr;
//                                         shiftMin = findShift.startMin;
//                                 }
//                                 let inType = await inTypeCalulate(hour, minute, shiftHr, shiftMin)
//                                 let punchIn = await hourCalulate(hour, minute, second);
//                                 let attendanceFind = await attendanceModel.findOne({ userId: user._id, date: fullDate });
//                                 if (attendanceFind) {
//                                         response(res, ErrorCode.ALREADY_EXIST, attendanceFind, SuccessMessage.ATTENDANCE_ALLREADY_MARK)
//                                 } else {
//                                         let obj = {
//                                                 userId: user._id,
//                                                 adminId: user.adminId,
//                                                 currentDate: date,
//                                                 month: month,
//                                                 year: year,
//                                                 date: fullDate,
//                                                 day: day,
//                                                 punchIn: punchIn,
//                                                 inType: inType,
//                                         };
//                                         let result2 = await attendanceModel.create(obj);
//                                         response(res, SuccessCode.SUCCESS, result2, SuccessMessage.ATTENDANCE_MARK)
//                                 }
//                         }
//                         if (req.body.punchType == "OUT") {
//                                 let shiftHr, shiftMin;
//                                 let findShift = await shiftTiming.findById({ _id: user.WorkingShiftId });
//                                 if (!findShift) {
//                                         shiftHr = 6;
//                                         shiftMin = 30;
//                                 } else {
//                                         shiftHr = findShift.endHr;
//                                         shiftMin = findShift.endMin;
//                                 }
//                                 if (req.body.lat && req.body.long) {
//                                         coordinates = [parseFloat(req.body.lat), parseFloat(req.body.long)]
//                                         req.body.punchOutLocation = { type: "Point", coordinates };
//                                 }
//                                 if (req.file) {
//                                         req.body.image = req.file.filename
//                                 } else {
//                                         req.body.image = ""
//                                 }
//                                 var start = `${findShift.startHr}:${findShift.startMin}:00`;
//                                 var end = `${shiftHr}:${shiftMin}: 00`;
//                                 let shiftTotalTime = await totalTime1(start, end);
//                                 let dateMonth = await datemonthCalulate(date, month)
//                                 let fullDate = `${dateMonth}-${year}`
//                                 let outType = await outTypeCalulate(hour, minute, shiftHr, shiftMin);
//                                 let punchOut = await hourCalulate(hour, minute, second);
//                                 let result2 = await attendanceModel.findOne({ userId: user._id, date: fullDate, });
//                                 let difference = await totalTime1(result2.punchIn, punchOut);
//                                 let lunchTime = result2.totalLunchtime || ("00" + ':' + "00" + ':' + "00");
//                                 let differenceAfterLunch = await totalTime(lunchTime, difference.hr, difference.min, difference.sec);
//                                 let smsResult = await findLocation(req.body.lat, req.body.long);
//                                 let punchOutLocationWord = smsResult.results[0].formatted_address;
//                                 let attendanceFind = await attendanceModel.findOne({ userId: user._id, date: fullDate });
//                                 let timeTakeInhr = differenceAfterLunch.hr;
//                                 let shiftTotalHr = shiftTotalTime.hr;
//                                 if (attendanceFind.inType == "LATEIN") {
//                                         if (outType == "ONTIME") {
//                                                 if (outType == "ONTIME" && timeTakeInhr == shiftTotalHr) {
//                                                         let obj = {
//                                                                 punchOut: punchOut,
//                                                                 punchOutSelfie: req.body.image,
//                                                                 punchOutLocation: req.body.punchOutLocation,
//                                                                 punchOutLocationWord: punchOutLocationWord,
//                                                                 outType: outType,
//                                                                 totalTime: difference.totalTime,
//                                                                 workingTime: differenceAfterLunch.totalTime,
//                                                                 dayStatus: dayStatus.FULLDAY
//                                                         }
//                                                         let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate, }, { $set: obj }, { new: true });
//                                                         response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK)
//                                                 }
//                                                 if (outType == "ONTIME" && timeTakeInhr > shiftTotalHr) {
//                                                         let hr = timeTakeInhr - difference.totalTime;
//                                                         let min = difference.min;
//                                                         let sec = difference.sec;
//                                                         let overTime = hr + ':' + min + ':' + sec;
//                                                         let obj = {
//                                                                 punchOut: punchOut,
//                                                                 punchOutSelfie: req.body.image,
//                                                                 punchOutLocation: req.body.punchOutLocation,
//                                                                 punchOutLocationWord: punchOutLocationWord,
//                                                                 outType: outType,
//                                                                 totalTime: difference.totalTime,
//                                                                 workingTime: differenceAfterLunch.totalTime,
//                                                                 dayStatus: dayStatus.OVERTIME,
//                                                                 overTime: overTime
//                                                         }
//                                                         let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate, }, { $set: obj }, { new: true });
//                                                         response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK)
//                                                 }
//                                                 if (outType == "ONTIME" && timeTakeInhr < shiftTotalHr) {
//                                                         let obj = {
//                                                                 punchOut: punchOut,
//                                                                 punchOutSelfie: req.body.image,
//                                                                 punchOutLocation: req.body.punchOutLocation,
//                                                                 punchOutLocationWord: punchOutLocationWord,
//                                                                 outType: outType,
//                                                                 totalTime: difference.totalTime,
//                                                                 workingTime: differenceAfterLunch.totalTime,
//                                                                 dayStatus: dayStatus.HALFDAY
//                                                         }
//                                                         let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate }, { $set: obj }, { new: true });
//                                                         response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK)
//                                                 }
//                                         } else if (outType == "EARLY_OUT") {
//                                                 if (timeTakeInhr >= shiftTotalHr / 2) {
//                                                         let obj = {
//                                                                 punchOut: punchOut,
//                                                                 punchOutSelfie: req.body.image,
//                                                                 punchOutLocation: req.body.punchOutLocation,
//                                                                 punchOutLocationWord: punchOutLocationWord,
//                                                                 outType: outType,
//                                                                 totalTime: difference.totalTime,
//                                                                 workingTime: differenceAfterLunch.totalTime,
//                                                                 dayStatus: dayStatus.HALFDAY
//                                                         }
//                                                         let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate }, { $set: obj }, { new: true });
//                                                         response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK);
//                                                 } else if (timeTakeInhr < shiftTotalHr / 2) {
//                                                         let obj = {
//                                                                 punchOut: punchOut,
//                                                                 punchOutSelfie: req.body.image,
//                                                                 punchOutLocation: req.body.punchOutLocation,
//                                                                 punchOutLocationWord: punchOutLocationWord,
//                                                                 outType: outType,
//                                                                 totalTime: difference.totalTime,
//                                                                 workingTime: differenceAfterLunch.totalTime,
//                                                                 dayStatus: dayStatus.ABSENT,
//                                                                 attendanceStatus: attendanceStatus.ABSENT
//                                                         }
//                                                         let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate }, { $set: obj }, { new: true });
//                                                         response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK);
//                                                 }
//                                         }
//                                 } else if (attendanceFind.inType == "ONTIME") {
//                                         if (timeTakeInhr == shiftTotalHr) {
//                                                 let obj = {
//                                                         punchOut: punchOut,
//                                                         punchOutSelfie: req.body.image,
//                                                         punchOutLocation: req.body.punchOutLocation,
//                                                         punchOutLocationWord: punchOutLocationWord,
//                                                         outType: outType,
//                                                         totalTime: difference.totalTime,
//                                                         workingTime: differenceAfterLunch.totalTime,
//                                                         dayStatus: dayStatus.FULLDAY
//                                                 }
//                                                 let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate, }, { $set: obj }, { new: true });
//                                                 response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK)
//                                         } else if (timeTakeInhr > shiftTotalHr) {
//                                                 let hr = timeTakeInhr - difference.totalTime;
//                                                 let min = difference.min;
//                                                 let sec = difference.sec;
//                                                 let overTime = hr + ':' + min + ':' + sec;
//                                                 let obj = {
//                                                         punchOut: punchOut,
//                                                         punchOutSelfie: req.body.image,
//                                                         punchOutLocation: req.body.punchOutLocation,
//                                                         punchOutLocationWord: punchOutLocationWord,
//                                                         outType: outType,
//                                                         totalTime: difference.totalTime,
//                                                         workingTime: differenceAfterLunch.totalTime,
//                                                         dayStatus: dayStatus.OVERTIME,
//                                                         overTime: overTime
//                                                 }
//                                                 let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate, }, { $set: obj }, { new: true });
//                                                 response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK)
//                                         } else if (timeTakeInhr < shiftTotalHr) {
//                                                 let obj = {
//                                                         punchOut: punchOut,
//                                                         punchOutSelfie: req.body.image,
//                                                         punchOutLocation: req.body.punchOutLocation,
//                                                         punchOutLocationWord: punchOutLocationWord,
//                                                         outType: outType,
//                                                         totalTime: difference.totalTime,
//                                                         workingTime: differenceAfterLunch.totalTime,
//                                                         dayStatus: dayStatus.HALFDAY,
//                                                 }
//                                                 let result3 = await attendanceModel.findOneAndUpdate({ userId: user._id, date: fullDate }, { $set: obj }, { new: true });
//                                                 response(res, SuccessCode.SUCCESS, result3, SuccessMessage.ATTENDANCE_MARK)
//                                         }
//                                 }
//                         }
//                 }
//         } catch (error) {
//                 ;
//                 response(res, ErrorCode.WENT_WRONG, error, ErrorMessage.SOMETHING_WRONG);
//         }
// };
const totalDays = async (startDate, endDate) => {
        var date1 = new Date(startDate);
        var date2 = new Date(endDate);
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Difference_In_Days + 1;
}
const datemonthCalulate = async (date, month) => {
        let month1, date1;
        if (month < 10) {
                month1 = '' + 0 + month;
        } else {
                month1 = month
        }
        if (date < 10) {
                date1 = '' + 0 + date;
        }
        else {
                date1 = date
        }
        let dateMonth = `${month1}-${date1}`;
        return dateMonth;
}
var getDaysArray = async (start, end) => {
        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
                arr.push(new Date(dt));
        }
        return arr;
};
const hourCalulate = async (hour, minute, second) => {
        let hr1, min1, sec1;
        if (hour < 10) {
                hr1 = '' + 0 + hour;
        } else {
                hr1 = hour
        }
        if (minute < 10) {
                min1 = '' + 0 + minute;
        } else {
                min1 = minute
        }
        if (second < 10) {
                sec1 = '' + 0 + second;
        } else {
                sec1 = second
        }
        let punchIn = hr1 + ':' + min1 + ':' + sec1;
        return punchIn;
};
const inTypeCalulate = async (hour, minute, shiftHr, shiftMin) => {
        let inType;
        if ((hour == shiftHr && minute == shiftMin) || (hour < shiftHr && minute >= shiftMin)) {
                inType = "ONTIME";
        } else if ((hour >= shiftHr) && (hour >= shiftHr)) {
                inType = "LATEIN";
        }
        return inType;
};
const outTypeCalulate = async (hour, minute, shiftHr, shiftMin) => {
        let outType;
        if ((hour == shiftHr && minute >= shiftMin) || (hour > shiftHr && minute >= "00")) {
                outType = "ONTIME";
        } else if (hour < shiftHr && minute >= 0) {
                outType = "EARLY_OUT";
        }
        return outType;
};
const totalTime = async (punchIn, outHour, outMinute, outSecond) => {
        var startTime = punchIn;
        var endTime = `${outHour}:${outMinute}: ${outSecond}`;
        var todayDate = moment(new Date()).format("MM-DD-YYYY"); //Instead of today date, We can pass whatever date        
        var startDate = new Date(`${todayDate} ${startTime}`);
        var endDate = new Date(`${todayDate} ${endTime}`);
        var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
        var hh = Math.floor(timeDiff / 1000 / 60 / 60);
        hh = ('0' + hh).slice(-2)
        timeDiff -= hh * 1000 * 60 * 60;
        var mm = Math.floor(timeDiff / 1000 / 60);
        mm = ('0' + mm).slice(-2)
        timeDiff -= mm * 1000 * 60;
        var ss = Math.floor(timeDiff / 1000);
        ss = ('0' + ss).slice(-2)
        let totalTime = `${hh}:${mm}:${ss}`
        let obj = {
                totalTime: totalTime,
                hr: hh,
                min: mm,
                sec: ss
        }
        return obj;
};
const totalTime1 = async (punchIn, punchOut) => {
        var startTime = punchIn;
        var endTime = punchOut;
        var todayDate = moment(new Date()).format("MM-DD-YYYY"); //Instead of today date, We can pass whatever date        
        var startDate = new Date(`${todayDate} ${startTime}`);
        var endDate = new Date(`${todayDate} ${endTime}`);
        var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
        var hh = Math.floor(timeDiff / 1000 / 60 / 60);
        hh = ('0' + hh).slice(-2)
        timeDiff -= hh * 1000 * 60 * 60;
        var mm = Math.floor(timeDiff / 1000 / 60);
        mm = ('0' + mm).slice(-2)
        timeDiff -= mm * 1000 * 60;
        var ss = Math.floor(timeDiff / 1000);
        ss = ('0' + ss).slice(-2)
        let totalTime = `${hh}:${mm}:${ss}`
        let obj = {
                totalTime: totalTime,
                hr: hh,
                min: mm,
                sec: ss
        }
        return obj;
};
const addTimes = async (startTime, endTime) => {
        var times = [0, 0, 0]
        var max = times.length
        var a = (startTime || '').split(':')
        var b = (endTime || '').split(':')
        for (var i = 0; i < max; i++) {
                a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
                b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
        }
        for (var i = 0; i < max; i++) {
                times[i] = a[i] + b[i]
        }

        var hours = times[0]
        var minutes = times[1]
        var seconds = times[2]

        if (seconds >= 60) {
                var m = (seconds / 60) << 0
                minutes += m
                seconds -= 60 * m
        }

        if (minutes >= 60) {
                var h = (minutes / 60) << 0
                hours += h
                minutes -= 60 * h
        }
        return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
};