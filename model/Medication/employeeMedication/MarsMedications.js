const mongoose = require("mongoose");
const schema = mongoose.Schema;
const medicationSchema = new mongoose.Schema({
        MarsId: {
                type: schema.Types.ObjectId,
                ref: "Mars",
        },
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
});
const Medication = mongoose.model("MarsMedications", medicationSchema);
module.exports = Medication;
