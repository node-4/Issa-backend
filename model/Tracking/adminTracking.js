const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        name: {
                type: String,
        },
        completePer: {
                type: Number,
                default: 0
        },
        complete: {
                type: Boolean,
                default: false
        },
        dueDate: {
                type: Date,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        lastUpdateDate: {
                type: String,
        }
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("adminTracking", addressSchema);