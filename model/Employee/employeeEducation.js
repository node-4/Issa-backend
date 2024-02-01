const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        highSchoolGraduate: {
                type: Boolean,
                default: false
        },
        highSchoolName: {
                type: String,
        },
        completeAddress: {
                type: String,
        },
        lastYearCompleted: {
                type: Number,
                min: 1,
                max: 4,
        },
        collegeGraduate: {
                type: Boolean,
                default: false
        },
        collegeSubject: {
                type: String,
        },
        collegeName: {
                type: String,
        },
        collegeAddress: {
                type: String,
        },
        collegeLastYearCompleted: {
                type: Number,
                min: 1,
                max: 4,
        },
        youTradeGraduate: {
                type: Boolean,
                default: false
        },
        tradeSubject: {
                type: String,
        },
        tradeSchoolName: {
                type: String,
        },
        tradeAddress: {
                type: String,
        },
        tradeLastYearCompleted: {
                type: Number,
                min: 1,
                max: 4,
        },
        youOtherGraduate: {
                type: Boolean,
                default: false
        },
        otherSubject: {
                type: String,
        },
        otherSchoolName: {
                type: String,
        },
        otherAddress: {
                type: String,
        },
        otherLastYearCompleted: {
                type: Number,
                min: 1,
                max: 4,
        },
        subject: {
                type: String,
        },
        convictedCrime: {
                type: Boolean,
                default: false
        },
        convictedCrimeExplain: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("employeeEducation", addressSchema);