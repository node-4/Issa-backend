const mongoose = require('mongoose');
const schema = mongoose.Schema;
const contactNoteSchema = new mongoose.Schema({
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
        guardian: {
                type: String,
        },
        caseManager: {
                type: String,
        },
        pharmacy: {
                type: String,
        },
        familyMember: {
                type: String,
        },
        doctorsOffice: {
                type: String,
        },
        personContactedOther: {
                type: String,
        },
        contactName: {
                type: String,
        },
        email: {
                type: String,
        },
        textMessage: {
                type: String,
        },
        phoneCall: {
                type: String,
        },
        inPerson: {
                type: String,
        },
        modeOfContactOther: {
                type: String,
        },
        contactSummaryNote: {
                type: String,
        },
        emergencyIssue: {
                type: Boolean,
        },
});
const ContactNote = mongoose.model('ContactNote', contactNoteSchema);
module.exports = ContactNote;
