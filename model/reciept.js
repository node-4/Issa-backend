const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        document: {
                type: String,
        },
        receiptName: {
                type: String,
        },
        uploadDate: {
                type: String,
        },
        documentType: {
                type: String,
        },
        size: {
                type: String,
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },

}, { timestamps: true });

addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("reciept", addressSchema);