const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        name: {
                type: String,
        },
        contactNumber: {
                type: String,
        },
        reasonForVisit: {
                type: String,
        },
        date: {
                type: Date,
        },
        time: {
                type: String,
        },
        nextFollowUp: {
                type: Date,
        },
        providerType: {
                type: String,
        },
        refusal: {
                type: String,
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        status: {
                type: String,
                enum: ["Pending", "Done", "Cancel"]
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("appointment", addressSchema);