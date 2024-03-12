const mongoose = require('mongoose');
const schema = mongoose.Schema;
const assessmentSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        residentName: {
                type: String
        },
        dob: {
                type: Date
        },
        dateOfAdmit: {
                type: Date, default: Date.now
        },
        facilityAddress: {
                type: String
        },
        facilityPhoneNumber: {
                type: String
        },
        placeOfBirth: {
                type: String
        },
        eyeColor: {
                type: String
        },
        race: {
                type: String
        },
        height: {
                type: String
        },
        weight: {
                type: String
        },
        hairColor: {
                type: String
        },
        identifiableMarks: {
                type: String
        },
        primaryLanguage: {
                type: String
        },
        courtOrderedTreatment: {
                type: Boolean
        },
        familyGuardianEmergencyName: {
                type: String
        },
        familyGuardianEmergencyContact: {
                type: String
        },
        facilityEmergencyContact: {
                type: String
        },
        medicationAllergies: {
                type: String
        },
        otherAllergies: {
                type: String
        },
        primaryCareProvider: [{
                name: {
                        type: String
                },
                phone: {
                        type: String
                },
                address: {
                        type: String
                },
                OtherSpecialists: {
                        type: String
                },
                preferredHospitalName: {
                        type: String
                },
                preferredHospitalPhone: {
                        type: String
                },
                preferredHospitalAddress: {
                        type: String
                },
        }],
        psychiatricProvider: [{
                name: {
                        type: String
                },
                phone: {
                        type: String
                },
                address: {
                        type: String
                },
                OtherSpecialists: {
                        type: String
                },
                healthPlan: {
                        type: String
                },
                healthPlanId: {
                        type: String
                },
        }],
        caseManagerName: {
                type: String
        },
        caseManagerPhone: {
                type: String
        },
        caseManagerEmail: {
                type: String
        },
        socialSecurityRepresentativePayeeName: {
                type: String
        },
        socialSecurityRepresentativePayeePhone: {
                type: String
        },
        socialSecurityRepresentativePayeeEmail: {
                type: String
        },
        mentalHealthDiagnoses: {
                type: String
        },
        medicalDiagnosesHistory: {
                type: String
        },
        pastSurgeries: {
                type: String
        },
        bhpName: { type: String },
        bhpSignature: { type: String },
        bhpDate: { type: Date, default: Date.now },
        time: { type: String },
});
const Assessment = mongoose.model('faceSheet', assessmentSchema);
module.exports = Assessment;