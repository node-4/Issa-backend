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
const bhrfTherapy = require('../model/GroupNotes/NotesLiabrary/bhrfTherapy');
const bhrfTherapyTopic = require('../model/GroupNotes/NotesLiabrary/bhrfTherapyTopic');
const news = require("../model/website/news");
const contact = require("../model/website/contactUs");
const faq = require("../model/website/faq");
const blogCategory = require("../model/website/blogCategory");
const blog = require("../model/website/blog");
const ebook = require("../model/website/ebook");
const demoRequest = require("../model/website/demoRequest");
const pricing = require("../model/website/pricing");
const oasisNotesSupport = require("../model/website/oasisNotesSupport");
const ourFeatures = require("../model/website/ourFeatures");
const banner = require("../model/website/banner");

exports.registration = async (req, res) => {
        const { mobileNumber, email } = req.body;
        try {
                req.body.email = email.split(" ").join("").toLowerCase();
                let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: mobileNumber }] }], userType: "SuperAdmin" });
                if (!user) {
                        req.body.password = bcrypt.hashSync(req.body.password, 8);
                        req.body.userType = "SuperAdmin";
                        req.body.accountVerification = true;
                        const userCreate = await User.create(req.body);
                        return res.status(200).send({ message: "registered successfully ", data: userCreate, });
                } else {
                        return res.status(409).send({ message: "Already Exist", data: [] });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.signin = async (req, res) => {
        try {
                const { email, password } = req.body;
                req.body.email = email.split(" ").join("").toLowerCase();
                const user = await User.findOne({ email: req.body.email, userType: "SuperAdmin" });
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
                const user = await User.findOne({ _id: req.user, userType: "SuperAdmin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                return res.status(200).send({ status: 200, message: "Profile get successfully.", data: user })
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.createAdmin = async (req, res) => {
        try {
                const { mobileNumber, email } = req.body;
                const user = await User.findOne({ _id: req.user, userType: "SuperAdmin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered", data: {} });
                }
                req.body.email = email.split(" ").join("").toLowerCase();
                let user1 = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: mobileNumber }] }], userType: "Admin" });
                if (!user1) {
                        req.body.password = bcrypt.hashSync(req.body.password, 8);
                        req.body.userType = "Admin";
                        req.body.accountVerification = true;
                        let user2 = await User.find({ userType: "Admin" }).count();
                        req.body.Id = `B${user2 + 1}`
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
exports.getAdminById = async (req, res) => {
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
exports.deleteAdmin = async (req, res) => {
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
exports.getAdmin = async (req, res) => {
        try {
                const superAdmin = await User.findOne({ _id: req.user, userType: "SuperAdmin" });
                if (!superAdmin) {
                        return res.status(403).send({ status: 403, message: "Unauthorized access", data: {} });
                }
                const filters = { userType: "Admin", userType: { $ne: "SuperAdmin" } };
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
exports.getAdminTracking = async (req, res) => {
        try {
                const user1 = await AdminTracking.find({}).populate({ path: 'adminId', select: "fullName firstName lastName" });
                if (user1.length == 0) {
                        return res.status(404).send({ status: 404, message: "Admin tracking not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Admin tracking fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAdmitDetails = async (req, res) => {
        try {
                const filters = { adminId: req.query.adminId };
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
                const users = await admitDetail.find(filters);
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
exports.getAllNotes = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await notes.find({}).sort({ createdAt: -1 }).populate({ path: 'adminId', select: "fullName firstName lastName" });
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No Notes found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Notes found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getAllReceipt = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await reciept.find({}).sort({ createdAt: -1 }).populate({ path: 'adminId', select: "fullName firstName lastName" });
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No tasks found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Reciept found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addPackage = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let findData = await package.findOne({ packageType: req.body.packageType });
                if (findData) {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                req.body.image = findData.image;
                        }
                        let obj = {
                                image: req.body.image,
                                description: req.body.description || findData.description,
                                packageType: findData.packageType,
                        }
                        let update = await package.findOneAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Package added successfully.", data: update });
                        }
                } else {
                        if (req.file) {
                                req.body.image = req.file.path;
                        }
                        const checklist = await package.create(req.body);
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Package added successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getPackageById = async (req, res) => {
        try {
                const user1 = await package.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Package not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Package fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllPackage = async (req, res) => {
        try {
                const filteredTasks = await package.find({}).sort({ createdAt: -1 });
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No package found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Package found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deletePackage = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await package.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Package not found", data: {} });
                } else {
                        await package.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Package delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.addBhrfTherapy = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let findData = await bhrfTherapy.findOne({ title: req.body.title, subTitle: req.body.subTitle });
                if (findData) {
                        let obj = {
                                title: req.body.title || findData.title,
                                subTitle: req.body.title || findData.subTitle,
                        }
                        let update = await bhrfTherapy.findOneAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Bhrf Therapy added successfully.", data: update });
                        }
                } else {
                        let findData1 = await bhrfTherapy.findOne({ status: true });
                        if (findData1) {
                                req.body.status = false;
                                const checklist = await bhrfTherapy.create(req.body);
                                if (checklist) {
                                        return res.status(200).send({ status: 200, message: "Bhrf Therapy added successfully.", data: checklist });
                                }
                        } else {
                                const checklist = await bhrfTherapy.create(req.body);
                                if (checklist) {
                                        return res.status(200).send({ status: 200, message: "Bhrf Therapy added successfully.", data: checklist });
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getBhrfTherapyById = async (req, res) => {
        try {
                const user1 = await bhrfTherapy.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Bhrf Therapy not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Bhrf Therapy fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllBhrfTherapy = async (req, res) => {
        try {
                const filteredTasks = await bhrfTherapy.find({}).sort({ createdAt: -1 });
                if (filteredTasks.length === 0) {
                        return res.status(404).send({ status: 404, message: "No bhrf Therapy found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Bhrf Therapy found successfully.", data: filteredTasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.deleteBhrfTherapy = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await bhrfTherapy.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Bhrf Therapy not found", data: {} });
                } else {
                        await bhrfTherapy.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Bhrf Therapy delete successfully.", data: {} });
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
                let findData = await bhrfTherapyTopic.findOne({ bhrfTherapyId: req.body.bhrfTherapyId, topic: req.body.topic, addBy: "superAdmin" });
                if (findData) {
                        let obj = {
                                bhrfTherapyId: req.body.bhrfTherapyId || findData.bhrfTherapyId,
                                topic: req.body.topic || findData.topic,
                                notesSummary: req.body.notesSummary || findData.notesSummary,
                                planRecommendation: req.body.planRecommendation || findData.planRecommendation,
                                addBy: "superAdmin",
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
                                addBy: "superAdmin",
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
                const filteredTasks = await bhrfTherapyTopic.find({}).sort({ createdAt: -1 });
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
exports.createNews = async (req, res) => {
        try {
                var currDate = new Date();
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let year = currDate.getFullYear();
                let month = currDate.getMonth();
                let date = currDate.getDate();
                let monthName = months[month];
                let date1;
                if (date < 10) {
                        date1 = '' + 0 + date;
                }
                else {
                        date1 = date
                }
                let fullDate = `${date1} ${monthName} ${year}`;
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data = {
                        data: fullDate,
                        title: req.body.title,
                        image: image,
                        description: req.body.description,
                };
                const News = await news.create(data);
                return res.status(200).json({ message: "News add successfully.", status: 200, data: News });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateNews = async (req, res) => {
        try {
                const findData = await news.findById(req.params.id);
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                var currDate = new Date();
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let year = currDate.getFullYear();
                let month = currDate.getMonth();
                let date = currDate.getDate();
                let monthName = months[month];
                let date1;
                if (date < 10) {
                        date1 = '' + 0 + date;
                }
                else {
                        date1 = date
                }
                let fullDate = `${date1} ${monthName} ${year}`;
                const data = {
                        data: fullDate || findData.fullDate,
                        title: req.body.title || findData.title,
                        image: image || findData.image,
                        description: req.body.description || findData.description,
                };
                const News = await news.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "News update successfully.", status: 200, data: News });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getNews = async (req, res) => {
        try {
                const data = await news.find({})
                if (data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "news data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdNews = async (req, res) => {
        try {
                const data = await news.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "News data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteNews = async (req, res) => {
        try {
                const data = await news.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await news.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.addContactDetails = async (req, res) => {
        try {
                const user = await User.findById(req.user._id);
                if (!user) {
                        return res.status(404).send({ message: "not found" });
                } else {
                        let findContact = await contact.findOne();
                        if (findContact) {
                                let image;
                                if (req.file) {
                                        image = req.file.path
                                }
                                obj = {
                                        image: image,
                                        supportPhone: req.body.supportPhone || findContact.supportPhone,
                                        supportEmail: req.body.supportEmail || findContact.supportEmail,
                                        supportText: req.body.supportText || findContact.supportText,
                                        supportFax: req.body.supportFax || findContact.supportFax,
                                        fb: req.body.fb || findContact.fb,
                                        twitter: req.body.twitter || findContact.twitter,
                                        instagram: req.body.instagram || findContact.instagram,
                                        linkedIn: req.body.linkedIn || findContact.linkedIn,
                                        youtube: req.body.youtube || findContact.youtube,
                                        saleEmail: req.body.saleEmail || findContact.saleEmail,
                                        supportTrainingPhone: req.body.supportTrainingPhone || findContact.supportTrainingPhone,
                                        teamEmail: req.body.teamEmail || findContact.teamEmail,
                                        salePhone: req.body.salePhone || findContact.salePhone,
                                        saleFax: req.body.saleFax || findContact.saleFax,
                                        city: req.body.city || findContact.city,
                                        state: req.body.state || findContact.state,
                                        pincode: req.body.pincode || findContact.pincode,
                                        hours: req.body.hours || findContact.hours,
                                        technicalSupport: req.body.technicalSupport || findContact.technicalSupport,
                                        scheduleTraining: req.body.scheduleTraining || findContact.scheduleTraining,
                                        emergencyPhone: req.body.emergencyPhone || findContact.emergencyPhone
                                };
                                let updateContact = await contact.findByIdAndUpdate({ _id: findContact._id }, { $set: obj }, { new: true });
                                if (updateContact) {
                                        return res.status(200).json({ message: "Contact detail update successfully.", status: 200, data: updateContact });
                                }
                        } else {
                                if (req.file) {
                                        req.body.image = req.file.path
                                }
                                let result2 = await contact.create(req.body);
                                if (result2) {
                                        return res.status(200).json({ message: "Contact detail add successfully.", status: 200, data: result2 });
                                }
                        }
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.viewContactDetails = async (req, res) => {
        try {
                let findcontactDetails = await contact.findOne({});
                if (!findcontactDetails) {
                        return res.status(404).json({ message: "Contact detail not found.", status: 404, data: {} });
                } else {
                        return res.status(200).json({ message: "Contact detail found successfully.", status: 200, data: findcontactDetails });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.addFaq = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let findData = await faq.findOne({});
                if (findData) {
                        let obj = {
                                title: req.body.title || findData.title,
                                description: req.body.description || findData.description,
                                faq: req.body.faq || findData.faq,
                                link: req.body.link || findData.link,
                        }
                        let update = await faq.findOneAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Faq update successfully.", data: update })
                        }
                } else {
                        const checklist = await faq.create(req.body);
                        if (checklist) {
                                return res.status(200).send({ status: 200, message: "Faq added successfully.", data: checklist });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.getFaqById = async (req, res) => {
        try {
                const user1 = await faq.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Faq not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Faq fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.deleteFaq = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found", data: {} });
                }
                const user1 = await faq.findOne({ _id: req.params.id });
                if (!user1) {
                        return res.status(404).send({ status: 404, message: "Faq not found", data: {} });
                } else {
                        await faq.findByIdAndDelete({ _id: user1._id })
                        return res.status(200).send({ status: 200, message: "Faq delete successfully.", data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
        }
};
exports.getAllFaq = async (req, res) => {
        try {
                const tasks = await faq.findOne({})
                if (!tasks) {
                        return res.status(404).send({ status: 404, message: "No Faq found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Faq found successfully.", data: tasks });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.addQuestionAnswerInFaq = async (req, res) => {
        try {
                const { question, answer } = req.body;
                let findBanner = await faq.findOne({});
                if (findBanner) {
                        let data = {
                                question: question,
                                answer: answer,
                        }
                        const newCategory = await faq.findByIdAndUpdate({ _id: findBanner._id }, { $push: { faq: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'faq update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'faq not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create faq' });
        }
};
exports.deleteQuestionAnswerInFaq = async (req, res) => {
        try {
                let findCart = await faq.findOne({});
                if (findCart) {
                        for (let i = 0; i < findCart.faq.length; i++) {
                                if (findCart.faq.length > 1) {
                                        if (((findCart.faq[i]._id).toString() == req.params.faqId) == true) {
                                                let updateCart = await faq.findByIdAndUpdate({ _id: findCart._id, 'faq._id': req.params.faqId }, {
                                                        $pull: {
                                                                'faq':
                                                                {
                                                                        _id: req.params.faqId,
                                                                        question: findCart.faq[i].question,
                                                                        answer: findCart.faq[i].answer,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "QuestionAnswer delete from faq.", data: updateCart, });
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
exports.createBlogCategory = async (req, res) => {
        try {
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data = {
                        title: req.body.title,
                        image: image,
                };
                const BlogCategory = await blogCategory.create(data);
                return res.status(200).json({ message: "BlogCategory add successfully.", status: 200, data: BlogCategory });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateBlogCategory = async (req, res) => {
        try {
                const findData = await blogCategory.findById(req.params.id);
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data = {
                        title: req.body.title || findData.title,
                        image: image || findData.image,
                };
                const BlogCategory = await blogCategory.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "BlogCategory update successfully.", status: 200, data: BlogCategory });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBlogCategory = async (req, res) => {
        try {
                const data = await blogCategory.find({})
                if (data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "blogCategory data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdBlogCategory = async (req, res) => {
        try {
                const data = await blogCategory.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "BlogCategory data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteBlogCategory = async (req, res) => {
        try {
                const data = await blogCategory.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).send({ msg: "deleted", data: data });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.createBlogNotes = async (req, res) => {
        try {
                const data = await blog.findOne({ type: "Notes" })
                if (data) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        } else {
                                image = data.image
                        }
                        const data1 = {
                                title: req.body.title || data.title,
                                description: req.body.description || data.description,
                                image: image,
                                type: "Notes",
                        };
                        const BlogCategory = await blog.findByIdAndUpdate({ _id: data._id }, { $set: data1 }, { new: true });
                        return res.status(200).json({ message: "Blog notes add successfully.", status: 200, data: BlogCategory });
                } else {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data1 = {
                                title: req.body.title,
                                description: req.body.description,
                                image: image,
                                type: "Notes",
                        };
                        const BlogCategory = await blog.create(data1);
                        return res.status(200).json({ message: "Blog notes add successfully.", status: 200, data: BlogCategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createBlogMain = async (req, res) => {
        try {
                const data = await blog.findOne({ type: "Main" })
                if (data) {
                        const data1 = {
                                title: req.body.title || data.title,
                                description: req.body.description || data.description,
                                type: "Main",
                        };
                        const BlogCategory = await blog.findByIdAndUpdate({ _id: data._id }, { $set: data1 }, { new: true });
                        return res.status(200).json({ message: "Blog main add successfully.", status: 200, data: BlogCategory });
                } else {
                        const data1 = {
                                title: req.body.title,
                                description: req.body.description,
                                type: "Main",
                        };
                        const BlogCategory = await blog.create(data1);
                        return res.status(200).json({ message: "Blog main add successfully.", status: 200, data: BlogCategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBlogMain = async (req, res) => {
        try {
                const data = await blog.findOne({ type: "Main" })
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Blog main data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getBlogNotes = async (req, res) => {
        try {
                const data = await blog.findOne({ type: "Notes" })
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Blog notes data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdBlog = async (req, res) => {
        try {
                const data = await blog.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "blog data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteBlog = async (req, res) => {
        try {
                const data = await blog.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).send({ msg: "deleted", data: data });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.createBlog = async (req, res) => {
        try {
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data1 = {
                        title: req.body.title,
                        description: req.body.description,
                        image: image,
                        type: "blog",
                };
                const BlogCategory = await blog.create(data1);
                return res.status(200).json({ message: "Blog add successfully.", status: 200, data: BlogCategory });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateBlog = async (req, res) => {
        try {
                const findData = await blog.findById(req.params.id);
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                let image;
                if (req.file.path) {
                        image = req.file.path;
                } else {
                        image = findData.image;
                }
                const data = {
                        title: req.body.title || findData.title,
                        description: req.body.description || findData.description,
                        type: findData.type,
                        image: image,
                };
                const BlogCategory = await blog.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "Blog update successfully.", status: 200, data: BlogCategory });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.addDescriptionArrayInBlog = async (req, res) => {
        try {
                const { title, description } = req.body;
                let findBanner = await blog.findOne({ _id: req.params.id });
                if (findBanner) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        let data = {
                                title: title,
                                description: description,
                                image: image
                        }
                        const newCategory = await blog.findByIdAndUpdate({ _id: findBanner._id }, { $push: { descriptionArray: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'blog update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'blog not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create faq' });
        }
};
exports.deleteDescriptionArrayInBlog = async (req, res) => {
        try {
                let findCart = await blog.findOne({ _id: req.params.id });
                if (findCart) {
                        for (let i = 0; i < findCart.descriptionArray.length; i++) {
                                if (findCart.descriptionArray.length > 1) {
                                        if (((findCart.descriptionArray[i]._id).toString() == req.params.descriptionArrayId) == true) {
                                                let updateCart = await blog.findByIdAndUpdate({ _id: findCart._id, 'descriptionArray._id': req.params.descriptionArrayId }, {
                                                        $pull: {
                                                                'descriptionArray':
                                                                {
                                                                        _id: req.params.descriptionArrayId,
                                                                        title: findCart.descriptionArray[i].title,
                                                                        description: findCart.descriptionArray[i].description,
                                                                        image: findCart.descriptionArray[i].image,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Description Array delete from Blog.", data: updateCart, });
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
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createEbook = async (req, res) => {
        try {
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data = {
                        title: req.body.title,
                        image: image,
                        link: req.body.link
                };
                const Ebook = await ebook.create(data);
                return res.status(200).json({ message: "Ebook add successfully.", status: 200, data: Ebook });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateEbook = async (req, res) => {
        try {
                const findData = await ebook.findById(req.params.id);
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data = {
                        title: req.body.title || findData.title,
                        image: image || findData.image,
                        link: req.body.link || findData.link
                };
                const Ebook = await ebook.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "Ebook update successfully.", status: 200, data: Ebook });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getEbook = async (req, res) => {
        try {
                const data = await ebook.find({})
                if (data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "ebook data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdEbook = async (req, res) => {
        try {
                const data = await ebook.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Ebook data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteEbook = async (req, res) => {
        try {
                const data = await ebook.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).send({ msg: "deleted", data: data });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.createDemoRequest = async (req, res) => {
        try {
                const data = {
                        companyName: req.body.companyName,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        timeZone: req.body.timeZone,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        hearAboutUs: req.body.hearAboutUs,
                        describe: req.body.describe,
                };
                const DemoRequest = await demoRequest.create(data);
                return res.status(200).json({ message: "DemoRequest add successfully.", status: 200, data: DemoRequest });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.demoRequestClose = async (req, res) => {
        try {
                const findData = await demoRequest.findById(req.params.id);
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                const DemoRequest = await demoRequest.findByIdAndUpdate({ _id: findData._id }, { $set: { requestStatus: "Close" } }, { new: true })
                return res.status(200).json({ message: "DemoRequest Close successfully.", status: 200, data: DemoRequest });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getDemoRequest = async (req, res) => {
        try {
                const data = await demoRequest.find({})
                if (data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "demoRequest data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdDemoRequest = async (req, res) => {
        try {
                const data = await demoRequest.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "DemoRequest data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteDemoRequest = async (req, res) => {
        try {
                const data = await demoRequest.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await demoRequest.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.createPricingFAQ = async (req, res) => {
        try {
                const findData = await pricing.findOne({ type: "FAQ" });
                if (findData) {
                        const data = {
                                heading: req.body.heading || findData.heading,
                                subHeading: req.body.subHeading || findData.subHeading,
                                title: req.body.title || findData.title,
                                description: req.body.description || findData.description,
                                type: findData.type,
                        };
                        const BlogCategory = await pricing.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "pricing update successfully.", status: 200, data: BlogCategory });
                } else {
                        const data1 = {
                                heading: req.body.heading,
                                subHeading: req.body.subHeading,
                                title: req.body.title,
                                description: req.body.description,
                                type: "FAQ"
                        };
                        const BlogCategory = await pricing.create(data1);
                        return res.status(200).json({ message: "pricing add successfully.", status: 200, data: BlogCategory });
                }
        } catch (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPricingFAQ = async (req, res) => {
        try {
                const findData = await pricing.findOne({ type: "FAQ" });
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Pricing faq data found.", data: findData });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.addFaqInPricingFAQ = async (req, res) => {
        try {
                const { answer, question } = req.body;
                const findBanner = await pricing.findOne({ type: "FAQ" });
                if (findBanner) {
                        let data = {
                                answer: answer,
                                question: question,
                        }
                        const newCategory = await pricing.findByIdAndUpdate({ _id: findBanner._id }, { $push: { faqs: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Pricing faqs update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'Pricing faqs not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create faq' });
        }
};
exports.deleteFaqsInPricingFAQ = async (req, res) => {
        try {
                const findCart = await pricing.findOne({ type: "FAQ" });
                if (findCart) {
                        for (let i = 0; i < findCart.faqs.length; i++) {
                                if (findCart.faqs.length > 1) {
                                        if (((findCart.faqs[i]._id).toString() == req.params.faqsId) == true) {
                                                let updateCart = await pricing.findByIdAndUpdate({ _id: findCart._id, 'faqs._id': req.params.faqsId }, {
                                                        $pull: {
                                                                'faqs':
                                                                {
                                                                        _id: req.params.faqsId,
                                                                        question: findCart.faqs[i].question,
                                                                        answer: findCart.faqs[i].answer,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Description Array delete from Blog.", data: updateCart, });
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
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createPricing = async (req, res) => {
        try {
                const findData = await pricing.findOne({ type: "PRICING", till: req.body.till });
                if (findData) {
                        const data = {
                                totalUser: req.body.totalUser || findData.totalUser,
                                perUser: req.body.perUser || findData.perUser,
                                till: findData.till,
                                type: findData.type
                        };
                        const Ebook = await pricing.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "Ebook update successfully.", status: 200, data: Ebook });
                } else {
                        const data1 = {
                                totalUser: req.body.totalUser,
                                perUser: req.body.perUser,
                                till: req.body.till,
                                type: "PRICING"
                        };
                        const BlogCategory = await pricing.create(data1);
                        return res.status(200).json({ message: "pricing add successfully.", status: 200, data: BlogCategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPricing = async (req, res) => {
        try {
                const findData = await pricing.find({ type: "PRICING" });
                if (findData.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Pricing data found.", data: findData });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdPricing = async (req, res) => {
        try {
                const data = await pricing.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "pricing data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deletePricing = async (req, res) => {
        try {
                const data = await pricing.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await pricing.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.calculatePricing = async (req, res) => {
        try {
                if (req.body.noOfUser < 11) {
                        const data1 = await pricing.findOne({ till: "10" })
                        if (data1) {
                                let price = req.body.noOfUser * data1.perUser
                                return res.status(200).json({ status: 200, message: "pricing data found.", data: price });
                        }
                }
                if (req.body.noOfUser > 10 && req.body.noOfUser < 101) {
                        const data2 = await pricing.findOne({ till: "11-100" })
                        if (data2) {
                                let a, b, price;
                                const data1 = await pricing.findOne({ till: "10" })
                                if (data1) {
                                        a = 10 * data1.perUser
                                }
                                b = parseInt(req.body.noOfUser - 10) * data2.perUser;
                                price = parseInt(a) + parseInt(b);
                                return res.status(200).json({ status: 200, message: "pricing data found.", data: price });
                        }
                }
                if (req.body.noOfUser > 100) {
                        const data = await pricing.findOne({ till: "101+" })
                        if (data) {
                                const data2 = await pricing.findOne({ till: "11-100" })
                                if (data2) {
                                        let a, b, price;
                                        const data1 = await pricing.findOne({ till: "10" })
                                        if (data1) {
                                                a = 10 * data1.perUser
                                        }
                                        b = 90 * data2.perUser;
                                        c = parseInt(req.body.noOfUser - 100) * data.perUser;
                                        price = parseInt(a) + parseInt(b) + parseInt(c);
                                        return res.status(200).json({ status: 200, message: "pricing data found.", data: price });
                                }
                        }
                }
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.createOasisNotesSupport = async (req, res) => {
        try {
                const data = {
                        title: req.body.title,
                        description: req.body.description,
                };
                const OasisNotesSupport = await oasisNotesSupport.create(data);
                return res.status(200).json({ message: "OasisNotesSupport add successfully.", status: 200, data: OasisNotesSupport });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getIdOasisNotesSupport = async (req, res) => {
        try {
                const data = await oasisNotesSupport.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "OasisNotesSupport data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.updateOasisNotesSupport = async (req, res) => {
        try {
                const findData = await oasisNotesSupport.findById(req.params.id);
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data = {
                        title: req.body.title || findData.title,
                        description: req.body.description || findData.description,
                };
                const OasisNotesSupport = await oasisNotesSupport.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "OasisNotesSupport update successfully.", status: 200, data: OasisNotesSupport });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.deleteOasisNotesSupport = async (req, res) => {
        try {
                const data = await oasisNotesSupport.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await oasisNotesSupport.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.getOasisNotesSupport = async (req, res) => {
        try {
                const data = await oasisNotesSupport.find({})
                if (data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "oasisNotesSupport data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.createOurFeatures = async (req, res) => {
        try {
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data = {
                        title: req.body.title,
                        image: image,
                        description: req.body.description,
                };
                const OurFeatures = await ourFeatures.create(data);
                return res.status(200).json({ message: "OurFeatures add successfully.", status: 200, data: OurFeatures });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateOurFeatures = async (req, res) => {
        try {
                const findData = await ourFeatures.findById(req.params.id);
                if (!findData) {
                        return res.status(400).send({ msg: "not found" });
                }
                let image;
                if (req.file.path) {
                        image = req.file.path
                }
                const data = {
                        title: req.body.title || findData.title,
                        image: image || findData.image,
                        description: req.body.description || findData.description,
                };
                const OurFeatures = await ourFeatures.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "OurFeatures update successfully.", status: 200, data: OurFeatures });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getOurFeatures = async (req, res) => {
        try {
                const data = await ourFeatures.find({})
                if (data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "ourFeatures data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdOurFeatures = async (req, res) => {
        try {
                const data = await ourFeatures.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "OurFeatures data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteOurFeatures = async (req, res) => {
        try {
                const data = await ourFeatures.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await ourFeatures.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.createBottomBanner = async (req, res) => {
        try {
                const findData = await banner.findOne({ type: "BOTTOM" })
                if (findData) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data = {
                                heading: req.body.heading || findData.heading,
                                title: req.body.title || findData.title,
                                image: image || findData.image,
                                description: req.body.description || findData.description,
                                type: findData.type,
                        };
                        const Banner = await banner.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "Banner update successfully.", status: 200, data: Banner });
                } else {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data = {
                                heading: req.body.heading,
                                title: req.body.title,
                                image: image,
                                description: req.body.description,
                                type: "BOTTOM",
                        };
                        const Banner = await banner.create(data);
                        return res.status(200).json({ message: "Banner add successfully.", status: 200, data: Banner });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createTopBanner = async (req, res) => {
        try {
                const findData = await banner.findOne({ type: "TOP" })
                if (findData) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data = {
                                heading: req.body.heading || findData.heading,
                                title: req.body.title || findData.title,
                                image: image || findData.image,
                                description: req.body.description || findData.description,
                                type: findData.type,
                        };
                        const Banner = await banner.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "Banner update successfully.", status: 200, data: Banner });
                } else {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data = {
                                heading: req.body.heading,
                                title: req.body.title,
                                image: image,
                                description: req.body.description,
                                type: "TOP",
                        };
                        const Banner = await banner.create(data);
                        return res.status(200).json({ message: "Banner add successfully.", status: 200, data: Banner });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBanner = async (req, res) => {
        try {
                const data = await banner.find({})
                if (data.length == 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "banner data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getTopBanner = async (req, res) => {
        try {
                const data = await banner.findOne({ type: "TOP" })
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "banner data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getBottomBanner = async (req, res) => {
        try {
                const data = await banner.findOne({ type: "BOTTOM" })
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "banner data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdBanner = async (req, res) => {
        try {
                const data = await banner.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Banner data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteBanner = async (req, res) => {
        try {
                const data = await banner.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await banner.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};