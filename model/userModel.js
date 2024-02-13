const mongoose = require("mongoose");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
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
        employeesId: [{
                type: schema.Types.ObjectId,
                ref: "User",
        }],
        subscriptionId: {
                type: mongoose.Schema.ObjectId,
                ref: "pricing",
        },
        subscriptionExpiration: {
                type: Date
        },
        isSubscription: {
                type: Boolean,
                default: false,
        },
        companyName: {
                type: String
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
        otpExpiration: {
                type: Date,
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
        },
        permissionEmployee: {
                type: Boolean,
        },
        permissionPatient: {
                type: Boolean,
        },
        permissionPsychiatricProvider: {
                type: Boolean,
        },
        permissionClaimSubmission: {
                type: Boolean,
        },
        permissionAccessDocuments: {
                type: Boolean,
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