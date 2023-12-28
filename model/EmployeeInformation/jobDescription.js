const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bhtJobDescriptionSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        jobDescription: {
                type: String,
        },
        positionsSupervised: {
                type: Boolean,
                default: false,
        },
        primaryResponsibilities: [{
                type: String,
        }],
        coreCompetencies: [{
                type: String,
        }],
        minimumQualifications: [{
                type: String,
        }],
        minimumDescription: {
                type: String,
        },
        employeeInfoName: {
                type: String,
        },
        employeeInfoSignature: {
                type: String,
        },
        employeeInfoDate: {
                type: Date,
                default: Date.now,
        },
        pleaseNote: {
                type: String,
        },
});
const BHTJobDescription = mongoose.model('jobDescription', bhtJobDescriptionSchema);
module.exports = BHTJobDescription;
