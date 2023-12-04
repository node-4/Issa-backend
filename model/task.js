const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        title: {
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
        user: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        lastUpdateDate: {
                type: String,
        }
}, { timestamps: true });
module.exports = mongoose.model("task", addressSchema);