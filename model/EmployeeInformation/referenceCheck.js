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
        },
        referenceName: {
                type: String,
        },
        referenceRecommendation: {
                type: String,
        },
        savedSigned: {
                type: String,
        },
});
const Employee = mongoose.model('referenceCheck', employeeSchema);
module.exports = Employee;
