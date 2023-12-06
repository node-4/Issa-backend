const mongoose = require("mongoose");
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
                ref: "user",
        },

}, { timestamps: true });
module.exports = mongoose.model("task", addressSchema);