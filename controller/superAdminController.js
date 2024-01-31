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
const trustedClient = require("../model/website/trustedClient");
const aboutUs = require("../model/website/aboutUs");
const whyChoosePharm = require("../model/website/whyChoosePharm");
const partner = require("../model/website/partner");
const downloadPage = require("../model/website/downloadPage");
const aboutUsOasisNotesSupport = require("../model/website/aboutUsOasisNotesSupport");
const staticContent = require('../model/website/staticContent');
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
exports.updateProfile = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user, userType: "SuperAdmin" });
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
exports.forgetPassword = async (req, res) => {
        try {
                const data = await User.findOne({ email: req.body.email, userType: "SuperAdmin" });
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
                const user = await User.findOne({ email: req.body.email, userType: "SuperAdmin" });
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
                const user = await User.findOne({ _id: req.params.id, userType: "SuperAdmin" });
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
                const filters = {};
                if (req.query.adminId) {
                        filter.adminId = req.query.adminId;
                }
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
                const users = await admitDetail.find(filters).populate('adminId patientId');
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
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};
exports.editBhrfTherapy = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                let findData1 = await bhrfTherapy.findOne({ _id: req.params.id });
                if (findData1) {
                        let obj = {
                                title: req.body.title || findData.title,
                                subTitle: req.body.subTitle || findData.subTitle,
                                status: req.body.status || findData.status,
                        }
                        let update = await bhrfTherapy.findOneAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).send({ status: 200, message: "Bhrf Therapy added successfully.", data: update });
                        }
                } else {
                        return res.status(404).send({ status: 404, message: "Bhrf Therapy not found", data: {} });
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
                } else {
                        image = findData.image
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
                } else {
                        date1 = date
                }
                let fullDate = `${date1} ${monthName} ${year}`;
                const data = {
                        data: fullDate || findData.fullDate,
                        title: req.body.title || findData.title,
                        image: image,
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
                const BlogCategory = await blog.findByIdAndUpdate({ _id: data._id }, { $set: { view: data.view + 1 } }, { new: true })
                return res.status(200).json({ status: 200, message: "blog data found.", data: BlogCategory });
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
                const data = await blogCategory.findById(req.body.blogCategoryId)
                if (!data) {
                        return res.status(400).send({ msg: "blogCategory not found" });
                }
                const data1 = {
                        title: req.body.title,
                        description: req.body.description,
                        blogCategoryId: req.body.blogCategoryId,
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
                let image, blogCategoryId;
                if (req.file.path) {
                        image = req.file.path;
                } else {
                        image = findData.image;
                }
                if (req.body.blogCategoryId != (null || undefined)) {
                        const data = await blogCategory.findById(req.body.blogCategoryId)
                        if (!data) {
                                return res.status(400).send({ msg: "blogCategory not found" });
                        }
                        blogCategoryId = req.body.blogCategoryId
                } else {
                        blogCategoryId = findData.blogCategoryId
                }
                const data = {
                        title: req.body.title || findData.title,
                        description: req.body.description || findData.description,
                        type: findData.type,
                        blogCategoryId: blogCategoryId,
                        image: image,
                };
                const BlogCategory = await blog.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "Blog update successfully.", status: 200, data: BlogCategory });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBlog = async (req, res) => {
        try {
                if (req.query.blogCategoryId != (null || undefined)) {
                        const data = await blog.find({ blogCategoryId: req.query.blogCategoryId, type: "blog" })
                        if (data.length == 0) {
                                return res.status(400).send({ msg: "not found" });
                        }
                        return res.status(200).json({ status: 200, message: "Blog notes data found.", data: data });
                }
                const data = await blog.find({ type: "blog" })
                if (data.length == 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Blog notes data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getBlogPopular = async (req, res) => {
        try {
                let data = await blog.find({ type: "blog" }).sort({ view: -1 })
                if (data.length == 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Blog notes data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
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
                return res.status(200).json({ message: "Thank you for submitting request, our team shortly connect with you.", status: 200, data: DemoRequest });
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
                const findData = await pricing.findOne({ name: req.body.name, type: "PRICING" });
                if (findData) {
                        const data = {
                                totalUser: req.body.totalUser || findData.totalUser,
                                perUser: req.body.perUser || findData.perUser,
                                name: findData.name,
                                type: findData.type,
                                details: req.body.details || findData.details
                        };
                        const Ebook = await pricing.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "Ebook update successfully.", status: 200, data: Ebook });
                } else {
                        const data1 = {
                                totalUser: req.body.totalUser,
                                perUser: req.body.perUser,
                                name: req.body.name,
                                type: "PRICING",
                                details: req.body.details
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
                        let image, descriptionArray = [];
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data = {
                                heading: req.body.heading || findData.heading,
                                title: req.body.title || findData.title,
                                image: image || findData.image,
                                description: req.body.description || findData.description,
                                descriptionArray: descriptionArray || findData.descriptionArray,
                                type: findData.type,
                        };
                        const Banner = await banner.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "Banner update successfully.", status: 200, data: Banner });
                } else {
                        let image, descriptionArray = []
                        if (req.file.path) {
                                image = req.file.path
                        }
                        if (req.body.descriptionArray.length > 0) {
                                for (let i = 0; i < req.body.descriptionArray.length; i++) {
                                        descriptionArray.push({ description: req.body.descriptionArray[i] })
                                }
                        }
                        const data = {
                                heading: req.body.heading,
                                title: req.body.title,
                                image: image,
                                description: req.body.description,
                                descriptionArray: descriptionArray,
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
exports.createTrustedClient = async (req, res) => {
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
                const TrustedClient = await trustedClient.create(data);
                return res.status(200).json({ message: "TrustedClient add successfully.", status: 200, data: TrustedClient });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateTrustedClient = async (req, res) => {
        try {
                const findData = await trustedClient.findById(req.params.id);
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
                const TrustedClient = await trustedClient.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                return res.status(200).json({ message: "TrustedClient update successfully.", status: 200, data: TrustedClient });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getTrustedClient = async (req, res) => {
        try {
                const data = await trustedClient.find({})
                if (data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "trustedClient data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdTrustedClient = async (req, res) => {
        try {
                const data = await trustedClient.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "TrustedClient data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteTrustedClient = async (req, res) => {
        try {
                const data = await trustedClient.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await trustedClient.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.createAboutUs = async (req, res) => {
        try {
                const findData = await aboutUs.findOne({})
                if (findData) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data = {
                                title: req.body.title || findData.title,
                                image: image || findData.image,
                                description: req.body.description || findData.description,
                        };
                        const AboutUs = await aboutUs.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "AboutUs update successfully.", status: 200, data: AboutUs });
                } else {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        const data = {
                                title: req.body.title,
                                image: image,
                                description: req.body.description,
                        };
                        const AboutUs = await aboutUs.create(data);
                        return res.status(200).json({ message: "AboutUs add successfully.", status: 200, data: AboutUs });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getAboutUs = async (req, res) => {
        try {
                const data = await aboutUs.findOne()
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "aboutUs data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdAboutUs = async (req, res) => {
        try {
                const data = await aboutUs.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "AboutUs data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteAboutUs = async (req, res) => {
        try {
                const data = await aboutUs.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await aboutUs.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.addInfoInAboutUs = async (req, res) => {
        try {
                const { name } = req.body;
                const findBanner = await aboutUs.findOne({});
                if (findBanner) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        let data = {
                                name: name,
                                image: image
                        }
                        const newCategory = await aboutUs.findByIdAndUpdate({ _id: findBanner._id }, { $push: { info: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'InfoInAboutUs update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'AboutUs not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create faq' });
        }
};
exports.deleteInfoInAboutUs = async (req, res) => {
        try {
                const findCart = await aboutUs.findOne({});
                if (findCart) {
                        for (let i = 0; i < findCart.info.length; i++) {
                                if (findCart.info.length > 1) {
                                        if (((findCart.info[i]._id).toString() == req.params.infoId) == true) {
                                                let updateCart = await aboutUs.findByIdAndUpdate({ _id: findCart._id, 'info._id': req.params.infoId }, {
                                                        $pull: {
                                                                'info':
                                                                {
                                                                        _id: req.params.infoId,
                                                                        name: findCart.info[i].name,
                                                                        image: findCart.info[i].image,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Info delete from aboutUs.", data: updateCart, });
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
exports.addCateInAboutUs = async (req, res) => {
        try {
                const { name } = req.body;
                const findBanner = await aboutUs.findOne({});
                if (findBanner) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        let data = {
                                name: name,
                                image: image
                        }
                        const newCategory = await aboutUs.findByIdAndUpdate({ _id: findBanner._id }, { $push: { cate: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'CateInAboutUs update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'AboutUs not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create faq' });
        }
};
exports.deleteCateInAboutUs = async (req, res) => {
        try {
                const findCart = await aboutUs.findOne({});
                if (findCart) {
                        for (let i = 0; i < findCart.cate.length; i++) {
                                if (findCart.cate.length > 1) {
                                        if (((findCart.cate[i]._id).toString() == req.params.cateId) == true) {
                                                let updateCart = await aboutUs.findByIdAndUpdate({ _id: findCart._id, 'cate._id': req.params.cateId }, {
                                                        $pull: {
                                                                'cate':
                                                                {
                                                                        _id: req.params.cateId,
                                                                        name: findCart.cate[i].name,
                                                                        image: findCart.cate[i].image,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Cate delete from aboutUs.", data: updateCart, });
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
exports.createWhyChoosePharm = async (req, res) => {
        try {
                const findData = await whyChoosePharm.findOne({})
                if (findData) {
                        const data = {
                                title: req.body.title || findData.title,
                                dataArray: req.body.dataArray || findData.dataArray,
                                description: req.body.description || findData.description,
                        };
                        const WhyChoosePharm = await whyChoosePharm.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "WhyChoosePharm update successfully.", status: 200, data: WhyChoosePharm });
                } else {
                        const data = {
                                title: req.body.title,
                                dataArray: req.body.dataArray,
                                description: req.body.description,
                        };
                        const WhyChoosePharm = await whyChoosePharm.create(data);
                        return res.status(200).json({ message: "WhyChoosePharm add successfully.", status: 200, data: WhyChoosePharm });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getWhyChoosePharm = async (req, res) => {
        try {
                const data = await whyChoosePharm.findOne()
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "whyChoosePharm data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdWhyChoosePharm = async (req, res) => {
        try {
                const data = await whyChoosePharm.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "WhyChoosePharm data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteWhyChoosePharm = async (req, res) => {
        try {
                const data = await whyChoosePharm.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await whyChoosePharm.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.deleteDataArrayInWhyChoosePharm = async (req, res) => {
        try {
                const findCart = await whyChoosePharm.findOne({});
                if (findCart) {
                        for (let i = 0; i < findCart.dataArray.length; i++) {
                                if (findCart.dataArray.length > 1) {
                                        if (((findCart.dataArray[i]._id).toString() == req.params.dataArrayId) == true) {
                                                let updateCart = await whyChoosePharm.findByIdAndUpdate({ _id: findCart._id, 'dataArray._id': req.params.dataArrayId }, {
                                                        $pull: {
                                                                'dataArray':
                                                                {
                                                                        _id: req.params.dataArrayId,
                                                                        name: findCart.dataArray[i].name,
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Data from dataArray delete from whyChoosePharm.", data: updateCart, });
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
exports.createPartner = async (req, res) => {
        try {
                const findData = await partner.findOne({})
                if (findData) {
                        const data = {
                                title: req.body.title || findData.title,
                                description: req.body.description || findData.description,
                        };
                        const Partner = await partner.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "Partner update successfully.", status: 200, data: Partner });
                } else {
                        const data = {
                                title: req.body.title,
                                description: req.body.description,
                        };
                        const Partner = await partner.create(data);
                        return res.status(200).json({ message: "Partner add successfully.", status: 200, data: Partner });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPartner = async (req, res) => {
        try {
                const data = await partner.findOne()
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "partner data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdPartner = async (req, res) => {
        try {
                const data = await partner.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "Partner data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deletePartner = async (req, res) => {
        try {
                const data = await partner.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await partner.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.addDataInPartner = async (req, res) => {
        try {
                const { description } = req.body;
                const findBanner = await partner.findOne({});
                if (findBanner) {
                        let image;
                        if (req.file.path) {
                                image = req.file.path
                        }
                        let data = {
                                description: description,
                                image: image
                        }
                        const newCategory = await partner.findByIdAndUpdate({ _id: findBanner._id }, { $push: { dataArray: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'InfoInPartner update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'Partner not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create faq' });
        }
};
exports.deleteDataArrayInPartner = async (req, res) => {
        try {
                const findCart = await partner.findOne({});
                if (findCart) {
                        for (let i = 0; i < findCart.dataArray.length; i++) {
                                if (findCart.dataArray.length > 1) {
                                        if (((findCart.dataArray[i]._id).toString() == req.params.dataArrayId) == true) {
                                                let updateCart = await partner.findByIdAndUpdate({ _id: findCart._id, 'dataArray._id': req.params.dataArrayId }, {
                                                        $pull: {
                                                                'dataArray':
                                                                {
                                                                        _id: req.params.dataArrayId,
                                                                        description: findCart.dataArray[i].description,
                                                                        image: findCart.dataArray[i].image
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Data from dataArray delete from partner.", data: updateCart, });
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
exports.createDownloadPage = async (req, res) => {
        try {
                const findData = await downloadPage.findOne({})
                if (findData) {
                        const data = {
                                window: req.body.window || findData.window,
                                mac: req.body.mac || findData.mac,
                                android: req.body.android || findData.android,
                                ios: req.body.ios || findData.ios,
                                specification: req.body.specification || findData.specification,
                                mobileCapability: req.body.mobileCapability || findData.mobileCapability,
                        };
                        const DownloadPage = await downloadPage.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "DownloadPage update successfully.", status: 200, data: DownloadPage });
                } else {
                        const data = {
                                window: req.body.window,
                                mac: req.body.mac,
                                android: req.body.android,
                                ios: req.body.ios,
                                specification: req.body.specification,
                                mobileCapability: req.body.mobileCapability,
                        };
                        const DownloadPage = await downloadPage.create(data);
                        return res.status(200).json({ message: "DownloadPage add successfully.", status: 200, data: DownloadPage });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getDownloadPage = async (req, res) => {
        try {
                const data = await downloadPage.findOne()
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "downloadPage data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdDownloadPage = async (req, res) => {
        try {
                const data = await downloadPage.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "DownloadPage data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteDownloadPage = async (req, res) => {
        try {
                const data = await downloadPage.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await downloadPage.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.createAboutUsOasisNotesSupport = async (req, res) => {
        try {
                const findData = await aboutUsOasisNotesSupport.findOne({ name: req.body.name })
                if (findData) {
                        return res.status(200).json({ message: "AboutUsOasisNotesSupport already exit.", status: 409, data: findData });
                } else {
                        const data = {
                                name: req.body.name,
                        };
                        const AboutUsOasisNotesSupport = await aboutUsOasisNotesSupport.create(data);
                        return res.status(200).json({ message: "AboutUsOasisNotesSupport add successfully.", status: 200, data: AboutUsOasisNotesSupport });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.editAboutUsOasisNotesSupport = async (req, res) => {
        try {
                const findData = await aboutUsOasisNotesSupport.findOne({ _id: req.params.id })
                if (findData) {
                        const data = {
                                name: req.body.name || findData.name,
                        };
                        const AboutUsOasisNotesSupport = await aboutUsOasisNotesSupport.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
                        return res.status(200).json({ message: "AboutUsOasisNotesSupport update successfully.", status: 200, data: AboutUsOasisNotesSupport });
                } else {
                        return res.status(404).json({ message: "AboutUsOasisNotesSupport not found.", status: 404, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getAboutUsOasisNotesSupport = async (req, res) => {
        try {
                const data = await aboutUsOasisNotesSupport.find()
                if (data.length == 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "aboutUsOasisNotesSupport data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.getIdAboutUsOasisNotesSupport = async (req, res) => {
        try {
                const data = await aboutUsOasisNotesSupport.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "AboutUsOasisNotesSupport data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
}
exports.deleteAboutUsOasisNotesSupport = async (req, res) => {
        try {
                const data = await aboutUsOasisNotesSupport.findById(req.params.id)
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                }
                const data1 = await aboutUsOasisNotesSupport.findByIdAndDelete(req.params.id);
                if (data1) {
                        return res.status(200).send({ msg: "deleted", data: data1 });
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message, });
        }
};
exports.addDataInAboutUsOasisNotesSupport = async (req, res) => {
        try {
                const { title, link } = req.body;
                const findBanner = await aboutUsOasisNotesSupport.findOne({ _id: req.params.id });
                if (findBanner) {
                        let data = {
                                title: title,
                                link: link,
                        }
                        const newCategory = await aboutUsOasisNotesSupport.findByIdAndUpdate({ _id: findBanner._id }, { $push: { data: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'InfoInAboutUsOasisNotesSupport update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'AboutUsOasisNotesSupport not found.', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create faq' });
        }
};
exports.deleteDataArrayInAboutUsOasisNotesSupport = async (req, res) => {
        try {
                const findCart = await aboutUsOasisNotesSupport.findOne({ _id: req.params.id });
                if (findCart) {
                        for (let i = 0; i < findCart.dataArray.length; i++) {
                                if (findCart.dataArray.length > 1) {
                                        if (((findCart.dataArray[i]._id).toString() == req.params.dataArrayId) == true) {
                                                let updateCart = await aboutUsOasisNotesSupport.findByIdAndUpdate({ _id: findCart._id, 'dataArray._id': req.params.dataArrayId }, {
                                                        $pull: {
                                                                'dataArray':
                                                                {
                                                                        _id: req.params.dataArrayId,
                                                                        title: findCart.dataArray[i].title,
                                                                        link: findCart.dataArray[i].link
                                                                }
                                                        }
                                                }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "Data from dataArray delete from aboutUsOasisNotesSupport.", data: updateCart, });
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
exports.createTerms = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "TERMS" });
                if (!data) {
                        if (!req.body.terms) {
                                return res.status(400).send("please specify terms");
                        }
                        const result = await staticContent.create({ terms: req.body.terms, type: "TERMS" });
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                } else {
                        let terms = req.body.terms || data.terms;
                        const data1 = await staticContent.findOneAndUpdate({ _id: data._id }, { $set: { terms: terms, type: "TERMS" } }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getTerms = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "TERMS" });
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getTermsbyId = async (req, res) => {
        try {
                const data = await staticContent.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteTerms = async (req, res) => {
        try {
                const data = await staticContent.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Deleted Successfully", });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message });
        }
};
exports.createPrivacy = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "PRIVACY" });
                if (!data) {
                        if (!req.body.privacy) {
                                return res.status(400).send("please specify privacy");
                        }
                        const result = await staticContent.create({ privacy: req.body.privacy, type: "PRIVACY" });
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                } else {
                        let privacy = req.body.privacy || data.privacy;
                        const data1 = await staticContent.findByIdAndUpdate({ _id: data._id }, { $set: { privacy: privacy, type: data.type } }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPrivacy = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "PRIVACY" });
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPrivacybyId = async (req, res) => {
        try {
                const data = await staticContent.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deletePrivacy = async (req, res) => {
        try {
                const data = await staticContent.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Deleted Successfully", });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message });
        }
};