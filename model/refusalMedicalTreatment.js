const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        toDayDate: {
                type: Date,
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientName: {
                type: String,
        },
        dateOfBirth: {
                type: Date,
        },
        describeIllness: {
                type: String,
        },
        iOffered: {
                type: String,
        },
        residentName: {
                type: String,
        },
        residentDate: {
                type: Date,
        },
        residentTime: {
                type: String,
        },
        staffName: {
                type: String,
        },
        staffDate: {
                type: Date,
        },
        staffTime: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("refusalMedicalTreatment", addressSchema);