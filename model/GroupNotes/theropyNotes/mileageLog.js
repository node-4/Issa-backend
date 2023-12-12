const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        date: {
                type: Date
        },
        residentInitials: {
                type: String,
        },
        destination: {
                type: String,
        },
        beginningMileage: {
                type: String,
        },
        endingMileage: {
                type: String,
        },
        totalMileage: {
                type: String,
        },
        driverSignature: {
                type: String,
        },
        anyIssues: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("mileageLog", addressSchema);