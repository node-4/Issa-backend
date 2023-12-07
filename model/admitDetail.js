const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        ahcccsId: {
                type: String,
        },
        dateOfBirth: {
                type: Date
        },
        dateOfAdmit: {
                type: Date,
        },
        dateOfDischarge: {
                type: Date,
        },
        reasonOfDischarge: {
                type: String,
        },
        isDischarge: {
                type: Boolean,
                default: false
        }
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("admitDetail", addressSchema);