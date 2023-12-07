const mongoose = require("mongoose");
const schema = mongoose.Schema;
const vehicleInspectionSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        date: {
                type: String, // Assuming mm/yy format
                required: true,
        },
        vehicle: {
                type: String,
                required: true,
        },
        dateOfLastService: {
                type: Date,
        },
        dateOfNextService: {
                type: Date,
        },
        itemsLights: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsLightsComment: {
                type: String,
        },
        itemsTurnSignals: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsTurnSignalsComment: {
                type: String,
        },
        itemsHorn: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsHornComment: {
                type: String,
        },
        itemsWipers: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsWipersComment: {
                type: String,
        },
        itemsAC: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsACComment: {
                type: String,
        },
        itemsTires: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsTiresComment: {
                type: String,
        },
        itemsSteering: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsSteeringComment: {
                type: String,
        },
        itemsFluidLeaksGasOdor: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsFluidLeaksGasOdorComment: {
                type: String,
        },
        itemsBodyDents: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsBodyDentsComment: {
                type: String,
        },
        itemsMirrors: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsMirrorsComment: {
                type: String,
        },
        itemsExternalCleanliness: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsExternalCleanlinessComment: {
                type: String,
        },
        itemsInteriorCleanliness: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsInteriorCleanlinessComment: {
                type: String,
        },
        itemsFirstAidKit: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsFirstAidKitComment: {
                type: String,
        },
        itemsWater: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsWaterComment: {
                type: String,
        },
        itemsFireExtinguisher: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsFireExtinguisherComment: {
                type: String,
        },
        itemsBrakes: {
                type: String,
                enum: ["Pass", "Fail"],
        },
        itemsBrakesComment: {
                type: String,
        },
        comments: {
                type: String,
        },
        inspectorSignature: {
                type: String,
                required: true,
        },
        inspectorDate: {
                type: Date,
                default: Date.now,
        },
});
const VehicleInspection = mongoose.model("MonthlyVehicleInspection", vehicleInspectionSchema);

module.exports = VehicleInspection;
