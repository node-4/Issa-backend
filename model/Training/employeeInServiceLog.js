const mongoose = require('mongoose');
const schema = mongoose.Schema;
const employeeInServiceLogSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeName: {
                type: String,
                required: true,
        },
        dateOfTraining: {
                type: Date,
                required: true,
        },
        trainingSubject: [{
                type: String,
                enum: [
                        'Infectious Control',
                        'Fall prevention and fall recovery',
                        'Annual TB education',
                        'Assistance in the self administration of medication',
                        'Medication administration'
                ],
        }],
        hoursOrUnits: {
                type: Number,
        },
        administratorSignature: {
                type: String,
        },
        employeeSignature: {
                type: String,
        },
        employeeDate: {
                type: String,
        },
        employeeTime: {
                type: String
        },
        employeeSaveAsDraft: {
                type: Boolean,
                default: false
        },
});
const EmployeeInServiceLog = mongoose.model('EmployeeInServiceLog', employeeInServiceLogSchema);
module.exports = EmployeeInServiceLog;
