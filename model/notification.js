const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
var notificationModel = new Schema({
        adminId: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "User"
        },
        employeeId: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "User"
        },
        patientId: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "User"
        },
        notes: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "notes"
        },
        title: {
                type: String
        },
        body: {
                type: String
        },
        image: {
                type: String
        },
        date: {
                type: String
        },
        time: {
                type: String
        },
        forUser: {
                type: String,
                enum: ["SuperAdmin", "Employee", "Admin", "Patient"]
        },
        status: {
                type: String,
                enum: ["ACTIVE", "BLOCKED", "DELETE"],
                default: "ACTIVE"
        },
}, { timestamps: true });
module.exports = Mongoose.model("notification", notificationModel);