const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const User = require('../model/userModel');
const AdminTracking = require('../model/Tracking/adminTracking');
const admitDetail = require('../model/admitDetail');
const task = require('../model/task');
const reciept = require('../model/reciept');
const appointment = require('../model/appointment');
// const firstAidChecklist = require('../model/Notes/firstAidChecklist');
// const fireEquipementMonitoring = require('../model/Notes/fireEquipementMonitoring');
// const evacuationAndFireDrill = require('../model/Notes/evacuationandFireDrill');
// const disasterDrill = require('../model/Notes/disasterDrill');
// const WeeklyVehicleInspectionChecklist = require('../model/Notes/WeeklyVehicleInspectionChecklist');
// const ClinicalOversight = require('../model/Notes/ClinicalOversight');
// const MonthlyVehicleInspection = require('../model/Notes/MonthlyVehicleInspection');
// const vanEmergencyInformationForm = require('../model/Notes/vanEmergencyInformationForm');
// const qualityManagement = require('../model/Notes/qualityManagement');
// const infectiousData = require('../model/Notes/infectiousData');
// const incidentReport = require('../model/Notes/incidentReport');
// const disasterPlanReview = require('../model/Notes/disasterPlanReview');
const notes = require('../model/Notes/notes');
const package = require('../model/package');
const staffSchedule = require('../model/GroupNotes/theropyNotes/staffSchedule');
const staffScheduleAdministrator = require('../model/GroupNotes/theropyNotes/staffScheduleAdministrator');
const bhrfTherapy = require('../model/GroupNotes/NotesLiabrary/bhrfTherapy');
const bhrfTherapyTopic = require('../model/GroupNotes/NotesLiabrary/bhrfTherapyTopic');
const timeOffRequest = require('../model/timeOffRequest/timeOffrequest');
const employeePerformanceReview = require('../model/EmployeePerformanceReview/employeePerformanceReview');
const patientTracking = require('../model/Tracking/patientTracking');
const patientVitals = require('../model/patientVitals/patientVitals');
const medicationEmployee = require('../model/Medication/employeeMedication/medicationEmployee');
const patientMedication = require('../model/Medication/patientMedication/patientMedication');
const offerLetter = require('../model/EmployeeInformation/offerLetter');
const jobDescription = require('../model/EmployeeInformation/jobDescription');
const notification = require('../model/notification')
const pricing = require("../model/website/pricing");
const transactionModel = require("../model/transactionModel")
// const stripe1 = require("stripe")('sk_test_51Kr67EJsxpRH9smipLQrIzDFv69P1b1pPk96ba1A4HJGYJEaR7cpAaU4pkCeAIMT9B46D7amC77I3eNEBTIRF2e800Y7zIPNTS'); // shahina test
const stripe1 = require("stripe")('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');
const stripe = require("stripe")('pk_live_51OVyc9JE613RQzRwA6tXmVD8oOGgCkgB2m8fl8N8vkQ18wcrMvAhDCXA9CdmKllvqvqnlGHZ8SrRDlJtk6tf3k9w00wq5liSG5');

exports.addStaffScheduleAdministrator = async (req, res) => {
        try {
                const user = await User.findById(req.user);
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let findStaffSchedule = await staffScheduleAdministrator.findOne({ adminId: user._id, year: req.body.year, month: req.body.month });
                if (findStaffSchedule) {
                        let findStaffSchedule1 = await staffScheduleAdministrator.findOneAndUpdate({ _id: findStaffSchedule._id }, {
                                registeredNurseAndNumber: req.body.registeredNurseAndNumber,
                                administratorAndNumber: req.body.administratorAndNumber,
                                bhtNameAndNumber: req.body.bhtNameAndNumber,
                        }, { upsert: true, new: true });
                        return res.status(200).send({ status: 200, message: "staff Schedule Administrator added successfully.", data: findStaffSchedule1 });
                } else {
                        let obj = {
                                adminId: user._id,
                                year: req.body.year,
                                month: req.body.month,
                                administratorAndNumber: req.body.administratorAndNumber,
                                registeredNurseAndNumber: req.body.registeredNurseAndNumber,
                                bhtNameAndNumber: req.body.bhtNameAndNumber,
                        };
                        let newEmployee = await staffScheduleAdministrator.create(obj);
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "staff Schedule Administrator added successfully.", data: newEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getStaffScheduleAdministratorForAdmin = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).json({ status: 404, message: "User not found! Not registered", data: {} });
                }
                let filter = { adminId: user._id };
                const year = req.query.year || moment().format('YYYY');
                const month = req.query.month || moment().format('MM');
                filter.year = year;
                filter.month = month;
                let findEmployee = await staffScheduleAdministrator.find(filter);
                if (findEmployee.length == 0) {
                        return res.status(404).json({ status: 404, message: "staff Schedule Administrator not found.", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "staff Schedule Administrator found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: "Server error" + error.message });
        }
}
exports.signin = async (req, res) => {
        try {
                const { email, password } = req.body;
                req.body.email = email.split(" ").join("").toLowerCase();
                const user = await User.findOne({ email: req.body.email, userType: "Admin" });
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
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
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
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let profilePic, logo;
                if (req.files['logo']) {
                        logo = req.files['logo'];
                        req.body.logo = logo[0].path;
                } else {
                        req.body.logo = user.logo
                }
                if (req.files['image']) {
                        profilePic = req.files['image'];
                        req.body.profilePic = profilePic[0].path;
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
                        companyName: req.body.companyName || user.companyName,
                        address: req.body.address || user.address,
                        proffession: req.body.proffession || user.proffession,
                        site1: req.body.site1 || user.site1,
                        site2: req.body.site2 || user.site2,
                        profilePic: req.body.profilePic,
                        logo: req.body.logo,
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
exports.createUser = async (req, res) => {
        try {
                const { mobileNumber, email } = req.body;
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                req.body.email = email.split(" ").join("").toLowerCase();
                let user1 = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: mobileNumber }] }], userType: req.body.userType });
                if (!user1) {
                        req.body.password = bcrypt.hashSync(req.body.password, 8);
                        req.body.accountVerification = true;
                        req.body.adminId = user._id;
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
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        }
                        let user2 = await User.find({ userType: req.body.userType, adminId: user._id }).count();
                        if (req.body.userType == "Patient") {
                                req.body.Id = `P${user2 + 1}`
                        }
                        if (req.body.userType == "Employee") {
                                req.body.Id = `E${user2 + 1}`
                        }
                        req.body.companyName = user.companyName;
                        const userCreate = await User.create(req.body);
                        return res.status(200).send({ message: "registered successfully ", data: userCreate, });
                } else {
                        return res.status(409).send({ message: "Already Exist", data: [] });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getUserById = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get user fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.providePermission = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let obj = {
                        userType: req.body.userType || user1.userType,
                        initialAssessment: req.body.initialAssessment || user1.initialAssessment,
                        nursingAssessment: req.body.nursingAssessment || user1.nursingAssessment,
                        treatmentPlan: req.body.treatmentPlan || user1.treatmentPlan,
                        faceSheet: req.body.faceSheet || user1.faceSheet,
                        safetyPlan: req.body.safetyPlan || user1.safetyPlan,
                        residentIntakes: req.body.residentIntakes || user1.residentIntakes,
                        permissionAdmin: req.body.permissionAdmin || user1.permissionAdmin,
                        permissionEmployee: req.body.permissionEmployee || user1.permissionEmployee,
                        permissionPatient: req.body.permissionPatient || user1.permissionPatient,
                        permissionPsychiatricProvider: req.body.permissionPsychiatricProvider || user1.permissionPsychiatricProvider,
                        permissionClaimSubmission: req.body.permissionClaimSubmission || user1.permissionClaimSubmission,
                        permissionAccessDocuments: req.body.permissionAccessDocuments || user1.permissionAccessDocuments,
                }
                let update = await User.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                if (update) {
                        return res.status(200).send({ status: 200, message: "Profile get successfully.", data: update })
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteUser = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await User.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        await User.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "User delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getUser = async (req, res) => {
        try {
                const superAdmin = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!superAdmin) {
                        return res.status(403).send({ status: 403, message: "Unauthorized access", data: {} });
                }
                const filters = { adminId: superAdmin._id };
                if (req.query.permissionAdmin) {
                        filters.permissionAdmin = req.query.permissionAdmin;
                }
                if (req.query.permissionEmployee) {
                        filters.permissionEmployee = req.query.permissionEmployee;
                }
                if (req.query.permissionPatient) {
                        filters.permissionPatient = req.query.permissionPatient;
                }
                if (req.query.permissionPsychiatricProvider) {
                        filters.permissionPsychiatricProvider = req.query.permissionPsychiatricProvider;
                }
                if (req.query.permissionClaimSubmission) {
                        filters.permissionClaimSubmission = req.query.permissionClaimSubmission;
                }
                if (req.query.userType) {
                        filters.userType = req.query.userType;
                }
                const users = await User.find(filters);
                if (users.length === 0) {
                        return res.status(404).send({ status: 404, message: "No users found matching the criteria", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Users fetched successfully.", data: users });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addAdminTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let obj = {
                        name: req.body.name,
                        dueDate: req.body.dueDate,
                        adminId: user._id,
                        location: req.body.location
                };
                const userCreate = await AdminTracking.create(obj);
                return res.status(200).send({ status: 200, message: "Admin tracking add successfully ", data: userCreate, });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAdminTrackingById = async (req, res) => {
        try {
                const user1 = await AdminTracking.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Admin tracking not found ! not registered", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Admin tracking fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateAdminTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found or not registered", data: {} });
                }
                let adminTracking = await AdminTracking.findOne({ _id: req.params.id, user: user._id });
                if (!adminTracking) {
                        return res.status(404).send({ status: 404, message: "Admin tracking not found", data: {} });
                }
                adminTracking.name = req.body.Name || adminTracking.name;
                adminTracking.dueDate = req.body.DueDate || adminTracking.dueDate;
                adminTracking.completePer = req.body.completePer || adminTracking.completePer;
                adminTracking.complete = req.body.complete || adminTracking.complete;
                adminTracking.location = req.body.location || adminTracking.location;
                let getDate = new Date();
                let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
                let formattedDate = getDate.toLocaleDateString('en-IN', options)
                adminTracking.lastUpdateDate = formattedDate;
                await adminTracking.save();
                return res.status(200).send({ status: 200, message: "Admin tracking updated successfully", data: adminTracking });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteAdminTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await AdminTracking.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Admin tracking not found", data: {} });
                } else {
                        await AdminTracking.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Admin tracking delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAdminTracking = async (req, res) => {
        try {
                const { fromDate, toDate, fromCompletePer, toCompletePer, page, limit } = req.query;
                let query = { adminId: req.user._id };
                if (fromCompletePer && !toCompletePer) {
                        query.completePer = { $gte: fromCompletePer };
                }
                if (!fromCompletePer && toCompletePer) {
                        query.completePer = { $lte: toCompletePer };
                }
                if (fromCompletePer && toCompletePer) {
                        query.$and = [
                                { completePer: { $gte: fromCompletePer } },
                                { completePer: { $lte: toCompletePer } },
                        ]
                }
                if (fromDate && !toDate) {
                        query.createdAt = { $gte: fromDate };
                }
                if (!fromDate && toDate) {
                        query.createdAt = { $lte: toDate };
                }
                if (fromDate && toDate) {
                        query.$and = [
                                { createdAt: { $gte: fromDate } },
                                { createdAt: { $lte: toDate } },
                        ]
                }
                let options = {
                        page: Number(page) || 1,
                        limit: Number(limit) || 15,
                        sort: { createdAt: -1 },
                        populate: ('')
                };
                let data = await AdminTracking.paginate(query, options);
                return res.status(200).json({ status: 200, message: "Product data found.", data: data });

        } catch (err) {
                console.log(err);
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.addAdmitDetails = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        const user1 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                        if (!user1) {
                                return res.status(404).send({ status: 404, message: "Patient not found.", data: {} });
                        } else {
                                let findData = await admitDetail.findOne({ patientId: user1._id, isDischarge: false });
                                if (findData) {
                                        return res.status(200).send({ status: 200, message: "Admit detail  for this patient already add.", data: findData, });
                                } else {
                                        let obj = {
                                                adminId: user._id,
                                                patientId: user1._id,
                                                ahcccsId: req.body.ahcccsId,
                                                dateOfBirth: user1.dateOfBirth,
                                                dateOfAdmit: req.body.dateOfAdmit,
                                        }
                                        const userCreate = await admitDetail.create(obj);
                                        return res.status(200).send({ status: 200, message: "Admin tracking add successfully ", data: userCreate, });
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAdmitDetailsById = async (req, res) => {
        try {
                const user1 = await admitDetail.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Admit detail not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Admit detail fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateAdmitDetails = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found or not registered", data: {} });
                }
                let adminTracking = await admitDetail.findOne({ _id: req.params.id });
                if (!adminTracking) {
                        return res.status(404).send({ status: 404, message: "Admit detail not found", data: {} });
                }
                let obj = {
                        dateOfDischarge: req.body.dateOfDischarge,
                        reasonOfDischarge: req.body.reasonOfDischarge,
                        isDischarge: true,
                }
                console.log(obj);
                let update = await admitDetail.findByIdAndUpdate({ _id: adminTracking._id }, { $set: obj }, { new: true })
                return res.status(200).send({ status: 200, message: "Admit detail updated successfully", data: update });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteAdmitDetails = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await admitDetail.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Admit detail not found", data: {} });
                } else {
                        await admitDetail.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Admit detail delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAdmitDetails = async (req, res) => {
        try {
                const filters = { adminId: req.user };
                if (req.query.search) {
                        filters.$or = [
                                { "reasonOfDischarge": { $regex: req.query.search, $options: "i" }, },
                        ]
                }
                if (req.query.fromDateOfAdmit && !req.query.toDateOfAdmit) {
                        filters.dateOfAdmit = { $gte: req.query.fromDateOfAdmit };
                }
                if (!req.query.fromDateOfAdmit && req.query.toDateOfAdmit) {
                        filters.dateOfAdmit = { $lte: req.query.toDateOfAdmit };
                }
                if (req.query.fromDateOfAdmit && req.query.toDateOfAdmit) {
                        filters.$and = [
                                { dateOfAdmit: { $gte: req.query.fromDateOfAdmit } },
                                { dateOfAdmit: { $lte: req.query.toDateOfAdmit } },
                        ];
                }
                if (req.query.fromDateOfBirth && !req.query.toDateOfBirth) {
                        filters.dateOfBirth = { $gte: req.query.fromDateOfBirth };
                }
                if (!req.query.fromDateOfBirth && req.query.toDateOfBirth) {
                        filters.dateOfBirth = { $lte: req.query.toDateOfBirth };
                }
                if (req.query.fromDateOfBirth && req.query.toDateOfBirth) {
                        filters.$and = [
                                { dateOfBirth: { $gte: req.query.fromDateOfBirth } },
                                { dateOfBirth: { $lte: req.query.toDateOfBirth } },
                        ];
                }
                if (req.query.fromDateOfDischarge && !req.query.toDateOfDischarge) {
                        filters.dateOfDischarge = { $gte: req.query.fromDateOfDischarge };
                }
                if (!req.query.fromDateOfDischarge && req.query.toDateOfDischarge) {
                        filters.dateOfDischarge = { $lte: req.query.toDateOfDischarge };
                }
                if (req.query.fromDateOfDischarge && req.query.toDateOfDischarge) {
                        filters.$and = [
                                { dateOfDischarge: { $gte: req.query.fromDateOfDischarge } },
                                { dateOfDischarge: { $lte: req.query.toDateOfDischarge } },
                        ];
                }
                let options = {
                        page: Number(req.query.page) || 1,
                        limit: Number(req.query.limit) || 15,
                        sort: { createdAt: -1 },
                };
                const users = await admitDetail.find(filters).populate('patientId');
                if (users.length === 0) {
                        return res.status(404).send({ status: 404, message: "No Admit detail found matching the criteria", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Admit detail successfully.", data: users });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addTask = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        let obj = {
                                title: req.body.title,
                                date: req.body.date,
                                time: req.body.time,
                                description: req.body.description,
                                adminId: user._id,
                        }
                        const userCreate = await task.create(obj);
                        return res.status(200).send({ status: 200, message: "Task add successfully ", data: userCreate, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getTaskById = async (req, res) => {
        try {
                const user1 = await task.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Task not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Task fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteTask = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await task.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Task not found", data: {} });
                } else {
                        await task.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Task delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.markAsDoneTask = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        const user1 = await task.findOne({ _id: req.params.id, user: user._id });
                        if (!user1) {
                                return res.status(404).send({ status: 404, message: "Task not found", data: {} });
                        } else {
                                let update = await task.findByIdAndUpdate({ _id: user1._id }, { $set: { complete: true } }, { new: true })
                                return res.status(200).send({ status: 200, message: "Task mark as done successfully.", data: update });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllTask = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await task.find({ adminId: user._id }).sort({ date: 1 });
                const filteredTasks = filterTasksByDate(tasks);
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No tasks found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Tasks found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
function filterTasksByDate(tasks) {
        const today = moment().startOf('day');
        const tomorrow = moment().add(1, 'days').startOf('day');
        const filteredTasks = {
                today: {},
                tomorrow: {},
                yesterday: {},
                week: {},
        };
        tasks.forEach((task) => {
                const taskDate = moment(task.date);
                const formattedDate = taskDate.format('DD MMM, ddd');
                if (taskDate.isSame(today, 'day')) {
                        filteredTasks.today[formattedDate] = filteredTasks.today[formattedDate] || [];
                        filteredTasks.today[formattedDate].push(task);
                } else if (taskDate.isSame(tomorrow, 'day')) {
                        filteredTasks.tomorrow[formattedDate] = filteredTasks.tomorrow[formattedDate] || [];
                        filteredTasks.tomorrow[formattedDate].push(task);
                } else if (taskDate.isAfter(today, 'day') && taskDate.isBefore(tomorrow, 'day')) {
                        filteredTasks.tomorrow[formattedDate] = filteredTasks.tomorrow[formattedDate] || [];
                        filteredTasks.tomorrow[formattedDate].push(task);
                } else if (taskDate.isAfter(today, 'day')) {
                        filteredTasks.week[formattedDate] = filteredTasks.week[formattedDate] || [];
                        filteredTasks.week[formattedDate].push(task);
                } else if (taskDate.isBefore(today, 'day')) {
                        filteredTasks.yesterday[formattedDate] = filteredTasks.yesterday[formattedDate] || [];
                        filteredTasks.yesterday[formattedDate].push(task);
                }
        });

        return filteredTasks;
}
exports.addReceipt = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found! Not registered.", data: {} });
                } else {
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
                                receiptName: req.body.receiptName,
                                uploadDate: uploadDate,
                                documentType: documentType,
                                document: document,
                                size: size,
                                adminId: user._id,
                        };
                        const userCreate = await reciept.create(obj);
                        return res.status(200).send({ status: 200, message: "Receipt added successfully", data: userCreate, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {}, });
        }
};
exports.getRecieptById = async (req, res) => {
        try {
                const user1 = await reciept.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Reciept not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Reciept fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllReceipt = async (req, res) => {
        try {
                const { fromDate, toDate, documentType, fromSize, toSize, page, limit } = req.query;
                let query = { adminId: req.user };
                if (documentType) {
                        filters.documentType = documentType;
                }
                if (fromSize && !toSize) {
                        query.size = { $gte: fromSize };
                }
                if (!fromSize && toSize) {
                        query.size = { $lte: toSize };
                }
                if (fromSize && toSize) {
                        query.$and = [
                                { size: { $gte: fromSize } },
                                { size: { $lte: toSize } },
                        ]
                }
                if (fromDate && !toDate) {
                        query.createdAt = { $gte: fromDate };
                }
                if (!fromDate && toDate) {
                        query.createdAt = { $lte: toDate };
                }
                if (fromDate && toDate) {
                        query.$and = [
                                { createdAt: { $gte: fromDate } },
                                { createdAt: { $lte: toDate } },
                        ]
                }
                let options = {
                        page: Number(page) || 1,
                        limit: Number(limit) || 15,
                        sort: { createdAt: -1 },
                        populate: ('')
                };
                let data = await reciept.paginate(query, options);
                return res.status(200).json({ status: 200, message: "Product data found.", data: data });

        } catch (err) {
                console.log(err);
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.addFirstAidChecklist = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "firstAidChecklist";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Checklist added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editFirstAidChecklist = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                date: req.body.date || user1.date,
                                location: req.body.location || user1.location,
                                janDate: req.body.janDate || user1.janDate,
                                febDate: req.body.febDate || user1.febDate,
                                marDate: req.body.marDate || user1.marDate,
                                AprDate: req.body.AprDate || user1.AprDate,
                                MayDate: req.body.MayDate || user1.MayDate,
                                JunDate: req.body.JunDate || user1.JunDate,
                                JulDate: req.body.JulDate || user1.JulDate,
                                AugDate: req.body.AugDate || user1.AugDate,
                                SeptDate: req.body.SeptDate || user1.SeptDate,
                                OctDate: req.body.OctDate || user1.OctDate,
                                NovDate: req.body.NovDate || user1.NovDate,
                                DecDate: req.body.DecDate || user1.DecDate,
                                firstAidChecklistData: req.body.firstAidChecklistData || user1.firstAidChecklistData,
                                AdhesiveStripBandages: req.body.AdhesiveStripBandages || user1.AdhesiveStripBandages,
                                AdhesiveTap: req.body.AdhesiveTap || user1.AdhesiveTap,
                                CPRMouthGuardShield: req.body.CPRMouthGuardShield || user1.CPRMouthGuardShield,
                                DisposableLatexGloves: req.body.DisposableLatexGloves || user1.DisposableLatexGloves,
                                NonStickSterilePads: req.body.NonStickSterilePads || user1.NonStickSterilePads,
                                RollerGauze: req.body.RollerGauze || user1.RollerGauze,
                                Scissors: req.body.Scissors || user1.Scissors,
                                SterileGuazeSquares: req.body.SterileGuazeSquares || user1.SterileGuazeSquares,
                                TriangularBandages: req.body.TriangularBandages || user1.TriangularBandages,
                                Tweezers: req.body.Tweezers || user1.Tweezers,
                                staff: req.body.staff || user1.staff
                        };
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Fire equipement monitoring update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addFireEquipementMonitoring = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "fireEquipementMonitoring";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Fire equipement monitoring added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editFireEquipementMonitoring = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                date: req.body.date || user1.date,
                                location: req.body.location || user1.location,
                                alaramDate: req.body.alaramDate || user1.alaramDate,
                                alaram: req.body.alaram || user1.alaram,
                                extinguisher: req.body.extinguisher || user1.extinguisher,
                                staff: req.body.staff || user1.staff
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Fire equipement monitoring update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addEvacuationAndFireDrill = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "evacuationAndFireDrill";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Evacuation And Fire Drill added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editEvacuationAndFireDrill = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                date: req.body.date || user1.date,
                                facititAddress: req.body.facititAddress || user1.facititAddress,
                                startTime: req.body.startTime || user1.startTime,
                                endTime: req.body.endTime || user1.endTime,
                                shift: req.body.shift || user1.shift,
                                evacuationPersonConduct: req.body.evacuationPersonConduct || user1.evacuationPersonConduct,
                                evacuationParticipatingEmployee: req.body.evacuationParticipatingEmployee || user1.evacuationParticipatingEmployee,
                                residentsAssistanceEmployee: req.body.residentsAssistanceEmployee || user1.residentsAssistanceEmployee,
                                noOfOccupantsEvacuated: req.body.noOfOccupantsEvacuated || user1.noOfOccupantsEvacuated,
                                fireAlaramActivationMethod: req.body.fireAlaramActivationMethod || user1.fireAlaramActivationMethod,
                                totalTimeOfEvacuationDrill: req.body.totalTimeOfEvacuationDrill || user1.totalTimeOfEvacuationDrill,
                                condition: req.body.condition || user1.condition,
                                unusualConditionText: req.body.unusualConditionText || user1.unusualConditionText,
                                unusualCondition: req.body.unusualCondition || user1.unusualCondition,
                                problemEncounteredDuringEvacuationDrill: req.body.problemEncounteredDuringEvacuationDrill || user1.problemEncounteredDuringEvacuationDrill,
                                recommendations: req.body.recommendations || user1.recommendations,
                                planAction: req.body.planAction || user1.planAction,
                                signatureofPersonCompletingDrill: req.body.signatureofPersonCompletingDrill || user1.signatureofPersonCompletingDrill,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addDisasterDrill = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "disasterDrill";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Disaster drill added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editDisasterDrill = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                date: req.body.date || user1.date,
                                facititAddress: req.body.facititAddress || user1.facititAddress,
                                tornado: req.body.tornado || user1.tornado,
                                structureDamage: req.body.structureDamage || user1.structureDamage,
                                fire: req.body.fire || user1.fire,
                                storm: req.body.storm || user1.storm,
                                earthQuake: req.body.earthQuake || user1.earthQuake,
                                bombThreat: req.body.bombThreat || user1.bombThreat,
                                terroristAct: req.body.terroristAct || user1.terroristAct,
                                other: req.body.other || user1.other,
                                beginTime: req.body.beginTime || user1.beginTime,
                                endTime: req.body.endTime || user1.endTime,
                                totalTime: req.body.totalTime || user1.totalTime,
                                staffPresent: req.body.staffPresent || user1.staffPresent,
                                contactManagerCoordinator: req.body.contactManagerCoordinator || user1.contactManagerCoordinator,
                                was911Called: req.body.was911Called || user1.was911Called,
                                anyInjuries: req.body.anyInjuries || user1.anyInjuries,
                                extinguisherTaken: req.body.extinguisherTaken || user1.extinguisherTaken,
                                relocatedTheResidents: req.body.relocatedTheResidents || user1.relocatedTheResidents,
                                relocatedTheResidentsData: req.body.relocatedTheResidentsData || user1.relocatedTheResidentsData,
                                otherDetailsData: req.body.otherDetailsData || user1.otherDetailsData,
                                recommendations: req.body.recommendations || user1.recommendations,
                                residentMedication: req.body.residentMedication || user1.residentMedication,
                                waterFoodAccessible: req.body.waterFoodAccessible || user1.waterFoodAccessible,
                                residentsAccounted: req.body.residentsAccounted || user1.residentsAccounted,
                                handleTheDisaster: req.body.handleTheDisaster || user1.handleTheDisaster,
                                commentsConcerns: req.body.commentsConcerns || user1.commentsConcerns,
                                title: req.body.title || user1.title,
                                personConductingTheDisasterDrill: req.body.personConductingTheDisasterDrill || user1.personConductingTheDisasterDrill,
                                conducatingDate: req.body.conducatingDate || user1.conducatingDate,
                                conducatingName: req.body.conducatingName || user1.conducatingName,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addWeeklyVehicleInspectionChecklist = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "WeeklyVehicleInspectionChecklist";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Weekly Vehicle Inspection Checklist added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editWeeklyVehicleInspectionChecklist = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                date: req.body.date || user1.date,
                                site: req.body.site || user1.site,
                                year: req.body.year || user1.year,
                                make: req.body.make || user1.make,
                                model: req.body.model || user1.model,
                                vehicleLicensePlate: req.body.vehicleLicensePlate || user1.vehicleLicensePlate,
                                lights: req.body.lights || user1.lights,
                                glass: req.body.glass || user1.glass,
                                fluidsAndLubricants: req.body.fluidsAndLubricants || user1.fluidsAndLubricants,
                                tires: req.body.tires || user1.tires,
                                mirrors: req.body.mirrors || user1.mirrors,
                                emergencyEquipment: req.body.emergencyEquipment || user1.emergencyEquipment,
                                general: req.body.general || user1.general,
                                staffName: req.body.staffName || user1.staffName,
                                staffSignature: req.body.staffSignature || user1.staffSignature,
                                inspectionDate: req.body.inspectionDate || user1.inspectionDate,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addClinicalOversight = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "ClinicalOversight";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Clinical Over sight added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
}
exports.editClinicalOversight = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                date: req.body.date || user1.date,
                                beginTime: req.body.beginTime || user1.beginTime,
                                endTime: req.body.endTime || user1.endTime,
                                lengthOfTime: req.body.lengthOfTime || user1.lengthOfTime,
                                conductedViaRemoteTeleConferenceWithAudioVideo: req.body.conductedViaRemoteTeleConferenceWithAudioVideo || user1.conductedViaRemoteTeleConferenceWithAudioVideo,
                                conductedViaInPerson: req.body.conductedViaInPerson || user1.conductedViaInPerson,
                                clinicalOversightTypeIndividual: req.body.clinicalOversightTypeIndividual || user1.clinicalOversightTypeIndividual,
                                clinicalOversightTypeGroup: req.body.clinicalOversightTypeGroup || user1.clinicalOversightTypeGroup,
                                participants: req.body.participants || user1.participants,
                                topicsAddressedUniqueTreatmentNeeds: req.body.topicsAddressedUniqueTreatmentNeeds || user1.topicsAddressedUniqueTreatmentNeeds,
                                topicsAddressedEnhancingSkills: req.body.topicsAddressedEnhancingSkills || user1.topicsAddressedEnhancingSkills,
                                topicsAddressedAssessmentOrTreatmentPlan: req.body.topicsAddressedAssessmentOrTreatmentPlan || user1.topicsAddressedAssessmentOrTreatmentPlan,
                                topicsAddressedStaffTrainingPlan: req.body.topicsAddressedStaffTrainingPlan || user1.topicsAddressedStaffTrainingPlan,
                                topicsAddressedJobDutiesDirection: req.body.topicsAddressedJobDutiesDirection || user1.topicsAddressedJobDutiesDirection,
                                additionalComments: req.body.additionalComments || user1.additionalComments,
                                opportunitiesForTraining: req.body.opportunitiesForTraining || user1.opportunitiesForTraining,
                                bhpNameAndCredentials: req.body.bhpNameAndCredentials || user1.bhpNameAndCredentials,
                                bhpSignature: req.body.bhpSignature || user1.bhpSignature,
                                administratorName: req.body.administratorName || user1.administratorName,
                                administratorSignature: req.body.administratorSignature || user1.administratorSignature,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
}
exports.addMonthlyVehicleInspection = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "MonthlyVehicleInspection";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Monthly Vehicle Inspection added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editMonthlyVehicleInspection = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                date: req.body.date || user1.date,
                                vehicle: req.body.vehicle || user1.vehicle,
                                dateOfLastService: req.body.dateOfLastService || user1.dateOfLastService,
                                dateOfNextService: req.body.dateOfNextService || user1.dateOfNextService,
                                itemsLights: req.body.itemsLights || user1.itemsLights,
                                itemsLightsComment: req.body.itemsLightsComment || user1.itemsLightsComment,
                                itemsTurnSignals: req.body.itemsTurnSignals || user1.itemsTurnSignals,
                                itemsTurnSignalsComment: req.body.itemsTurnSignalsComment || user1.itemsTurnSignalsComment,
                                itemsHorn: req.body.itemsHorn || user1.itemsHorn,
                                itemsHornComment: req.body.itemsHornComment || user1.itemsHornComment,
                                itemsWipers: req.body.itemsWipers || user1.itemsWipers,
                                itemsWipersComment: req.body.itemsWipersComment || user1.itemsWipersComment,
                                itemsAC: req.body.itemsAC || user1.itemsAC,
                                itemsACComment: req.body.itemsACComment || user1.itemsACComment,
                                itemsTires: req.body.itemsTires || user1.itemsTires,
                                itemsTiresComment: req.body.itemsTiresComment || user1.itemsTiresComment,
                                itemsSteering: req.body.itemsSteering || user1.itemsSteering,
                                itemsSteeringComment: req.body.itemsSteeringComment || user1.itemsSteeringComment,
                                itemsFluidLeaksGasOdor: req.body.itemsFluidLeaksGasOdor || user1.itemsFluidLeaksGasOdor,
                                itemsFluidLeaksGasOdorComment: req.body.itemsFluidLeaksGasOdorComment || user1.itemsFluidLeaksGasOdorComment,
                                itemsBodyDents: req.body.itemsBodyDents || user1.itemsBodyDents,
                                itemsBodyDentsComment: req.body.itemsBodyDentsComment || user1.itemsBodyDentsComment,
                                itemsMirrors: req.body.itemsMirrors || user1.itemsMirrors,
                                itemsMirrorsComment: req.body.itemsMirrorsComment || user1.itemsMirrorsComment,
                                itemsExternalCleanliness: req.body.itemsExternalCleanliness || user1.itemsExternalCleanliness,
                                itemsExternalCleanlinessComment: req.body.itemsExternalCleanlinessComment || user1.itemsExternalCleanlinessComment,
                                itemsInteriorCleanliness: req.body.itemsInteriorCleanliness || user1.itemsInteriorCleanliness,
                                itemsInteriorCleanlinessComment: req.body.itemsInteriorCleanlinessComment || user1.itemsInteriorCleanlinessComment,
                                itemsFirstAidKit: req.body.itemsFirstAidKit || user1.itemsFirstAidKit,
                                itemsFirstAidKitComment: req.body.itemsFirstAidKitComment || user1.itemsFirstAidKitComment,
                                itemsWater: req.body.itemsWater || user1.itemsWater,
                                itemsWaterComment: req.body.itemsWaterComment || user1.itemsWaterComment,
                                itemsFireExtinguisher: req.body.itemsFireExtinguisher || user1.itemsFireExtinguisher,
                                itemsBrakes: req.body.itemsBrakes || user1.itemsBrakes,
                                itemsFluidLeaksGasOdor: req.body.itemsFluidLeaksGasOdor || user1.itemsFluidLeaksGasOdor,
                                itemsBrakesComment: req.body.itemsBrakesComment || user1.itemsBrakesComment,
                                comments: req.body.comments || user1.comments,
                                inspectorSignature: req.body.inspectorSignature || user1.inspectorSignature,
                                inspectorDate: req.body.inspectorDate || user1.inspectorDate,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addVanEmergencyInformationForm = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "vanEmergencyInformationForm";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Van Emergency InformationForm added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editVanEmergencyInformationForm = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                residentName: req.body.residentName || user1.residentName,
                                dateOfBirth: req.body.dateOfBirth || user1.dateOfBirth,
                                facilityAddress: req.body.facilityAddress || user1.facilityAddress,
                                facilityPhoneNumber: req.body.facilityPhoneNumber || user1.facilityPhoneNumber,
                                guardianInformation: req.body.guardianInformation || user1.guardianInformation,
                                caseManagerInformation: req.body.caseManagerInformation || user1.caseManagerInformation,
                                BHRFAdministratorInformation: req.body.BHRFAdministratorInformation || user1.BHRFAdministratorInformation,
                                pharmacyHospital: req.body.pharmacyHospital || user1.pharmacyHospital,
                                preferredHospital: req.body.preferredHospital || user1.preferredHospital,
                                allergies: req.body.allergies || user1.allergies,
                                staffMemberName: req.body.staffMemberName || user1.staffMemberName,
                                staffMemberPhoneNumber: req.body.staffMemberPhoneNumber || user1.staffMemberPhoneNumber,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
}
exports.addQualityManagement = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "qualityManagement";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Quality Management added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editQualityManagement = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                dateOfBirth: req.body.dateOfBirth || user1.dateOfBirth,
                                areasImproved: req.body.areasImproved || user1.areasImproved,
                                dataCollectionPatientChart: req.body.dataCollectionPatientChart || user1.dataCollectionPatientChart,
                                dataCollectionIncidentReports: req.body.dataCollectionIncidentReports || user1.dataCollectionIncidentReports,
                                dataCollectionAdmissions: req.body.dataCollectionAdmissions || user1.dataCollectionAdmissions,
                                dataCollectionDischarges: req.body.dataCollectionDischarges || user1.dataCollectionDischarges,
                                dataCollectionClientsVisitedHospital: req.body.dataCollectionClientsVisitedHospital || user1.dataCollectionClientsVisitedHospital,
                                dataCollectionFalls: req.body.dataCollectionFalls || user1.dataCollectionFalls,
                                dataCollectionMedicationErrors: req.body.dataCollectionMedicationErrors || user1.dataCollectionMedicationErrors,
                                dataCollectionInfectiousDisease: req.body.dataCollectionInfectiousDisease || user1.dataCollectionInfectiousDisease,
                                dataCollectionClientsRefusingMedications: req.body.dataCollectionClientsRefusingMedications || user1.dataCollectionClientsRefusingMedications,
                                dataCollectionClientsRefusingAppointments: req.body.dataCollectionClientsRefusingAppointments || user1.dataCollectionClientsRefusingAppointments,
                                areasNonCompliance: req.body.areasNonCompliance || user1.areasNonCompliance,
                                trends: req.body.trends || user1.trends,
                                staffName: req.body.staffName || user1.staffName,
                                staffSignature: req.body.staffSignature || user1.staffSignature,
                                type: req.body.type || user1.type,
                                moreData: req.body.moreData || user1.moreData,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addInfectiousData = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "infectiousData";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Infectious Data added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editInfectiousData = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                data: req.body.data || user1.data,
                        }
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addIncidentReport = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let obj = {
                        residentsInvolved: req.body.residentsInvolved,
                        adminId: user._id,
                        name: "incidentReport",
                        employeesInvolved: req.body.employeesInvolved,
                        dateOfIncident: req.body.dateOfIncident,
                        timeOfIncident: req.body.timeOfIncident,
                        personObservingReporting: req.body.personObservingReporting,
                        levelOfSeverity: req.body.levelOfSeverity,
                        incidents: req.body.incidents,
                        eventDetails: req.body.eventDetails,
                        medicationErrorsMissedDose: req.body.medicationErrorsMissedDose,
                        medicationErrorsRefusedMedication: req.body.medicationErrorsRefusedMedication,
                        medicationErrorsWrongClient: req.body.medicationErrorsWrongClient,
                        medicationErrorsWrongTime: req.body.medicationErrorsWrongTime,
                        medicationErrorsWrongMed: req.body.medicationErrorsWrongMed,
                        medicationErrorsNone: req.body.medicationErrorsNone,
                        actionsTakenSenttoERHospital: req.body.actionsTakenSenttoERHospital,
                        actionsTakenFirstAid: req.body.actionsTakenFirstAid,
                        actionsTakenNoMedicalCareRequired: req.body.actionsTakenNoMedicalCareRequired,
                        CareRefused: req.body.CareRefused,
                        actionsTakenFireDepartmentCalled: req.body.actionsTakenFireDepartmentCalled,
                        actionsTakenPoliceCalled: req.body.actionsTakenPoliceCalled,
                        actionsTakenReferredtoAdministratorRiskManagement: req.body.actionsTakenReferredtoAdministratorRiskManagement,
                        actionsTakenMaintenanceCalledWorkOrderCompleted: req.body.actionsTakenMaintenanceCalledWorkOrderCompleted,
                        actionsTakenOther: req.body.actionsTakenOther,
                        actionsTakenOtherComment: req.body.actionsTakenOtherComment,
                        abuseNeglectInvolved: req.body.abuseNeglectInvolved,
                        abuseNeglectInvolvedifYes: req.body.abuseNeglectInvolvedifYes,
                        notificationsFamily: req.body.notificationsFamily,
                        notificationsGuardian: req.body.notificationsGuardian,
                        notificationsCaseManager: req.body.notificationsCaseManager,
                        notificationsOther: req.body.notificationsOther,
                        notificationIfOther: req.body.notificationIfOther,
                        notificationDate: req.body.notificationDate,
                        notificationTime: req.body.notificationTime,
                        modeEmail: req.body.modeEmail,
                        modePhoneCall: req.body.modePhoneCall,
                        modeInPerson: req.body.modeInPerson,
                        modeOther: req.body.modeOther,
                        modeOtherText: req.body.modeOtherText,
                        savedSignedPartA: req.body.savedSignedPartA,
                        reportCompletedBy: req.body.reportCompletedBy,
                        investigationDetails: req.body.investigationDetails,
                        investigationRecommendationsAndActions: req.body.investigationRecommendationsAndActions,
                        investigationFollowUp: req.body.investigationFollowUp,
                        investigationCompletedBy: req.body.investigationCompletedBy,
                        investigationCompletionDate: req.body.investigationCompletionDate,
                        savedSignedPartB: req.body.savedSignedPartB,
                        partTypeB: true,
                };
                let newEmployee = await notes.create(obj);
                if (newEmployee) {
                        return res.status(200).send({ status: 200, message: "Authorization For Release Of Information add successfully.", data: newEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.editIncidentReport = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                residentsInvolved: req.body.residentsInvolved || user1.residentsInvolved,
                                adminId: user1.adminId,
                                employeesInvolved: req.body.employeesInvolved || user1.employeesInvolved,
                                dateOfIncident: req.body.dateOfIncident || user1.dateOfIncident,
                                timeOfIncident: req.body.timeOfIncident || user1.timeOfIncident,
                                personObservingReporting: req.body.personObservingReporting || user1.personObservingReporting,
                                levelOfSeverity: req.body.levelOfSeverity || user1.levelOfSeverity,
                                incidents: req.body.incidents || user1.incidents,
                                eventDetails: req.body.eventDetails || user1.eventDetails,
                                medicationErrorsMissedDose: req.body.medicationErrorsMissedDose || user1.medicationErrorsMissedDose,
                                medicationErrorsRefusedMedication: req.body.medicationErrorsRefusedMedication || user1.medicationErrorsRefusedMedication,
                                medicationErrorsWrongClient: req.body.medicationErrorsWrongClient || user1.medicationErrorsWrongClient,
                                medicationErrorsWrongTime: req.body.medicationErrorsWrongTime || user1.medicationErrorsWrongTime,
                                medicationErrorsWrongMed: req.body.medicationErrorsWrongMed || user1.medicationErrorsWrongMed,
                                medicationErrorsNone: req.body.medicationErrorsNone || user1.medicationErrorsNone,
                                actionsTakenSenttoERHospital: req.body.actionsTakenSenttoERHospital || user1.actionsTakenSenttoERHospital,
                                actionsTakenFirstAid: req.body.actionsTakenFirstAid || user1.actionsTakenFirstAid,
                                actionsTakenNoMedicalCareRequired: req.body.actionsTakenNoMedicalCareRequired || user1.actionsTakenNoMedicalCareRequired,
                                CareRefused: req.body.CareRefused || user1.CareRefused,
                                actionsTakenFireDepartmentCalled: req.body.actionsTakenFireDepartmentCalled || user1.actionsTakenFireDepartmentCalled,
                                actionsTakenPoliceCalled: req.body.actionsTakenPoliceCalled || user1.actionsTakenPoliceCalled,
                                actionsTakenReferredtoAdministratorRiskManagement: req.body.actionsTakenReferredtoAdministratorRiskManagement || user1.actionsTakenReferredtoAdministratorRiskManagement,
                                actionsTakenMaintenanceCalledWorkOrderCompleted: req.body.actionsTakenMaintenanceCalledWorkOrderCompleted || user1.actionsTakenMaintenanceCalledWorkOrderCompleted,
                                actionsTakenOther: req.body.actionsTakenOther || user1.actionsTakenOther,
                                actionsTakenOtherComment: req.body.actionsTakenOtherComment || user1.actionsTakenOtherComment,
                                abuseNeglectInvolved: req.body.abuseNeglectInvolved || user1.abuseNeglectInvolved,
                                abuseNeglectInvolvedifYes: req.body.abuseNeglectInvolvedifYes || user1.abuseNeglectInvolvedifYes,
                                notificationsFamily: req.body.notificationsFamily || user1.notificationsFamily,
                                notificationsGuardian: req.body.notificationsGuardian || user1.notificationsGuardian,
                                notificationsCaseManager: req.body.notificationsCaseManager || user1.notificationsCaseManager,
                                notificationsOther: req.body.notificationsOther || user1.notificationsOther,
                                notificationIfOther: req.body.notificationIfOther || user1.notificationIfOther,
                                notificationDate: req.body.notificationDate || user1.notificationDate,
                                notificationTime: req.body.notificationTime || user1.notificationTime,
                                modeEmail: req.body.modeEmail || user1.modeEmail,
                                modePhoneCall: req.body.modePhoneCall || user1.modePhoneCall,
                                modeInPerson: req.body.modeInPerson || user1.modeInPerson,
                                modeOther: req.body.modeOther || user1.modeOther,
                                modeOtherText: req.body.modeOtherText || user1.modeOtherText,
                                savedSignedPartA: req.body.savedSignedPartA || user1.savedSignedPartA,
                                reportCompletedBy: req.body.reportCompletedBy || user1.reportCompletedBy,
                                investigationDetails: req.body.investigationDetails || user1.investigationDetails,
                                investigationRecommendationsAndActions: req.body.investigationRecommendationsAndActions || user1.investigationRecommendationsAndActions,
                                investigationFollowUp: req.body.investigationFollowUp || user1.investigationFollowUp,
                                investigationCompletedBy: req.body.investigationCompletedBy || user1.investigationCompletedBy,
                                investigationCompletionDate: req.body.investigationCompletionDate || user1.investigationCompletionDate,
                                savedSignedPartB: req.body.savedSignedPartB || user1.savedSignedPartB,
                                partTypeB: true,
                        };
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addDisasterPlanReview = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                req.body.name = "disasterPlanReview";
                const checklist = await notes.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Disaster Plan Review added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editDisasterPlanReview = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        let obj = {
                                adminId: user1.adminId,
                                facilityAddress: req.body.facilityAddress || user1.facilityAddress,
                                date: req.body.date || user1.date,
                                shiftTime: req.body.shiftTime || user1.shiftTime,
                                shift: req.body.shift || user1.shift,
                                participants: req.body.participants || user1.participants,
                                critiqueProblemsIdentified: req.body.critiqueProblemsIdentified || user1.critiqueProblemsIdentified,
                                recommendationsForImprovement: req.body.recommendationsForImprovement || user1.recommendationsForImprovement,
                                nextReviewDate: req.body.nextReviewDate || user1.nextReviewDate,
                                reviewCompletedByName: req.body.reviewCompletedByName || user1.reviewCompletedByName,
                                reviewCompletedBySignature: req.body.reviewCompletedBySignature || user1.reviewCompletedBySignature,
                                reviewCompletedByDate: req.body.reviewCompletedByDate || user1.reviewCompletedByDate,
                        };
                        const checklist = await notes.findByIdAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Evacuation and fire Drill update successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getNotesById = async (req, res) => {
        try {
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "notes not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get notes fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
// exports.getAllNotes = async (req, res) => {
//         try {
//                 const user = await User.findOne({ _id: req.user });
//                 if (!user) {
//                         return res.status(404).send({ status: 404, message: "User not found", data: {} });
//                 }
//                 const tasks = await notes.find({ adminId: user._id }).sort({ createdAt: -1 })
//                 if (tasks.length === 0) {
//                         return res.status(404).send({ status: 404, message: "No Notes found.", data: {} });
//                 } else {
//                         return res.status(200).send({ status: 200, message: "Notes found successfully.", data: tasks });
//                 }
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
//         }
// };
exports.getAllNotes = async (req, res) => {
        try {
                const { name, search, fromDate, toDate, page, limit } = req.query;
                const filters = { adminId: req.user };
                if (search) {
                        filters.$or = [
                                { "reasonOfDischarge": { $regex: search, $options: "i" }, },
                        ]
                }
                if (name) {
                        filters.$or = [
                                { "name": { $regex: name, $options: "i" }, },
                        ]
                }
                if (fromDate && !toDate) {
                        query.createdAt = { $gte: fromDate };
                }
                if (!fromDate && toDate) {
                        query.createdAt = { $lte: toDate };
                }
                if (fromDate && toDate) {
                        query.$and = [
                                { createdAt: { $gte: fromDate } },
                                { createdAt: { $lte: toDate } },
                        ]
                }
                let options = {
                        page: Number(page) || 1,
                        limit: Number(limit) || 1000,
                        sort: { createdAt: -1 },
                };
                const users = await notes.paginate(filters, options)
                if (users.length === 0) {
                        return res.status(404).send({ status: 404, message: "No Admit detail found matching the criteria", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Admit detail successfully.", data: users.docs });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteNotes = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await notes.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Note not found", data: {} });
                } else {
                        await notes.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Note delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addBhrfTherapyTopic = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let findData = await bhrfTherapyTopic.findOne({ bhrfTherapyId: req.body.bhrfTherapyId, topic: req.body.topic, addBy: "admin" });
                if (findData) {
                        let obj = {
                                bhrfTherapyId: req.body.bhrfTherapyId || findData.bhrfTherapyId,
                                topic: req.body.topic || findData.topic,
                                notesSummary: req.body.notesSummary || findData.notesSummary,
                                planRecommendation: req.body.planRecommendation || findData.planRecommendation,
                                addBy: "admin",
                                adminId: req.user._id
                        }
                        let update = await bhrfTherapyTopic.findOneAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "BhrfTherapy Topic added successfully.", data: update });
                        }
                } else {
                        let obj = {
                                bhrfTherapyId: req.body.bhrfTherapyId,
                                topic: req.body.topic,
                                notesSummary: req.body.notesSummary,
                                planRecommendation: req.body.planRecommendation,
                                addBy: "admin",
                                adminId: user._id
                        }
                        const checklist = await bhrfTherapyTopic.create(obj);
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "BhrfTherapy Topic added successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editBhrfTherapyTopic = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let findData = await bhrfTherapyTopic.findOne({ _id: req.params.id });
                if (findData) {
                        let findData1 = await bhrfTherapyTopic.findOne({ _id: { $ne: findData._id }, topic: req.body.topic });
                        if (findData1) {
                                return res.status(409).send({ status: 409, message: "BhrfTherapy Topic already exit.", data: findData });
                        }
                        let obj = {
                                bhrfTherapyId: req.body.bhrfTherapyId || findData.bhrfTherapyId,
                                topic: req.body.topic || findData.topic,
                                notesSummary: req.body.notesSummary || findData.notesSummary,
                                planRecommendation: req.body.planRecommendation || findData.planRecommendation,
                        }
                        let update = await bhrfTherapyTopic.findOneAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "BhrfTherapy Topic added successfully.", data: update });
                        }
                } else {
                        return res.status(404).send({ status: 404, message: "BhrfTherapy Topic not found.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getBhrfTherapyTopicById = async (req, res) => {
        try {
                const user1 = await bhrfTherapyTopic.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "BhrfTherapy Topic not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get BhrfTherapy Topic fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllBhrfTherapyTopic = async (req, res) => {
        try {
                console.log(req.user);
                const filteredTasks = await bhrfTherapyTopic.find({ $or: [{ adminId: req.user._id }, { addBy: "superAdmin" }], }).sort({ createdAt: -1 });
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
exports.deleteBhrfTherapyTopic = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await bhrfTherapyTopic.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "BhrfTherapy Topic not found", data: {} });
                } else {
                        await bhrfTherapyTopic.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "BhrfTherapy Topic delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllTimeOffRequestForAdmin = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                if (req.query.requestType != (null || undefined)) {
                        let findEmployee = await timeOffRequest.find({ adminId: user._id, requestType: req.query.requestType }).populate('employeeId');
                        if (findEmployee.length == 0) {
                                return res.status(404).send({ status: 404, message: "Time Off Request not found.", data: {} });
                        } else {
                                return res.status(200).send({ status: 200, message: "Time Off Request found.", data: findEmployee });
                        }
                } else {
                        let findEmployee = await timeOffRequest.find({ adminId: user._id }).populate('employeeId');
                        if (findEmployee.length == 0) {
                                return res.status(404).send({ status: 404, message: "Time Off Request not found.", data: {} });
                        } else {
                                return res.status(200).send({ status: 200, message: "Time Off Request found.", data: findEmployee });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateTimeOffRequestStatus = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await timeOffRequest.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Time off request  not found", data: {} });
                } else {
                        let update = await timeOffRequest.findOneAndUpdate({ _id: user1._id }, { $set: { status: req.body.status } }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Time off request update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllEmployeePerformanceReviewForAdmin = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await employeePerformanceReview.find({ adminId: user._id }).populate('employeeId');
                if (findEmployee.length == 0) {
                        return res.status(404).send({ status: 404, message: "Employee performance review not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Employee performance review found.", data: findEmployee });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateEmployeePerformanceReview = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await employeePerformanceReview.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Employee performance review  not found", data: {} });
                } else {
                        let obj = {
                                administratorName: user.fullName || `${user.firstName} ${user.lastName}`,
                                administratorSignature: req.body.administratorSignature || user1.administratorSignature,
                                administratorDate: req.body.administratorDate || user1.administratorDate,
                                administratorTime: req.body.administratorTime || user1.administratorTime,
                                name: req.body.name || user1.name,
                                date: req.body.date || user1.date,
                                employeeJobTitle: req.body.employeeJobTitle || user1.employeeJobTitle,
                                employeeManager: req.body.employeeManager || user1.employeeManager,
                                typeOfReview: req.body.typeOfReview || user1.typeOfReview,
                                employeeHireDate: req.body.employeeHireDate || user1.employeeHireDate,
                                ratingsPerformanceAndQualityOfWork: req.body.ratingsPerformanceAndQualityOfWork || user1.ratingsPerformanceAndQualityOfWork,
                                ratingsCommunication: req.body.ratingsCommunication || user1.ratingsCommunication,
                                ratingsProfessionalism: req.body.ratingsProfessionalism || user1.ratingsProfessionalism,
                                ratingsAttendanceAndPunctuality: req.body.ratingsAttendanceAndPunctuality || user1.ratingsAttendanceAndPunctuality,
                                ratingsTimeManagement: req.body.ratingsTimeManagement || user1.ratingsTimeManagement,
                                ratingsReliabilityDependability: req.body.ratingsReliabilityDependability || user1.ratingsReliabilityDependability,
                                overallRating: req.body.overallRating || user1.overallRating,
                                evaluation: req.body.evaluation || user1.evaluation,
                                additionalComments: req.body.additionalComments || user1.additionalComments,
                        }
                        let update = await employeePerformanceReview.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Employee performance review update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllPatientTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findEmployee = await patientTracking.find({ adminId: user._id }).populate('patientId');
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Patient tracking not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Patient tracking found.", data: findEmployee });
                }
        } catch (error) {
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateDueDateInPatientTracking = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                let findPatientTracking = await patientTracking.findOne({ _id: req.params.id });
                if (findPatientTracking) {
                        let obj = { dueDate: req.body.dueDate || findPatientTracking.dueDate };
                        let newEmployee = await patientTracking.findByIdAndUpdate({ _id: findPatientTracking._id }, { $set: obj }, { new: true });
                        if (newEmployee) {
                                return res.status(200).send({ status: 200, message: "Patient Tracking add successfully.", data: newEmployee });
                        }
                } else {
                        return res.status(404).send({ status: 404, message: "Patient Tracking not found.", data: {} });
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
exports.assignPatientToEmployee = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user2 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user2) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                } else {
                        const user3 = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                        if (!user3) {
                                return res.status(404).send({ status: 404, message: "Employee not found", data: {} });
                        } else {
                                if (!user2.employeesId.includes(req.body.employeeId)) {
                                        user2.employeesId.push(req.body.employeeId);
                                        await user2.save();
                                        return res.status(200).send({ status: 200, message: "Patient assigned to employee get successfully.", data: user2 })
                                } else {
                                        return res.status(200).json({ status: 200, message: "Patient is already assigned to employees" });
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.unAssignPatientToEmployee = async (req, res, next) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user2 = await User.findOne({ _id: req.body.patientId, userType: "Patient" });
                if (!user2) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                } else {
                        const user3 = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                        if (!user3) {
                                return res.status(404).send({ status: 404, message: "Employee not found", data: {} });
                        } else {
                                user2.employeesId.pull(req.body.employeeId);
                                await wishlist.save();
                                return res.status(200).json({ status: 200, message: "Removed  assigned Patient" });
                        }
                }
        } catch (error) {
                return res.status(500).send({ status: 500, message: "Server error", data: {} });
        }
};
exports.addMedicationEmployee = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const user2 = await User.findById({ _id: req.body.patientId });
                if (!user2) {
                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                }
                let findData = await medicationEmployee.findOne({ patientId: user2._id, name: req.body.name, medication: req.body.medication });
                if (findData) {
                        return res.status(409).send({ status: 409, message: "Medication employee already exit.", data: {} });
                } else {
                        req.body.adminId = user._id;
                        req.body.patientId = user2._id;
                        const checklist = await medicationEmployee.create(req.body);
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Medication employee added successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getMedicationEmployeeById = async (req, res) => {
        try {
                const user1 = await medicationEmployee.findOne({ _id: req.params.id }).populate('patientId');
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication employee not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Medication employee fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.updateMedicationEmployee = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await medicationEmployee.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication employee  not found", data: {} });
                } else {
                        let patientId;
                        if (req.body.patientId != (null || undefined)) {
                                const user2 = await User.findOne({ _id: req.body.patientId });
                                if (!user2) {
                                        return res.status(404).send({ status: 404, message: "Patient not found", data: {} });
                                } else {
                                        patientId = user2._id;
                                }
                        } else {
                                patientId = user1.patientId
                        }
                        let obj = {
                                adminId: user._id,
                                name: req.body.name || user1.name,
                                patientId: patientId,
                                medication: req.body.medication || user1.medication,
                        }
                        let update = await medicationEmployee.findOneAndUpdate({ _id: user1._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Medication employee update successfully.", data: update })
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteMedicationEmployee = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await medicationEmployee.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Medication employee not found", data: {} });
                } else {
                        await medicationEmployee.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Medication employee delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllMedicationEmployee = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await medicationEmployee.find({ adminId: user._id }).sort({ createdAt: -1 }).populate('patientId');
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
exports.addInstructionInMedicationEmployee = async (req, res) => {
        try {
                const { instruction } = req.body;
                let findBanner = await medicationEmployee.findOne({ _id: req.params.id });
                if (findBanner) {
                        let data = {
                                instruction: instruction,
                        }
                        const newCategory = await medicationEmployee.findByIdAndUpdate({ _id: findBanner._id }, { $push: { instruction: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'medication Employee update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'medication Employee not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create medication Employee' });
        }
};
exports.updateStatusInInstructionInMedicationEmployee = async (req, res) => {
        try {
                let findCart = await medicationEmployee.findOne({ _id: req.params.id });
                if (findCart) {
                        for (let i = 0; i < findCart.medication.length; i++) {
                                if (findCart.medication.length > 1) {
                                        if (((findCart.medication[i]._id).toString() == req.params.medicationId) == true) {
                                                let updateCart = await medicationEmployee.findByIdAndUpdate({ _id: findCart._id, 'medication._id': req.params.medicationId }, {
                                                        $set: {
                                                                'medication':
                                                                {
                                                                        _id: req.params.medicationId,
                                                                        status: req.body.status,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Instruction delete from medication Employee.", data: updateCart, });
                                                }
                                        }
                                } else {
                                        return res.status(200).send({ status: 200, message: "No Data Found ", data: [] });
                                }
                        }
                } else {
                        return res.status(200).send({ status: 200, message: "No Data Found ", cart: [] });
                }

        } catch (error) {
                console.log("353====================>", error)
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteInstructionInMedicationEmployee = async (req, res) => {
        try {
                let findCart = await medicationEmployee.findOne({ _id: req.params.id });
                if (findCart) {
                        for (let i = 0; i < findCart.instruction.length; i++) {
                                if (findCart.instruction.length > 1) {
                                        if (((findCart.instruction[i]._id).toString() == req.params.instructionId) == true) {
                                                let updateCart = await medicationEmployee.findByIdAndUpdate({ _id: findCart._id, 'instruction._id': req.params.instructionId }, {
                                                        $pull: {
                                                                'instruction':
                                                                {
                                                                        _id: req.params.instructionId,
                                                                        instruction: findCart.instruction[i].instruction,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Instruction delete from medication Employee.", data: updateCart, });
                                                }
                                        }
                                } else {
                                        return res.status(200).send({ status: 200, message: "No Data Found ", data: [] });
                                }
                        }
                } else {
                        return res.status(200).send({ status: 200, message: "No Data Found ", cart: [] });
                }

        } catch (error) {
                console.log("353====================>", error)
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createPatientMedication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found! Not registered.", data: {} });
                } else {
                        const user2 = await patientMedication.findOne({ _id: req.body.patientId });
                        if (user2) {
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
                                        patientId: user2.patientId,
                                        employeeId: user2.employeeId,
                                        adminId: user2.adminId,
                                        uploadDate: uploadDate,
                                        documentType: documentType,
                                        document: document,
                                        size: size,
                                };
                                const userCreate = await patientMedication.findByIdAndUpdate({ _id: user2._id }, { $set: obj }, { new: true });
                                return res.status(200).send({ status: 200, message: "PatientMedication added successfully", data: userCreate, });
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
                                        patientId: user1._id,
                                        employeeId: user1.employeeId,
                                        adminId: user._id,
                                        uploadDate: uploadDate,
                                        documentType: documentType,
                                        document: document,
                                        size: size,
                                };
                                const userCreate = await patientMedication.create(obj);
                                return res.status(200).send({ status: 200, message: "PatientMedication added successfully", data: userCreate, });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {}, });
        }
};
exports.getPatientMedicationById = async (req, res) => {
        try {
                const user1 = await patientMedication.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "PatientMedication not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get PatientMedication fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deletePatientMedication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await patientMedication.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "PatientMedication not found", data: {} });
                } else {
                        await patientMedication.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "PatientMedication delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllPatientMedication = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await patientMedication.find({ adminId: user._id }).sort({ createdAt: -1 }).populate('patientId')
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
exports.addOfferLetter = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        const user1 = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                        if (!user1) {
                                return res.status(404).send({ status: 404, message: "Employee not found.", data: {} });
                        } else {
                                let findData = await offerLetter.findOne({ employeeId: user1._id, adminId: user1.adminId });
                                if (findData) {
                                        let obj = {
                                                adminId: user1.adminId,
                                                employeeId: user1._id,
                                                employeeName: req.body.employeeName || findData.employeeName,
                                                companyName: user.companyName || findData.companyName,
                                                positionOffered: req.body.positionOffered || findData.positionOffered,
                                                startingPay: req.body.startingPay || findData.startingPay,
                                                startDate: req.body.startDate || findData.startDate,
                                                offerDate: req.body.offerDate || findData.offerDate,
                                                administratorsName: req.body.administratorsName || findData.administratorsName,
                                                administratorsSignature: req.body.administratorsSignature || findData.administratorsSignature,
                                                administratorsSignatureDate: req.body.administratorsSignatureDate || findData.administratorsSignatureDate,
                                        }
                                        const userCreate = await offerLetter.findByIdAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                                        return res.status(200).send({ status: 200, message: "Offer Letter add successfully ", data: userCreate, });
                                } else {
                                        let obj = {
                                                adminId: user1.adminId,
                                                employeeId: user1._id,
                                                employeeName: req.body.employeeName,
                                                companyName: user.companyName,
                                                positionOffered: req.body.positionOffered,
                                                startingPay: req.body.startingPay,
                                                startDate: req.body.startDate,
                                                offerDate: req.body.offerDate,
                                                administratorsName: req.body.administratorsName,
                                                administratorsSignature: req.body.administratorsSignature,
                                                administratorsSignatureDate: req.body.administratorsSignatureDate,
                                        }
                                        const userCreate = await offerLetter.create(obj);
                                        return res.status(200).send({ status: 200, message: "Offer Letter add successfully ", data: userCreate, });
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getOfferLetterById = async (req, res) => {
        try {
                const user1 = await offerLetter.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "OfferLetter not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get OfferLetter fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteOfferLetter = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await offerLetter.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "OfferLetter not found", data: {} });
                } else {
                        await offerLetter.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "OfferLetter delete successfully.", data: {} });
                }
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
                const filteredTasks = await offerLetter.find({ adminId: user._id }).sort({ createdAt: -1 })
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No OfferLetter found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "OfferLetter found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addJobDescription = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                } else {
                        const user1 = await User.findOne({ _id: req.body.employeeId, userType: "Employee" });
                        if (!user1) {
                                return res.status(404).send({ status: 404, message: "Employee not found.", data: {} });
                        } else {
                                let findData = await jobDescription.findOne({ employeeId: user1._id, adminId: user1.adminId });
                                if (findData) {
                                        let obj = {
                                                adminId: user1.adminId,
                                                employeeId: user1._id,
                                                jobDescription: req.body.jobDescription || findData.jobDescription,
                                                positionsSupervised: req.body.positionsSupervised || findData.positionsSupervised,
                                                primaryResponsibilities: req.body.primaryResponsibilities || findData.primaryResponsibilities,
                                                coreCompetencies: req.body.coreCompetencies || findData.coreCompetencies,
                                                minimumQualifications: req.body.minimumQualifications || findData.minimumQualifications,
                                                minimumDescription: req.body.minimumDescription || findData.minimumDescription,
                                                employeeInfoName: req.body.employeeInfoName || findData.employeeInfoName,
                                                pleaseNote: req.body.pleaseNote || findData.pleaseNote,
                                        }
                                        const userCreate = await jobDescription.findByIdAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                                        return res.status(200).send({ status: 200, message: "Offer Letter add successfully ", data: userCreate, });
                                } else {
                                        let obj = {
                                                adminId: user1.adminId,
                                                employeeId: user1._id,
                                                jobDescription: req.body.jobDescription,
                                                positionsSupervised: req.body.positionsSupervised,
                                                primaryResponsibilities: req.body.primaryResponsibilities,
                                                coreCompetencies: req.body.coreCompetencies,
                                                minimumQualifications: req.body.minimumQualifications,
                                                minimumDescription: req.body.minimumDescription,
                                                employeeInfoName: req.body.employeeInfoName,
                                                pleaseNote: req.body.pleaseNote,
                                        }
                                        const userCreate = await jobDescription.create(obj);
                                        return res.status(200).send({ status: 200, message: "Offer Letter add successfully ", data: userCreate, });
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getJobDescriptionById = async (req, res) => {
        try {
                const user1 = await jobDescription.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "JobDescription not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get JobDescription fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteJobDescription = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                const user1 = await jobDescription.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "JobDescription not found", data: {} });
                } else {
                        await jobDescription.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "JobDescription delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllJobDescription = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const filteredTasks = await jobDescription.find({ adminId: user._id }).sort({ createdAt: -1 })
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No JobDescription found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "JobDescription found successfully.", data: filteredTasks });
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
                        let findNotification = await notification.find({ adminId: admin._id, forUser: "Admin" }).populate('adminId employeeId patientId');
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
exports.sendNotification = async (req, res) => {
        try {
                let userData = await User.findById({ _id: req.body._id });
                if (!userData) {
                        return res.status(404).json({ status: 404, message: "Employee not found" });
                } else {
                        let obj = {
                                employeeId: userData._id,
                                adminId: userData.adminId,
                                title: req.body.title,
                                body: req.body.body,
                                date: req.body.date,
                                image: req.body.image,
                                time: req.body.time,
                                forUser: "Admin"
                        }
                        let data = await notification.create(obj)
                        if (data) {
                                let obj1 = {
                                        employeeId: userData._id,
                                        adminId: userData.adminId,
                                        title: req.body.title,
                                        body: req.body.body,
                                        date: req.body.date,
                                        image: req.body.image,
                                        time: req.body.time,
                                        forUser: "Employee"
                                }
                                await notification.create(obj1)
                                return res.status(200).json({ status: 200, message: "Notification send successfully.", data: data });
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.takeSubscription = async (req, res) => {
        try {
                const { email } = req.body;
                req.body.email = email.split(" ").join("").toLowerCase();
                const user = await User.findOne({ email: req.body.email, userType: "Admin" });
                if (!user) {
                        req.body.userType = "Admin";
                        req.body.accountVerification = true;
                        let user2 = await User.find({ userType: "Admin" }).count();
                        req.body.Id = `B${user2 + 1}`
                        const userCreate = await User.create(req.body);
                        if (userCreate) {
                                let id = req.params.id;
                                const findSubscription = await pricing.findById(id);
                                if (findSubscription) {
                                        const findTransaction = await transactionModel.findOne({ user: userCreate._id, type: "Subscription", Status: "pending" });
                                        if (findTransaction) {
                                                let deleteData = await transactionModel.findByIdAndDelete({ _id: findTransaction._id })
                                                let obj = {
                                                        user: userCreate._id,
                                                        subscriptionId: findSubscription._id,
                                                        amount: findSubscription.perUser,
                                                        paymentMode: req.body.paymentMode,
                                                        type: "Subscription",
                                                        Status: "pending",
                                                }
                                                let update = await transactionModel.create(obj);
                                                if (update) {
                                                        let line_items = [];
                                                        let obj2 = {
                                                                price_data: {
                                                                        currency: "usd",
                                                                        product_data: {
                                                                                name: `Subscription`,
                                                                        },
                                                                        unit_amount: `${Math.round(findSubscription.perUser * 100)}`,
                                                                },
                                                                quantity: 1,
                                                        }
                                                        line_items.push(obj2)
                                                        const session = await stripe1.checkout.sessions.create({
                                                                payment_method_types: ["card"],
                                                                success_url: `https://issa-website-website.vercel.app/paymet-successfull/${update._id}`,
                                                                cancel_url: `https://issa-website-website.vercel.app/paymet-failed/${update._id}`,
                                                                customer_email: userCreate.email,
                                                                client_reference_id: update._id,
                                                                line_items: line_items,
                                                                mode: "payment",
                                                        });
                                                        return res.status(200).json({ status: "success", session: session, });
                                                }
                                        } else {
                                                let obj = {
                                                        user: userCreate._id,
                                                        subscriptionId: findSubscription._id,
                                                        amount: findSubscription.perUser,
                                                        paymentMode: req.body.paymentMode,
                                                        type: "Subscription",
                                                        Status: "pending",
                                                        checkExpiration: new Date(Date.now() + 10 * 60 * 1000)
                                                }
                                                let update = await transactionModel.create(obj);
                                                if (update) {
                                                        let line_items = [];
                                                        let obj2 = {
                                                                price_data: {
                                                                        currency: "usd",
                                                                        product_data: {
                                                                                name: `Subscription`,
                                                                        },
                                                                        unit_amount: `${Math.round(findSubscription.perUser * 100)}`,
                                                                },
                                                                quantity: 1,
                                                        }
                                                        line_items.push(obj2)
                                                        const session = await stripe1.checkout.sessions.create({
                                                                payment_method_types: ["card"],
                                                                success_url: `https://issa-website-website.vercel.app/paymet-successfull/${update._id}`,
                                                                cancel_url: `https://issa-website-website.vercel.app/paymet-failed/${update._id}`,
                                                                customer_email: userCreate.email,
                                                                client_reference_id: update._id,
                                                                line_items: line_items,
                                                                mode: "payment",
                                                        });
                                                        return res.status(200).json({ status: "success", session: session, });
                                                }
                                        }
                                } else {
                                        return res.status(404).send({ status: 404, message: "Subscription not found" });
                                }
                        }
                } else {
                        let id = req.params.id;
                        const findSubscription = await pricing.findById(id);
                        if (findSubscription) {
                                const findTransaction = await transactionModel.findOne({ user: user._id, type: "Subscription", Status: "pending" });
                                if (findTransaction) {
                                        let deleteData = await transactionModel.findByIdAndDelete({ _id: findTransaction._id })
                                        let obj = {
                                                user: user._id,
                                                subscriptionId: findSubscription._id,
                                                amount: findSubscription.perUser,
                                                paymentMode: req.body.paymentMode,
                                                type: "Subscription",
                                                Status: "pending",
                                        }
                                        let update = await transactionModel.create(obj);
                                        if (update) {
                                                let line_items = [];
                                                let obj2 = {
                                                        price_data: {
                                                                currency: "usd",
                                                                product_data: {
                                                                        name: `Subscription`,
                                                                },
                                                                unit_amount: `${Math.round(findSubscription.perUser * 100)}`,
                                                        },
                                                        quantity: 1,
                                                }
                                                line_items.push(obj2)
                                                const session = await stripe1.checkout.sessions.create({
                                                        payment_method_types: ["card"],
                                                        success_url: `https://issa-website-website.vercel.app/paymet-successfull/${update._id}`,
                                                        cancel_url: `https://issa-website-website.vercel.app/paymet-failed/${update._id}`,
                                                        customer_email: user.email,
                                                        client_reference_id: update._id,
                                                        line_items: line_items,
                                                        mode: "payment",
                                                });
                                                return res.status(200).json({ status: "success", session: session, });
                                        }
                                } else {
                                        let obj = {
                                                user: user._id,
                                                subscriptionId: findSubscription._id,
                                                amount: findSubscription.perUser,
                                                paymentMode: req.body.paymentMode,
                                                type: "Subscription",
                                                Status: "pending",
                                                checkExpiration: new Date(Date.now() + 10 * 60 * 1000)
                                        }
                                        let update = await transactionModel.create(obj);
                                        if (update) {
                                                let line_items = [];
                                                let obj2 = {
                                                        price_data: {
                                                                currency: "usd",
                                                                product_data: {
                                                                        name: `Subscription`,
                                                                },
                                                                unit_amount: `${Math.round(findSubscription.perUser * 100)}`,
                                                        },
                                                        quantity: 1,
                                                }
                                                line_items.push(obj2)
                                                const session = await stripe1.checkout.sessions.create({
                                                        payment_method_types: ["card"],
                                                        success_url: `https://issa-website-website.vercel.app/paymet-successfull/${update._id}`,
                                                        cancel_url: `https://issa-website-website.vercel.app/paymet-failed/${update._id}`,
                                                        customer_email: user.email,
                                                        client_reference_id: update._id,
                                                        line_items: line_items,
                                                        mode: "payment",
                                                });
                                                return res.status(200).json({ status: "success", session: session, });
                                        }
                                }
                        } else {
                                return res.status(404).send({ status: 404, message: "Subscription not found" });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.verifySubscription = async (req, res) => {
        try {
                let findTransaction = await transactionModel.findOne({ _id: req.params.transactionId, type: "Subscription", Status: "pending" });
                if (findTransaction) {
                        if (req.body.Status == "Paid") {
                                let update = await transactionModel.findByIdAndUpdate({ _id: findTransaction._id }, { $set: { Status: "Paid" } }, { new: true });
                                if (update) {
                                        const findSubscription = await pricing.findById(update.subscriptionId);
                                        if (findSubscription) {
                                                let subscriptionExpiration = new Date();
                                                subscriptionExpiration.setMonth(subscriptionExpiration.getMonth() + 1);
                                                let updateUser = await User.findByIdAndUpdate({ _id: findTransaction.user }, { $set: { subscriptionId: findTransaction.subscriptionId, isSubscription: true, subscriptionExpiration: subscriptionExpiration } }, { new: true });
                                                return res.status(200).send({ status: 200, message: 'Subscription subscribed successfully.', data: update });
                                        }
                                }
                        }
                        if (req.body.Status == "failed") {
                                let update = await transactionModel.findByIdAndUpdate(
                                        { _id: findTransaction._id },
                                        { $set: { Status: "failed" } },
                                        { new: true }
                                );
                                if (update) {
                                        return res.status(200).send({ status: 200, message: 'Subscription not subscribed successfully.', data: update });
                                }
                        }
                } else {
                        return res.status(404).send({ status: 404, message: "Transaction not found" });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message });
        }
};
