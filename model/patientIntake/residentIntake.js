const mongoose = require('mongoose');
const schema = mongoose.Schema;
const consentFormSchema = new mongoose.Schema({
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
        companyName: {
                type: String
        },
        residentName: {
                type: String
        },
        residentSignature: {
                type: String
        },
        residentDate: {
                type: Date,
        },
        guardianRepresentativeName: {
                type: String
        },
        guardianRepresentativeSignature: {
                type: String
        },
        guardianRepresentativeDate: {
                type: Date,
        },
        staffName: {
                type: String
        },
        staffSignature: {
                type: String
        },
        staffDate: {
                type: Date,
        },
        internalDisclosureList: [{
                personName: {
                        type: String
                },
                relationship: {
                        type: String
                },
                contactNumber: {
                        type: String
                },
        }],
        internalDisclosureListExpire: {
                type: Date,
        },
        internalDisclosureListResidentName: {
                type: String
        },
        internalDisclosureListResidentSignature: {
                type: String
        },
        internalDisclosureListResidentDate: {
                type: Date,
        },
        internalDisclosureListGuardianRepresentativeName: {
                type: String
        },
        internalDisclosureListGuardianRepresentativeSignature: {
                type: String
        },
        internalDisclosureListGuardianRepresentativeDate: {
                type: Date,
        },
        internalDisclosureListStaffName: {
                type: String
        },
        internalDisclosureListStaffSignature: {
                type: String
        },
        internalDisclosureListStaffDate: {
                type: Date,
        },
        residentRightsResidentName: {
                type: String
        },
        residentRightsResidentSignature: {
                type: String
        },
        residentRightsResidentDate: {
                type: Date,
        },
        residentRightsGuardianRepresentativeName: {
                type: String
        },
        residentRightsGuardianRepresentativeSignature: {
                type: String
        },
        residentRightsGuardianRepresentativeDate: {
                type: Date,
        },
        photoVideoConsentResidentName: {
                type: String
        },
        photoVideoConsentDateOfBirth: {
                type: Date,
        },
        photoVideoConsentAdmissionDate: {
                type: Date,
        },
        photoVideoConsentConsentGiven: {
                type: Boolean,
                default: false
        },
        photoVideoConsentConsentWithdrawn: {
                type: Boolean,
                default: false
        },
        photoVideoConsentResidentName: {
                type: String
        },
        photoVideoConsentResidentSignature: {
                type: String
        },
        photoVideoConsentResidentDate: {
                type: Date,
        },
        photoVideoConsentGuardianRepresentativeName: {
                type: String
        },
        photoVideoConsentGuardianRepresentativeSignature: {
                type: String
        },
        photoVideoConsentGuardianRepresentativeDate: {
                type: Date,
        },
        advanceDirectivesResidentName: {
                type: String
        },
        advanceDirectivesResidentGender: {
                type: String
        },
        advanceDirectivesResidentDateOfBirth: {
                type: Date,
        },
        advanceDirectivesResidentAddress: {
                type: String
        },
        advanceDirectivesResidentDate: {
                type: Date,
        },
        advanceDirectivesProvidedInfoInitials: {
                type: String
        },
        advanceDirectivesProvidedInfoDate: {
                type: Date,
        },
        advanceDirectivesProvidedInfoRefusingInitials: {
                type: String
        },
        advanceDirectivesProvidedInfoRefusingDate: {
                type: Date,
        },
        advanceDirectivesDeveloped: {
                type: Boolean,
                default: false
        },
        advanceDirectivesDevelopedComment: {
                type: String
        },
        advanceDirectivesExecutedInRecord: {
                type: Boolean,
                default: false
        },
        advanceDirectivesExecutedInRecordComment: {
                type: String
        },
        advanceDirectivesFilingStatusWishNotFiled: {
                type: Boolean,
                default: false
        },
        advanceDirectivesFilingStatusAskedForCopyNotProvided: {
                type: Boolean,
                default: false
        },
        advanceDirectivesFilingStatusOther: {
                type: Boolean,
                default: false
        },
        advanceDirectivesCoordinationOfCareCopySentToPCP: {
                type: Boolean,
                default: false
        },
        advanceDirectivesCoordinationOfCareActedOn: {
                type: Boolean,
                default: false
        },
        advanceDirectivesCoordinationOfCareAppropriatePartiesNotified: {
                type: Boolean,
                default: false
        },
        advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment: {
                type: String
        },
        complaintProcessAcknowledgementCompany: {
                type: String
        },
        complaintProcessAcknowledgementResidentName: {
                type: String
        },
        complaintProcessAcknowledgementResidentSignature: {
                type: String
        },
        complaintProcessAcknowledgementResidentDate: {
                type: Date,
        },
        complaintProcessAcknowledgementGuardianRepresentativeName: {
                type: String
        },
        complaintProcessAcknowledgementGuardianRepresentativeSignature: {
                type: String
        },
        complaintProcessAcknowledgementGuardianRepresentativeDate: {
                type: Date,
        },
        orientationToAgencyCompany: {
                type: String
        },
        orientationToAgencyResidentName: {
                type: String
        },
        orientationToAgencyResidentSignature: {
                type: String
        },
        orientationToAgencyResidentDate: {
                type: Date,
        },
        orientationToAgencyGuardianRepresentativeName: {
                type: String
        },
        orientationToAgencyGuardianRepresentativeSignature: {
                type: String
        },
        orientationToAgencyGuardianRepresentativeDate: {
                type: Date,
        },
        promotionTalkStrategicApproach: {
                type: String
        },
        lockBoxKeyIssueReturnDateKeyIssued: {
                type: Date,
        },
        lockBoxKeyIssueReturnDateKeyReturned: {
                type: Date,
        },
        lockBoxKeyIssueReturnAddress: {
                type: String
        },
        lockBoxKeyIssueReturnResponsibleFor: {
                type: String
        },
        lockBoxKeyIssueReturnResponsibleForCorporation: {
                type: String
        },
        lockBoxKeyIssueReturnCharged: {
                type: Number
        },
        lockBoxKeyIssueReturnResidentName: {
                type: String
        },
        lockBoxKeyIssueReturnResidentSignature: {
                type: String
        },
        lockBoxKeyIssueReturnResidentDate: {
                type: Date,
        },
        lockBoxKeyIssueReturnGuardianRepresentativeName: {
                type: String
        },
        lockBoxKeyIssueReturnGuardianRepresentativeSignature: {
                type: String
        },
        lockBoxKeyIssueReturnGuardianRepresentativeDate: {
                type: Date,
        },
        lockBoxKeyIssueReturnStaffName: {
                type: String
        },
        lockBoxKeyIssueReturnStaffSignature: {
                type: String
        },
        lockBoxKeyIssueReturnStaffDate: {
                type: Date,
        },
        insuranceInformationPrimaryInsurancePolicyholderName: {
                type: String
        },
        insuranceInformationPrimaryInsurancePolicyholderDateOfBirth: {
                type: Date,
        },
        insuranceInformationPrimaryInsurancePolicyholderAddress: {
                type: String
        },
        insuranceInformationPrimaryInsurancePolicyholderCity: {
                type: String
        },
        insuranceInformationPrimaryInsurancePolicyholderState: {
                type: String
        },
        insuranceInformationPrimaryInsurancePolicyholderZip: {
                type: String
        },
        insuranceInformationPrimaryInsurancePolicyholderPhone: {
                type: String
        },
        insuranceInformationPrimaryInsurancePolicyholderRelationship: {
                type: String
        },
        insuranceInformationPrimaryInsuranceCompany: {
                type: String
        },
        insuranceInformationPrimaryInsuranceCustomerServicePhone: {
                type: String
        },
        insuranceInformationPrimaryInsuranceSubscriberNumber: {
                type: String
        },
        insuranceInformationPrimaryInsuranceSubscriberGroup: {
                type: String
        },
        insuranceInformationPrimaryInsuranceSubscriberEffectiveDate: {
                type: Date,
        },
        insuranceInformationSecondaryInsurancePolicyholderName: {
                type: String
        },
        insuranceInformationSecondaryInsurancePolicyholderDateOfBirth: {
                type: Date,
        },
        insuranceInformationSecondaryInsurancePolicyholderAddress: {
                type: String
        },
        insuranceInformationSecondaryInsurancePolicyholderCity: {
                type: String
        },
        insuranceInformationSecondaryInsurancePolicyholderState: {
                type: String
        },
        insuranceInformationSecondaryInsurancePolicyholderZip: {
                type: String
        },
        insuranceInformationSecondaryInsurancePolicyholderPhone: {
                type: String
        },
        insuranceInformationSecondaryInsurancePolicyholderRelationship: {
                type: String
        },
        insuranceInformationSecondaryInsuranceCompany: {
                type: String
        },
        insuranceInformationSecondaryInsuranceCustomerServicePhone: {
                type: String
        },
        insuranceInformationSecondaryInsuranceSubscriberNumber: {
                type: String
        },
        insuranceInformationSecondaryInsuranceSubscriberGroup: {
                type: String
        },
        insuranceInformationSecondaryInsuranceSubscriberEffectiveDate: {
                type: Date,
        },
        obligationsAndAuthorizationResidentName: {
                type: String
        },
        obligationsAndAuthorizationResidentSignature: {
                type: String
        },
        obligationsAndAuthorizationResidentDate: {
                type: Date,
        },
        obligationsAndAuthorizationGuardianRepresentativeName: {
                type: String
        },
        obligationsAndAuthorizationGuardianRepresentativeSignature: {
                type: String
        },
        obligationsAndAuthorizationGuardianRepresentativeDate: {
                type: Date,
        },
});
const ConsentForm = mongoose.model('residentIntake', consentFormSchema);
module.exports = ConsentForm;
