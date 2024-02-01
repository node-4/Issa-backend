const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
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
        year: {
                type: String,
        },
        month: {
                type: String,
        },
        schedule: [{
                date: {
                        type: Number,
                        min: 1,
                        max: 31
                },
                day: {
                        type: String,
                        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                },
                amToAm: {
                        type: String,
                },
                amToPm: {
                        type: String,
                },
                pmToAm: {
                        type: String,
                },
        }],
        administratorAndNumber: {
                type: String,
        },
        registeredNurseAndNumber: {
                type: String,
        },
        bhtNameAndNumber: {
                type: String,
        },
        savedSigned: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("staffSchedule", addressSchema);

