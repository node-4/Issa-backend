const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        militaryExperiance: {
                type: Boolean,
                default: false
        },
        ifSpecialty: {
                type: String,
        },
        dateEntered: {
                type: Date
        },
        dateDischarged: {
                type: Date,
        },
        nationalGuard: {
                type: Boolean,
                default: false
        },
        validLicence: {
                type: Boolean,
                default: false
        },
        driverLicenseNumber: {
                type: String,
        },
        driverLicenseClass: {
                type: String,
        },
        driverLicenseStatusIssued: {
                type: String,
        },
        typingSkill: {
                type: Boolean,
                default: false
        },
        wordsPerMinute: {
                type: Number,
        },
        familiarWithMicroSoft: {
                type: Boolean,
                default: false
        },
        otherSkill: {
                type: String,
        },
        professionalReferences: [{
                name: {
                        type: String,
                },
                address: {
                        type: String,
                },
                company: {
                        type: String,
                },
                phoneNumber: {
                        type: String,
                },
                howLongYouKnow: {
                        type: String,
                },
        }],
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("employeeOtherInfo", addressSchema);