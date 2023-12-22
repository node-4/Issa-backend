const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        date: {
                type: Date,
        },
        location: {
                type: String,
        },
        AdhesiveStripBandages: {
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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
                item: {
                        type: Number,
                },
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