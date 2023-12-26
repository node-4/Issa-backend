const mongoose = require('mongoose');
const schema = mongoose.Schema;
const staffingNoteSchema = new mongoose.Schema({
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
    todayDate: {
        type: Date,
        default: Date.now,
    },
    beginTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    participantsPresent: {
        type: String,
    },
    presentingIssues: {
        type: String,
    },
    progress: {
        type: String,
    },
    barriers: {
        type: String,
    },
    recommendations: {
        type: String,
    },
    staffSignature: {
        type: String,
    },
});
const StaffingNote = mongoose.model('StaffingNote', staffingNoteSchema);
module.exports = StaffingNote;
