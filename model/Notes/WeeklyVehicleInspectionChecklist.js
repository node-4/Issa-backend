const mongoose = require("mongoose");
const schema = mongoose.Schema;
const inspectionSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        site: {
                type: String,
        },
        date: {
                type: Date,
        },
        year: {
                type: String,
        },
        make: {
                type: String,
        },
        model: {
                type: String,
        },
        vehicleLicensePlate: {
                type: String,
        },
        lights: {
                highBeam: {
                        type: Boolean,
                },
                lowBeam: {
                        type: Boolean,
                },
                brakeLights: {
                        type: Boolean,
                },
                emergencyLights: {
                        type: Boolean,
                },
                rightLeftFrontTurnSignal: {
                        type: Boolean,
                },
                rightLeftBackTurnSignal: {
                        type: Boolean,
                },
                rightLeftTailLight: {
                        type: Boolean,
                },
                rightLeftEmergencyLight: {
                        type: Boolean,
                },
                rightLeftFrontDayRunning: {
                        type: Boolean,
                },
                rightLeftBackDayRunning: {
                        type: Boolean,
                },
        },
        glass: {
                windshield: {
                        type: Boolean,
                },
                rear: {
                        type: Boolean,
                },
                rightLeftFront: {
                        type: Boolean,
                },
                rightLeftMiddle: {
                        type: Boolean,
                },
                rightLeftBack: {
                        type: Boolean,
                },
        },
        fluidsAndLubricants: {
                fuel: {
                        type: Boolean,
                },
                engineOil: {
                        type: Boolean,
                },
                coolantFluid: {
                        type: Boolean,
                },
                powerSteeringFluid: {
                        type: Boolean,
                },
                brakeFluid: {
                        type: Boolean,
                },
                clutchOil: {
                        type: Boolean,
                },
                batteryFluid: {
                        type: Boolean,
                },
                windshieldWasherFluid: {
                        type: Boolean,
                },
                water: {
                        type: Boolean,
                },
        },
        tires: {
                spare: {
                        type: Boolean,
                },
                rightLeftFront: {
                        type: Boolean,
                },
                rightLeftBack: {
                        type: Boolean,
                },
                jackAndWrench: {
                        type: Boolean,
                },
        },
        mirrors: {
                rightLeftMirror: {
                        type: Boolean,
                },
                middleInterior: {
                        type: Boolean,
                },
        },
        emergencyEquipment: {
                firstAidKit: {
                        type: Boolean,
                },
                gloves: {
                        type: Boolean,
                },
                redTriangles: {
                        type: Boolean,
                },
                flashlight: {
                        type: Boolean,
                },
                water: {
                        type: Boolean,
                },
        },
        general: {
                wiperBladesMotor: {
                        type: Boolean,
                },
                horn: {
                        type: Boolean,
                },
                heater: {
                        type: Boolean,
                },
                airConditioner: {
                        type: Boolean,
                },
                seatBelts: {
                        type: Boolean,
                },
                hose: {
                        type: Boolean,
                },
                driveBelt: {
                        type: Boolean,
                },
                battery: {
                        type: Boolean,
                },
        },
        staffName: {
                type: String,
        },
        staffSignature: {
                type: String,
        },
        inspectionDate: {
                type: Date,
        },
});
const InspectionReport = mongoose.model("WeeklyVehicleInspectionChecklist", inspectionSchema);
module.exports = InspectionReport;
