const mongoose = require('mongoose');
const schema = mongoose.Schema;
const patientMedicationSchema = new mongoose.Schema({
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
        document: {
                type: String,
        },
        uploadDate: {
                type: String,
        },
        documentType: {
                type: String,
        },
        size: {
                type: String,
        },
});
const PatientMedication = mongoose.model('patientMedication', patientMedicationSchema);
module.exports = PatientMedication;
