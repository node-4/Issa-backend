const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        CPRFirstAid: {
                type: String,
        },
        CPRFirstAidExpireDate: {
                type: Date,
        },
        TBTestChestXray: {
                type: String,
        },
        TBTestChestXrayExpireDate: {
                type: Date,
        },
        TBtestQuestionnaire: {
                type: String,
        },
        TBtestQuestionnaireExpireDate: {
                type: Date,
        },
        FingerprintClearanceCard: {
                type: String,
        },
        FingerprintClearanceCardExpireDate: {
                type: Date,
        },
        InfectiousControlTraining: {
                type: String,
        },
        InfectiousControlTrainingExpireDate: {
                type: Date,
        },
        TBAnnualEducation: {
                type: String,
        },
        TBAnnualEducationExpireDate: {
                type: Date,
        },
        FallPreventionandFallRecovery: {
                type: String,
        },
        FallPreventionandFallRecoveryExpireDate: {
                type: Date,
        },
        APSSearch: {
                type: String,
        },
        APSSearchExpireDate: {
                type: Date,
        },
        CPIPreventionandControl: {
                type: String,
        },
        CPIPreventionandControlExpireDate: {
                type: Date,
        },
        Annualabuseandneglecttraining: {
                type: String,
        },
        AnnualabuseandneglecttrainingExpireDate: {
                type: Date,
        },
        vacationPersonalTimeUsed: {
                type: String,
        },
        vacationPersonalTimeUsedExpireDate: {
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
