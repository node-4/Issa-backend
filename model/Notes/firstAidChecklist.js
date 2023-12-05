const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        date: {
                type: Date,
        },
        location: {
                type: String,
        },
        AdhesiveStripBandages: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        AdhesiveTap: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        CPRMouthGuardShield: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        DisposableLatexGloves: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        NonStickSterilePads: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        RollerGauze: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        Scissors: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        SterileGuazeSquares: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        TriangularBandages: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        Tweezers: {
                jan: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                feb: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                mar: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Apr: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                May: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jun: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Jul: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Aug: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Sept: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Oct: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Nov: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                },
                Dec: {
                        type: String,
                        enum: ["Present", "Absent", "None"]
                }
        },
        staff: [{
                staffName: {
                        type: String,
                },
                initial: {
                        type: String,
                },
        }]
}, { timestamps: true });
module.exports = mongoose.model("firstAidChecklist", addressSchema);