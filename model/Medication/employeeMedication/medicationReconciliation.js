const mongoose = require('mongoose');
const schema = mongoose.Schema;
const medicationReconciliationSchema = new mongoose.Schema({
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
        },
        allergiesAndReactions: {
                type: String,
        },
        medications: [{
                name: {
                        type: String,
                },
                dose: {
                        type: String,
                },
                route: {
                        type: String,
                },
                frequency: {
                        type: String,
                },
                startDate: {
                        type: Date,
                },
                stopChangeDate: {
                        type: Date,
                },
                reasonForStopChange: {
                        type: String,
                },
        }],
        providerName: {
                type: String,
        },
        providerSignature: {
                type: String,
        },
        date: {
                type: Date,
        },
});
const MedicationReconciliation = mongoose.model('MedicationReconciliation', medicationReconciliationSchema);
module.exports = MedicationReconciliation;
