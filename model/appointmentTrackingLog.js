const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        toDayDate: {
                type: Date,
        },
        providerName: {
                type: String,
        },
        reasonForVisit: {
                type: String,
        },
        medicationChanges: {
                type: String,
        },
        nextFollowUp: {
                type: String,
        },
        providerType: {
                type: String,
        },
        refusal: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("appointmentTrackingLog", addressSchema);