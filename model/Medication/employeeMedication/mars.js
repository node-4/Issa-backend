const mongoose = require("mongoose");
const schema = mongoose.Schema;
const medicationSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        residentName: {
                type: String,
        },
        dateOfBirth: {
                type: Date,
        },
        admitDate: {
                type: Date,
        },
        month: {
                type: String,
        },
        year: {
                type: String,
        },
        location: {
                type: String,
        },
        psychiatricProvider: {
                type: String,
        },
        pcpProvider: {
                type: String,
        },
        diet: {
                type: String,
        },
        fluidRestriction: {
                type: String,
        },
        allergies: {
                type: String,
        },
        medications: [{
                type: schema.Types.ObjectId,
                ref: "MarsMedications",
        }],
        staffDetails: [{
                name: {
                        type: String,
                },
                title: {
                        type: String,
                },
                initials: {
                        type: String,
                },
        }],
});
const Medication = mongoose.model("Mars", medicationSchema);
module.exports = Medication;
