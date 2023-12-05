const mongoose = require("mongoose");
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
        user: {
                type: schema.Types.ObjectId,
                ref: "user",
        },

}, { timestamps: true });
module.exports = mongoose.model("reciept", addressSchema);