const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
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
                type: String
        },
        work: [{
                clockIn: {
                        type: String,
                },
                clockOut: {
                        type: String,
                },
                timeTaken: {
                        type: String
                }
        }],
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("timeWorkSheet", addressSchema);

