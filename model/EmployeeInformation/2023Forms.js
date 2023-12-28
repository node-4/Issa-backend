const mongoose = require('mongoose');
const schema = mongoose.Schema;
const withholdingFormSchema = new mongoose.Schema({
  adminId: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  employeeId: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  fullName: {
    type: String,
  },
  socialSecurityNumber: {
    type: String,
  },
  numberAndStreet: {
    type: String,
  },
  cityOrTown: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  withholdingOption: {
    option: {
      type: String,
      enum: ['1', '2'],
    },
    percentage: {
      type: Number,
      enum: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5],
    },
    checkBox: {
      type: Boolean,
      required: false,
    },
    extraAmount: Number,
  },
  signature: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const WithholdingForm = mongoose.model('2023Forms', withholdingFormSchema);
module.exports = WithholdingForm;
