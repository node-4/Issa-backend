const mongoose = require('mongoose');
const schema = mongoose.Schema;
const terminationSchema = new mongoose.Schema({
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
                default: Date.now,
        },
        terminatedEmployeeName: {
                type: String,
                required: true,
        },
        hireDate: {
                type: Date,
                required: true,
        },
        terminationDate: {
                type: Date,
                required: true,
        },
        voluntaryReason: {
                type: String,
                enum: [
                        'Moved  out of area',
                        'No call no show',
                        'Personal',
                        'Resigned without notice',
                        'Retired',
                        'Retirement',
                        'In Lieu of Discharge',
                ],
        },
        involuntaryReason: {
                type: String,
                enum: [
                        'Contract Work ended',
                        'Laid off',
                        'Policy Violation',
                        'Poor Performance',
                        'Transferred',
                        'Absenteeism or Tardiness',
                        'Job Abandonment',
                ],
        },
        disciplinaryAction: {
                type: String,
                enum: ['Verbal warnings', 'Written warnings', 'None'],
                required: true,
        },
        copyProvidedToEmployee: {
                type: String,
                enum: ['Employee', 'Employee File', 'Other'],
                required: true,
        },
        eligibleForRehire: {
                type: String,
                enum: ['Yes', 'No'],
                required: true,
        },
        explanationForNoRehire: {
                type: String,
        },
        employeeSignature: {
                type: String,
        },
        employeeDate: {
                type: Date,
        },
        administratorSignature: {
                type: String,
                required: true,
        },
});

const Termination = mongoose.model('Termination', terminationSchema);

module.exports = Termination;
