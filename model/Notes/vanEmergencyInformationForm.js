const mongoose = require("mongoose");

const residentInformationSchema = new mongoose.Schema({
        residentName: {
                type: String,
                required: true,
        },
        dateOfBirth: {
                type: Date,
        },
        facilityAddress: {
                type: String,
        },
        facilityPhoneNumber: {
                type: String,
        },
        guardianInformation: {
                type: String,
        },
        BHRFAdministratorInformation: {
                type: String,
        },
        pharamacyHospital: {
                type: String,
        },
        preferredHospital: {
                type: String,
        },
        allergies: {
                type: String,
        },
        staffMemberName: {
                type: String,
        },
        staffMemberPhoneNumber: {
                type: String,
        },
});
const ResidentInformation = mongoose.model("vanEmergencyInformationForm", residentInformationSchema);
module.exports = ResidentInformation;
