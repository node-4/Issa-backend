const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({

        patientId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        ahcccsId: {
                type: String,
        },
        dateOfBirth: {
                type: Date
        },
        dateOfAdmit: {
                type: Date,
        },
        dateOfDischarge: {
                type: Date,
        },
        reasonOfDischarge: {
                type: String,
        },
        isDischarge: {
                type: Boolean,
                default: false
        }
}, { timestamps: true });
module.exports = mongoose.model("admitDetail", addressSchema);