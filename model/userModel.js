const mongoose = require("mongoose");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
        Id: {
                type: String
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
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
        middle: {
                type: String
        },
        maiden: {
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
        age: {
                type: Number
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
        address: {
                type: String
        },
        proffession: {
                type: String
        },
        isVerified: {
                type: Boolean,
                default: false,
        },
        initialAssessment: {
                type: Boolean,
        },
        nursingAssessment: {
                type: Boolean,
        },
        treatmentPlan: {
                type: Boolean,
        },
        faceSheet: {
                type: Boolean,
        },
        safetyPlan: {
                type: Boolean,
        },
        residentIntakes: {
                type: Boolean,
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
        gender: {
                type: String,
                enum: ["Male", "Female", "Other"],
        },
        userType: {
                type: String,
                enum: ["SuperAdmin", "Employee", "Admin", "Patient"],
                default: "Employee"
        },
}, { timestamps: true });

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("User", userSchema);