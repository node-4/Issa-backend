const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        month: {
                type: String
        },
        year: {
                type: String
        },
        administratorAndNumber: {
                type: String,
        },
        registeredNurseAndNumber: {
                type: String,
        },
        bhtNameAndNumber: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("staffScheduleAdministrator", addressSchema);

