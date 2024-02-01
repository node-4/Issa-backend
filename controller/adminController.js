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
                let user1 = await AdminTracking.findOne({ name: req.body.name, adminId: user._id, });
                if (!user1) {
                        let obj = {
                                name: req.body.name,
                                dueDate: req.body.dueDate,
                                adminId: user._id,
                        };
                        const userCreate = await AdminTracking.create(obj);
                        return res.status(200).send({ status: 200, message: "Admin tracking add successfully ", data: userCreate, });
                } else {
                        return res.status(409).send({ status: 409, message: "Admin tracking already exit.", data: {}, });
                }
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
                let adminTracking1 = await AdminTracking.findOne({ _id: { $ne: adminTracking._id }, name: req.body.name, user: user._id });
                if (adminTracking1) {
                        return res.status(404).send({ status: 404, message: "Admin tracking already exit", data: {} });
                }
                adminTracking.name = req.body.Name || adminTracking.name;
                adminTracking.dueDate = req.body.DueDate || adminTracking.dueDate;
                adminTracking.completePer = req.body.completePer || adminTracking.completePer;
                adminTracking.complete = req.body.complete || adminTracking.complete;
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
exports.addIncidentReport = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let obj = {
                        residentsInvolved: req.body.residentsInvolved,
                        adminId: user.adminId,
                        name: "incidentReport",
                        employeesInvolved: req.body.employeesInvolved,
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
                const checklist = await notes.create(obj);
                if (checklist) {
                        let obj1 = {
                                residentsInvolved: req.body.residentsInvolved,
                                adminId: user.adminId,
                                employeesInvolved: req.body.employeesInvolved,
                                partId: checklist._id,
                                investigationDetails: req.body.investigationDetails,
                                investigationRecommendationsAndActions: req.body.investigationRecommendationsAndActions,
                                investigationFollowUp: req.body.investigationFollowUp,
                                investigationCompletedBy: req.body.investigationCompletedBy,
                                investigationCompletionDate: req.body.investigationCompletionDate,
                                partType: "B",
                        };
                        const checklist1 = await notes.create(obj1);
                        if (checklist1) {
                                return res.status(200).send({ status: 200, message: "Incident Report added successfully.", data: { checklist1, checklist } });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
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
exports.getAllNotes = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await notes.find({ adminId: user._id }).sort({ createdAt: -1 })
                if (tasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No Notes found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Notes found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
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
                        limit: Number(limit) || 15,
                        sort: { createdAt: -1 },
                };
                const users = await notes.find(filters)
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
                        let employeeSignature = `${user.firstName} ${user.lastName}`
                        let obj = {
                                administratorName: user.fullName || `${user.firstName} ${user.lastName}`,
                                administratorSignature: employeeSignature,
                                administratorDate: req.body.administratorDate,
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
                let findEmployee = await patientTracking.find({ adminId: user._id });
                if (!findEmployee) {
                        return res.status(404).send({ status: 404, message: "Patient tracking not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Patient tracking found.", data: findEmployee });
                }
        } catch (error) {
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
                let findData = await medicationEmployee.findOne({ adminId: user._id, name: req.body.name });
                if (findData) {
                        return res.status(409).send({ status: 409, message: "Medication employee already exit.", data: {} });
                } else {
                        req.body.adminId = user._id;
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
                const user1 = await medicationEmployee.findOne({ _id: req.params.id });
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
                        let obj = {
                                adminId: user._id,
                                name: req.body.name || user1.name,
                                instruction: req.body.instruction || user1.instruction,
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
                const tasks = await medicationEmployee.find({ adminId: user._id }).sort({ createdAt: -1 })
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
                                                companyName: req.body.companyName || findData.companyName,
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
                                                companyName: req.body.companyName,
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
