const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        training: [{
                date: {
                        type: Date
                },
                duration: {
                        type: String,
                },
        }],
        description: {
                type: String,
        },
        employeeSignature: {
                type: String,
        },
        employeeDate: {
                type: String,
        },
        trainerSignature: {
                type: String,
        },
        trainerDate: {
                type: String,
        },
        savedSigned: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("onSiteFacility", addressSchema);