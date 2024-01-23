const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        stateDate: {
                type: Date,
        },
        endDate: {
                type: Date,
        },
        year: {
                type: String,
        },
        month: {
                type: String,
        },
        employeeName: {
                type: String,
        },
        employeeSignature: {
                type: String,
        },
        registeredHours: {
                type: Number,
        },
        otHours: {
                type: Number,
        },
        holiday: {
                type: Number,
        },
        total: {
                type: Number,
        },
        dateData: [{
                type: schema.Types.ObjectId,
                ref: "timeWorkSheet",
        }],
        week1TotalHr: {
                type: Number,
        },
        week2TotalHr: {
                type: Number,
        },
        week3TotalHr: {
                type: Number,
        },
        week4TotalHr: {
                type: Number,
        },
        paycheckTotalHr: {
                type: Number,
        },
        managerName: {
                type: String,
        },
        savedSigned: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("timeSheet", addressSchema);

