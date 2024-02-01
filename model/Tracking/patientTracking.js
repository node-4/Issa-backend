const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
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
        tbTest: {
                type: String,
        },
        tbTestDate: {
                type: Date,
        },
        tbTestExpire: {
                type: Date,
        },
        expireDate: {
                type: Date,
        },
        initialAssessment: {
                type: String,
        },
        nursingAssessment: {
                type: String,
        },
        treatmentPlanReviewDate: {
                type: Date,
        },
        treatmentPlanTestDate: {
                type: Date,
        },
        treatmentPlanTestExpire: {
                type: Date,
        },
        treatmentPlanExpireDate: {
                type: Date,
        },
        staffing: {
                type: String,
        },
        fluShot: {
                type: String,
        },
        otherTestDate: {
                type: Date,
        },
        otherTestExpire: {
                type: Date,
        },
        otherExpireDate: {
                type: Date,
        },
        timeOffRequestApproved: {
                type: Boolean,
        },
        note: {
                type: String,
        },
        signature: {
                type: String,
        },
        additionalDocument: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("patientTracking", addressSchema);
