const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
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
        exDate: {
                type: String,
        },
        date: {
                type: Date,
        },
        bodyTemperature: {
                type: String,
        },
        pulseRate: {
                type: String,
        },
        respirationRate: {
                type: String,
        },
        bloodPressure: {
                type: String,
        },
        bloodOxygen: {
                type: String,
        },
        weight: {
                type: String,
        },
        bloodGlucoseLevel: {
                type: String,
        },
        height: {
                type: String,
        }
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("patientVitals", addressSchema);
