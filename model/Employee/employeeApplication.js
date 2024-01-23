const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        today: {
                type: Date
        },
        hireDate: {
                type: Date,
        },
        firstName: {
                type: String,
        },
        lastName: {
                type: String,
        },
        middle: {
                type: String,
        },
        maiden: {
                type: String,
        },
        addressNumber: {
                type: String,
        },
        streetAddress: {
                type: String,
        },
        stateAddress: {
                type: String,
        },
        cityAddress: {
                type: String,
        },
        zipCode: {
                type: String,
        },
        howLong: {
                type: String,
        },
        primaryPhoneNumber: {
                type: String,
        },
        alternativePhoneNumber: {
                type: String,
        },
        underAgee18: {
                type: Boolean,
                default: false
        },
        ssn: {
                type: String,
        },
        legallyEligible: {
                type: Boolean,
                default: false
        },
        desirePosition: {
                type: String,
        },
        desireSalary: {
                type: String,
        },
        dateAvailableToStart: {
                type: Date,
        },
        hourworkWeekly: {
                type: String,
        },
        fullTimeOnly: {
                type: String,
        },
        partTimeOnly: {
                type: String,
        },
        fullPartTimeOnly: {
                type: String,
        },
        onCall: {
                type: String,
        },
        monday: {
                type: String,
        },
        tuesday: {
                type: String,
        },
        wednesday: {
                type: String,
        },
        thursday: {
                type: String,
        },
        friday: {
                type: String,
        },
        saturday: {
                type: String,
        },
        sunday: {
                type: String,
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("employeeApplication", addressSchema);