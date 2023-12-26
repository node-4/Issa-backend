const mongoose = require('mongoose');
const schema = mongoose.Schema;
const residentExpenseSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        residentName: {
                type: String,
                required: true,
        },
        dateOfBirth: {
                type: Date,
        },
        admitDate: {
                type: Date,
        },
        transactions: [{
                date: {
                        type: Date,
                        default: Date.now,
                },
                deposit: {
                        type: Number,
                        default: 0,
                },
                moneySpent: {
                        type: Number,
                        default: 0,
                },
                balance: {
                        type: Number,
                        default: 0,
                },
                description: {
                        type: String,
                },
                residentSignature: {
                        type: String,
                },
                staffSignature: {
                        type: String,
                },
        }],
});
const ResidentExpense = mongoose.model('financialTransactionsRecord', residentExpenseSchema);
module.exports = ResidentExpense;
