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
                name: {
                        type: String,
                },
                instruction: [{
                        instruction: {
                                type: String,
                        },
                        select: {
                                type: Boolean,
                                default: false
                        },
                }],
                medicationStatus: [{
                        date: {
                                type: String,
                                enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31",],
                        },
                        timeStatus: [{
                                time: {
                                        type: String,
                                },
                                status: {
                                        type: String,
                                        enum: ["H", "HP", "RM", "H", "UN", ""],
                                        default: ""
                                }
                        }]
                }],
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
