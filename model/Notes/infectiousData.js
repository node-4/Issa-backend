const mongoose = require("mongoose");
const schema = mongoose.Schema;
const handwashingDataSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "user",
        },
        data: [{
                employeeName: {
                        type: String,
                        required: true,
                },
                dateOfDataCollection: {
                        type: Date,
                        required: true,
                },
                typeOfDataCollection: {
                        type: String,
                },
                issuesNoted: {
                        type: String,
                },
                dataCollectedBy: {
                        type: String,
                        required: true,
                },
        }]
});
const HandwashingData = mongoose.model("infectiousData", handwashingDataSchema);
module.exports = HandwashingData;
