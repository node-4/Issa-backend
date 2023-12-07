const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../model/userModel');
const AdminTracking = require('../model/adminTracking');
const admitDetail = require('../model/admitDetail');
const notes = require('../model/Notes/notes');
const reciept = require('../model/reciept');

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