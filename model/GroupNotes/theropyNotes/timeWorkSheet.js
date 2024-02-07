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
        timeSheetId: {
                type: schema.Types.ObjectId,
                ref: "timeSheet",
        },
        month: {
                type: String
        },
        year: {
                type: String
        },
        date: {
                type: Date
        },
        work: [{
                start: {
                        type: String
                },
                end: {
                        type: String
                },
                type: {
                        type: String,
                        enum: ["amToAm", "amToPm", "pmToAm"]
                },
                timeTaken: {
                        type: String
                },
        }],
        totalTime: {
                type: String
        }
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("timeWorkSheet", addressSchema);

