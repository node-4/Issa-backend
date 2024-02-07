const mongoose = require('mongoose');
const schema = mongoose.Schema;
const offerLetterSchema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeName: {
                type: String,
        },
        companyName: {
                type: String,
        },
        positionOffered: {
                type: String,
        },
        startingPay: {
                type: Number,
                default:0
        },
        startDate: {
                type: Date,
        },
        offerDate: {
                type: Date,
                default: Date.now,
        },
        administratorsName: {
                type: String,
        },
        administratorsSignature: {
                type: String,
        },
        administratorsSignatureDate: {
                type: Date,
                default: Date.now,
        },
});
const OfferLetter = mongoose.model('OfferLetter', offerLetterSchema);
module.exports = OfferLetter;
