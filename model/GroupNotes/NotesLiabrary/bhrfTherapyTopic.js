const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        bhrfTherapyId: {
                type: schema.Types.ObjectId,
                ref: "bhrfTherapy",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        topic: {
                type: String,
        },
        notesSummary: [{
                type: String,
        }],
        planRecommendation: [{
                type: String,
        }],
        addBy: {
                type: String,
                enum: ["superAdmin", "admin"],
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("bhrfTherapyTopic", addressSchema);