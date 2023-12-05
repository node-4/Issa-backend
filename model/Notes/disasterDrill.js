const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        facititAddress: {
                type: String,
        },
        date: {
                type: Date,
        },
        tornado: {
                type: Boolean
        },
        structureDamage: {
                type: Boolean
        },
        fire: {
                type: Boolean
        },
        storm: {
                type: Boolean
        },
        earthQuake: {
                type: Boolean
        },
        bombThreat: {
                type: Boolean
        },
        terroristAct: {
                type: Boolean
        },
        other: {
                type: Boolean
        },
        beginTime: {
                type: String,
        },
        endTime: {
                type: String,
        },
        totalTime: {
                type: String,
        },
        staffPresent: [{
                type: schema.Types.ObjectId,
                ref: "user",
        }],
        contactManagerCoordinator: {
                type: Boolean,
        },
        was911Called: {
                type: Boolean,
        },
        extinguisherTaken: {
                type: Boolean,
        },
        relocatedTheResidents: {
                type: String,
        },
        recommendations: {
                type: String,
        },
        residentMedication: {
                type: Boolean,
        },
        waterFoodAccessible: {
                type: Boolean,
        },
        residentsAccounted: {
                type: String,
        },
        handleTheDisaster: {
                type: String,
        },
        commentsConcerns: {
                type: String,
        },
        title: {
                type: String,
        },
        personConductingTheDisasterDrill: {
                type: String,
        },
        conducatingDate: {
                type: Date,
        },
}, { timestamps: true });
module.exports = mongoose.model("disasterDrill", addressSchema);