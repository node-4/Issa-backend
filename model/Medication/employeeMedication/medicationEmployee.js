const mongoose = require('mongoose');
const schema = mongoose.Schema;
const informedConsentSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        name: {
                type: String,
        },
        medication: [{
                name: {
                        type: String,
                },
                instruction: [{
                        instruction: {
                                type: String,
                        }
                }],
                other: {
                        type: String,
                },
        }],
        instruction: [{
                instruction: {
                        type: String,
                }
        }],
        other: {
                type: String,
        },
});
const InformedConsent = mongoose.model('medicationEmployee', informedConsentSchema);
module.exports = InformedConsent;
