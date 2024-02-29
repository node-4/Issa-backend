const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employees: [{
                type: schema.Types.ObjectId,
                ref: "User",
        }],
        currentDate: {
                type: Number
        },
        month: {
                type: String
        },
        year: {
                type: String
        },
        date: {
                type: String
        },
        dateCreated: {
                type: Date
        },
        day: {
                type: String
        },
        schedule: [{
                employeeId: {
                        type: schema.Types.ObjectId,
                        ref: "User",
                },
                shiftId: {
                        type: schema.Types.ObjectId,
                        ref: "shift",
                },
        }],
        timeTaken: {
                type: String
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("staffSchedule", addressSchema);

