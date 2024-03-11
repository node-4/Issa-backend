const mongoose = require('mongoose');
const schema = mongoose.Schema;
const formW9Schema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        document: {
                type: String
        },
        type: {
                type: String
        },




        step1FirstName: {
                type: String
        },
        step1LastName: {
                type: String
        },
        step1Address: {
                type: String
        },
        step1City: {
                type: String
        },
        step1State: {
                type: String
        },
        step1ZipCode: {
                type: String
        },
        step1SocialSecurityNumber: {
                type: String
        },
        step1IsNameMatched: {
                type: Boolean
        },
        step1FilingStatus: {
                type: String,
                enum: ['Single', 'MarriedSeparately', 'MarriedJointly', 'HeadOfHousehold']
        },
        step2Choose: {
                type: String,
                enum: ['A', 'B', 'C']
        },
        step2Ca: {
                type: Boolean
        },
        step2Cb: {
                type: Boolean
        },
        step3QualifyingChildrenCredit: {
                type: Number
        },
        step3OtherDependentsCredit: {
                type: Number
        },
        step3TotalCredits: {
                type: Number
        },
        step4OtherIncome: {
                type: Number
        },
        step4Deductions: {
                type: Number
        },
        step4ExtraWithholding: {
                type: Number
        },
        step5EmployeeSignature: {
                type: String
        },
        step5Date: {
                type: Date
        },
        employerName: {
                type: String
        },
        employerAddress: {
                type: String
        },
        firstDateOfEmployment: {
                type: Date
        },
        employerEIN: {
                type: String
        },
        step2bLine1: {
                type: Number
        },
        step2bLine2a: {
                type: Number
        },
        step2bLine2b: {
                type: Number
        },
        step2bLine2c: {
                type: Number
        },
        step2bLine3: {
                type: Number
        },
        step2bLine4: {
                type: Number
        },
        step4bLine1: {
                type: Number
        },
        step4bLine2: {
                type: Number
        },
        step4bLine3: {
                type: Number
        },
        step4bLine4: {
                type: Number
        },
        step4bLine5: {
                type: Number
        },
});
const Employee = mongoose.model('fw4', formW9Schema);
module.exports = Employee;
