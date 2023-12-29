const mongoose = require('mongoose');
const schema = mongoose.Schema;
const i9Schema = new mongoose.Schema({
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        lastName: {
                type: String,
        },
        firstName: {
                type: String,
        },
        middleInitial: {
                type: String,
        },
        otherLastNames: {
                type: String,
        },
        address: {
                type: String,
        },
        aptNumber: {
                type: String,
        },
        city: {
                type: String,
        },
        state: {
                type: String,
        },
        zipCode: {
                type: String,
        },
        dateOfBirth: {
                type: Date,
        },
        socialSecurityNumber: {
                type: String,
        },
        email: {
                type: String,
        },
        telephoneNumber: {
                type: String,
        },
        citizenshipStatus: {
                type: String,
                enum: ['U.S. Citizen', 'Noncitizen National', 'Lawful Permanent Resident', 'Noncitizen Authorized to Work'],
        },
        lawfulPermanentResidentText: {
                type: String,
        },
        NoncitizenAuthorizedToWorExDate: {
                type: Date,
        },
        citizenshipDetails: {
                usCisNumber: {
                        type: String,
                },
                i94Number: {
                        type: String,
                },
                foreignPassportNumber: {
                        type: String,
                },
                countryOfIssuance: {
                        type: String,
                },
        },
        signature: {
                type: String,
        },
        attestationDate: {
                type: Date,
        },
        listA: [{
                documentTitle: {
                        type: String,
                },
                issuingAuthority: {
                        type: String,
                },
                documentNumber: {
                        type: String,
                },
                expirationDate: {
                        type: Date,
                },
        }],
        listB: [{
                documentTitle: {
                        type: String,
                },
                issuingAuthority: {
                        type: String,
                },
                documentNumber: {
                        type: String,
                },
                expirationDate: {
                        type: Date,
                },
        }],
        listC: [{
                documentTitle: {
                        type: String,
                },
                issuingAuthority: {
                        type: String,
                },
                documentNumber: {
                        type: String,
                },
                expirationDate: {
                        type: Date,
                },
        }],
        additionInfo: {
                type: String,
        },
        alternativeProcedureUsed: {
                type: Boolean,
        },
        certification: {
                verified: {
                        type: Boolean,
                },
                firstDayOfEmployment: {
                        type: Date,
                },
                employerName: {
                        type: String,
                },
                employerTitle: {
                        type: String,
                },
                employerSignature: {
                        type: String,
                },
                employerDate: {
                        type: Date,
                },
                businessName: {
                        type: String,
                },
                businessCity: {
                        type: String,
                },
                businessState: {
                        type: String,
                },
                businessZipCode: {
                        type: String,
                },
        },
        SupplementASection1: {
                lastName: {
                        type: String,
                },
                firstName: {
                        type: String,
                },
                middleInitial: {
                        type: String,
                },
        },
        SupplementAAttest: [{
                lastName: {
                        type: String,
                },
                firstName: {
                        type: String,
                },
                middleInitial: {
                        type: String,
                },
                street: {
                        type: String,
                },
                city: {
                        type: String,
                },
                state: {
                        type: String,
                },
                zipCode: {
                        type: String,
                },
                signature: {
                        type: String,
                },
                date: {
                        type: Date,
                },
        }],
        SupplementBSection1: {
                lastName: {
                        type: String,
                },
                firstName: {
                        type: String,
                },
                middleInitial: {
                        type: String,
                },
        },
        SupplementBAttest: [{
                dateOfRehire: {
                        type: Date,
                },
                lastName: {
                        type: String,
                },
                firstName: {
                        type: String,
                },
                middleInitial: {
                        type: String,
                },
                documentTitle: {
                        type: String,
                },
                issuingAuthority: {
                        type: String,
                },
                documentNumber: {
                        type: String,
                },
                expirationDate: {
                        type: Date,
                },
                additionalInfo: {
                        type: String,
                },
                alternativeProcedureUsed: {
                        type: Boolean,
                },
                employerName: {
                        type: String,
                },
                employerSignature: {
                        type: String,
                },
                employerDate: {
                        type: Date,
                },
        }],
});
const I9Form = mongoose.model('I9Form', i9Schema);
module.exports = I9Form;
