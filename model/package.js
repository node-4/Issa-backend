const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        image: {
                type: String,
        },
        description: {
                type: String,
        },
        packageType: {
                type: String,
                enum: ["Employee", "PsychiatricProvider", "Claim", "OutPatient"],
        },
}, { timestamps: true });

addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("package", addressSchema);
