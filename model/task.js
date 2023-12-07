const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        title: {
                type: String,
        },
        date: {
                type: Date,
        },
        time: {
                type: String,
        },
        description: {
                type: String,
        },
        complete: {
                type: Boolean,
                default: false
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },

}, { timestamps: true });

addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("task", addressSchema);