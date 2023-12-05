const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
        date: {
                type: Date,
        },
        location: {
                type: String,
        },
        alaram1: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram2: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram3: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram4: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram5: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram6: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram7: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram8: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram9: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram10: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram11: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram12: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram13: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram14: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        alaram15: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        extinguisher1: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        extinguisher2: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        extinguisher3: [{
                date: {
                        type: Date,
                },
                working: {
                        type: String,
                        enum: ["working", "NeedRepair", "RepairAndWork"]
                }
        }],
        staff: [{
                signature: {
                        type: String,
                }
        }],
        fireExtinguisherExpire1: {
                type: Date,
        },
        fireExtinguisherExpire2: {
                type: Date,
        },
        fireExtinguisherExpire3: {
                type: Date,
        }
}, { timestamps: true });
module.exports = mongoose.model("fireEquipementMonitoring", addressSchema);