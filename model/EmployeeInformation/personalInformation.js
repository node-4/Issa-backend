const mongoose = require('mongoose');
const schema = mongoose.Schema;
const employeeSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        date: {
                type: Date,
                default: Date.now
        },
        lastName: {
                type: String,
                required: true
        },
        firstName: {
                type: String,
                required: true
        },
        middleInitial: {
                type: String
        },
        addressStreet: {
                type: String
        },
        addressCity: {
                type: String
        },
        addressState: {
                type: String
        },
        addressZip: {
                type: String
        },
        socSecNo: {
                type: String,
                required: true
        },
        birthDate: {
                type: Date
        },
        telephoneHome: {
                type: String
        },
        telephonePersonalCell: {
                type: String
        },
        telephoneWork: {
                type: String
        },
        telephoneBusinessCell: {
                type: String
        },
        dLStateOfIssue: {
                type: String
        },
        dLNumber: {
                type: String
        },
        dLExpirationDate: {
                type: Date
        },
        businessEmail: {
                type: String
        },
        personalEmail: {
                type: String
        },
        emergencyContactName: {
                type: String
        },
        emergencyContactRelationship: {
                type: String
        },
        emergencyContactNumber: {
                type: String
        },
        savedSigned: {
                type: String,
        },
});
const Employee = mongoose.model('personalInformation', employeeSchema);
module.exports = Employee;
