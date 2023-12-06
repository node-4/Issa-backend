const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
const moment = require('moment');
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
                const user1 = await AdminTracking.find({ adminId: req.user._id });
                if (user1.length == 0) {
                        return res.status(404).send({ status: 404, message: "Admin tracking not found ! not registered", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Admin tracking fetch successfully.", data: user1 });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 200, message: "Server error" + error.message });
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
                adminTracking.dateOfDischarge = req.body.DateOfDischarge || adminTracking.dateOfDischarge;
                adminTracking.reasonOfDischarge = req.body.ReasonOfDischarge || adminTracking.reasonOfDischarge;
                adminTracking.isDischarge = true;
                await adminTracking.save();
                return res.status(200).send({ status: 200, message: "Admit detail updated successfully", data: adminTracking });
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
                const filters = {};
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
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                const tasks = await reciept.find({ adminId: user._id }).sort({ createdAt: -1 })
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
exports.addFirstAidChecklist = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found", data: {} });
                }
                req.body.adminId = user._id;
                const checklist = await firstAidChecklist.create(req.body);
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
                const checklist = await fireEquipementMonitoring.create(req.body);
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
                const checklist = await evacuationAndFireDrill.create(req.body);
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
                const checklist = await disasterDrill.create(req.body);
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
                const checklist = await WeeklyVehicleInspectionChecklist.create(req.body);
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
                const checklist = await ClinicalOversight.create(req.body);
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
                const checklist = await MonthlyVehicleInspection.create(req.body);
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
                const checklist = await vanEmergencyInformationForm.create(req.body);
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
                const checklist = await qualityManagement.create(req.body);
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
                const checklist = await infectiousData.create(req.body);
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
                req.body.adminId = user._id;
                const checklist = await incidentReport.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Incident Report added successfully.", data: checklist });
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
                const checklist = await disasterPlanReview.create(req.body);
                if (checklist) {
                        return res.status(200).send({ status: 200, message: "Disaster Plan Review added successfully.", data: checklist });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error: " + error.message, data: {} });
        }
};