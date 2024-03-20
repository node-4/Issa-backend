const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        training: [{
                date: {
                        type: Date
                },
                duration: {
                        type: String,
                },
        }],
        description: {
                type: String,
        },
        employeeSignature: {
                type: String,
        },
        employeeDate: {
                type: String,
        },
        employeeTime: { type: String },
        employeeSaveAsDraft: {
                type: Boolean,
                default: false
        },
        trainerSignature: {
                type: String,
        },
        trainerDate: {
                type: String,
        },
        savedSigned: {
                type: String,
        },
        traineeTime: { type: String },
        traineeSaveAsDraft: {
                type: Boolean,
                default: false
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("onSiteFacility", addressSchema);