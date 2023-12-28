const mongoose = require('mongoose');
const schema = mongoose.Schema;
const informedConsentSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        name: {
                type: String,
        },
        instruction: [{
                instruction: {
                        type: String,
                }
        }],
});
const InformedConsent = mongoose.model('medicationEmployee', informedConsentSchema);
module.exports = InformedConsent;
