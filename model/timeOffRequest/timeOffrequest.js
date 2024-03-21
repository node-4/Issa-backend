const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        beginDate: {
                type: Date,
        },
        endDate: {
                type: Date,
        },
        normalShift: {
                type: String,
        },
        unPaidHrLeft: {
                type: String,
        },
        vacationPersonTimeUsed: {
                type: String,
        },
        sickTimeUsed: {
                type: String,
        },
        notes: {
                type: String,
        },
        signature: {
                type: String,
        },
        signatureDate: {
                type: Date,
                default: Date.now,
        },
        signatureTime: {
                type: String
        },
        signatureSaveAsDraft: {
                type: Boolean,
                default: false
        },
        requestType: {
                type: String,
                enum: ["PTO", "SICKTIME"],
        },
        status: {
                type: String,
                enum: ["Pending", "Accept", "Reject"],
                default: "Pending"
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("timeOffRequest", addressSchema);