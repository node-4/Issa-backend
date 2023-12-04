const mongoose = require("mongoose");
const validator = require("validator");
const schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        fullName: {
                type: String
        },
        firstName: {
                type: String
        },
        lastName: {
                type: String
        },
        email: {
                type: String,
                validate: [validator.isEmail, "Please Enter a valid Email"],
        },
        mobileNumber: {
                type: String,
        },
        password: {
                type: String
        },
        dateOfBirth: {
                type: Date
        },
        wallet: {
                type: Number,
                default: 0,
        },
        profilePic: {
                type: String,
                default: "",
        },
        otp: {
                type: String
        },
        isVerified: {
                type: Boolean,
                default: false,
        },
        permissionAdmin: {
                type: Boolean,
                default: false,
        },
        permissionEmployee: {
                type: Boolean,
                default: false,
        },
        permissionPatient: {
                type: Boolean,
                default: false,
        },
        permissionPsychiatricProvider: {
                type: Boolean,
                default: false,
        },
        permissionClaimSubmission: {
                type: Boolean,
                default: false,
        },
        userType: {
                type: String,
                enum: ["SuperAdmin", "Employee", "Admin", "Patient"],
                default: "Employee"
        },
},
        { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);