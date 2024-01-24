const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeName: {
                type: String,
        },
        streetAddress: {
                type: String,
        },
        city: {
                type: String,
        },
        state: {
                type: String,
        },
        zipCode: {
                type: String,
        },
        phoneNumber: {
                type: String,
        },
        supervisorNameAndTitle: {
                type: String,
        },
        from: {
                type: Date,
        },
        to: {
                type: Date,
        },
        previousCompany: [{
                from: {
                        type: Date,
                },
                to: {
                        type: Date,
                },
                jobTitle: {
                        type: String,
                },
                dutiesPerformed: {
                        type: String,
                },
                reasonForLeaving: {
                        type: String,
                },
                mayContactWithEmployee: {
                        type: Boolean,
                        default: false
                },
        }]
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("employeeHistory", addressSchema);