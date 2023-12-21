const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        CPRFirstAid: {
                type: String,
        },
        TBTestChestXray: {
                type: String,
        },
        TBtestQuestionnaire: {
                type: String,
        },
        FingerprintClearanceCard: {
                type: String,
        },
        InfectiousControlTraining: {
                type: String,
        },
        TBAnnualEducation: {
                type: String,
        },
        FallPreventionandFallRecovery: {
                type: String,
        },
        APSSearch: {
                type: String,
        },
        CPIPreventionandControl: {
                type: String,
        },
        Annualabuseandneglecttraining: {
                type: String,
        },
        vacationPersonalTimeUsed: {
                type: String,
        },
        expireDate: {
                type: Date,
        },
        employeeSignature: {
                type: String,
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
}, { timestamps: true });
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("employeeTracking", addressSchema);
