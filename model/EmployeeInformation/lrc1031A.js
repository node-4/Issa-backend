const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bhtJobDescriptionSchema = new mongoose.Schema({
    adminId: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
    employeeId: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    middleName: {
        type: String,
    },
    birthDate: {
        type: Date
    },
    address: {
        type: String,
    },
    street: {
        type: String,
    },
    apartNumber: {
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
    checkDirected: {
        type: String,
        enum: ['A', 'B'],
    },
    checkDirectedA: {
        type: String,
        default: "I have not been convicted of nor am I under pending indictment for any crimes."
    },
    checkDirectedB: {
        type: String,
        default: "I have been convicted of or I am under pending indictment for the following crime(s) (Provide dates, location/ jurisdiction, circumstances and outcome. Attach additional pages as needed)."
    },
    checkDirectedData: [{
        date: {
            type: Date
        },
        location: {
            type: String,
        },
        circumstances: {
            type: String,
        },
        outcome: {
            type: String,
        },
    }],
    checkAlso: {
        type: String,
        enum: ['A', 'B'],
    },
    checkAlsoA: {
        type: String,
        default: "I am not subject to registration as a sex offender in Arizona or in any other jurisdiction."
    },
    checkAlsoB: {
        type: String,
        default: "I am subject to registration as a sex offender in Arizona or in any other jurisdiction. (If you are subject to registration as a sex offender in this state or any other jurisdiction, DPS will deny you a Level 1 Fingerprint Clearance Card and you WILL NOT be eligible to appeal the decision.)"
    },
    isCertified: {
        type: Boolean
    },
    certificationSignature: {
        type: String,
    },
    certificationDate: {
        type: Date
    },
    notaryPublicCountryOf: {
        type: String,
    },
    notaryPublicDate: {
        type: String,
    },
    notaryPublicMonth: {
        type: String,
    },
    notaryPublicYear: {
        type: String,
    },
    notaryPublicCommissionExpiration: {
        type: Date
    },
    notaryPublicSignature: {
        type: String,
    },
    nonAppealableOffenses: {
        SexualAbuseOfVulnerableAdult: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Incest: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Homicide: {
            type: String,
            enum: ['Yes', 'No'],
        },
        SexualAssault: {
            type: String,
            enum: ['Yes', 'No'],
        },
        SexualExploitationOfMinorOrVulnerableAdult: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CommercialSexualExploitationOfMinorOrVulnerableAdult: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ChildProstitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ChildAbuse: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FelonyChildNeglect: {
            type: String,
            enum: ['Yes', 'No'],
        },
        SexualConductWithMinor: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MolestationOfChildOrVulnerableAdult: {
            type: String,
            enum: ['Yes', 'No'],
        },
        DangerousCrimeAgainstChildren: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ExploitationOfMinorsInvolvingDrugOffenses: {
            type: String,
            enum: ['Yes', 'No'],
        },
        TakingChildForProstitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        NeglectOrAbuseOfVulnerableAdult: {
            type: String,
            enum: ['Yes', 'No'],
        },
        SexTrafficking: {
            type: String,
            enum: ['Yes', 'No'],
        },
        SexualAbuse: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ObsceneItems: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FurnishingHarmfulItemsToMinors: {
            type: String,
            enum: ['Yes', 'No'],
        },
        InternetActivityFurnishingHarmfulItemsToMinors: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ObsceneOrIndecentTelephoneCommunicationsToMinors: {
            type: String,
            enum: ['Yes', 'No'],
        },
        LuringAMinorForSexualExploitation: {
            type: String,
            enum: ['Yes', 'No'],
        },
        EnticementOfPersonsForProstitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ProcurementByFalsePretensesForProstitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ProcuringOrPlacingPersonsInHouseOfProstitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ReceivingEarningsOfProstitute: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CausingSpouseToBecomeAProstitute: {
            type: String,
            enum: ['Yes', 'No'],
        },
        DetentionOfPersonsInHouseOfProstitutionForDebt: {
            type: String,
            enum: ['Yes', 'No'],
        },
        KeepingOrResidingInHouseOfProstitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Pandering: {
            type: String,
            enum: ['Yes', 'No'],
        },
        TraffickingOfPersonsForForcedLaborOrServices: {
            type: String,
            enum: ['Yes', 'No'],
        },
        TransportingPersonsForPurposeOfProstitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        PortrayingAdultAsMinor: {
            type: String,
            enum: ['Yes', 'No'],
        },
        AdmittingMinorsToPublicDisplaysOfSexualConduct: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FelonyContributingToDelinquencyOfMinor: {
            type: String,
            enum: ['Yes', 'No'],
        },
        UnlawfulSaleOrPurchaseOfChildren: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ChildBigamy: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FelonyOffenseInvolvingDomesticViolence: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FelonyIndecentExposure: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FelonyPublicSexualIndecency: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FelonyDUIWithin5YearsOfApplyingForClearanceCard: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Terrorism: {
            type: String,
            enum: ['Yes', 'No'],
        },
        OffenseInvolvingViolentCrime: {
            type: String,
            enum: ['Yes', 'No'],
        },
    },
    appealable5YearsAfterConviction: {
        Endangerment: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        ThreateningOrIntimidating: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        Assault: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        AggravatedAssault: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        UnlawfullyAdministeringIntoxicatingSubstances: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        DangerousOrDeadlyAssaultByPrisonerOrJuvenile: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PrisonersWhoCommitAssaultWithIntentToInciteRiot: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        AssaultByViciousAnimals: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        DriveByShooting: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        AssaultsOnPublicSafetyEmployeesOrVolunteers: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        DischargingFirearmAtStructure: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PrisonerAssaultWithBodilyFluids: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        AimingLaserPointerAtPeaceOfficer: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PossessionAndSaleOfPeyote: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PossessionAndSaleOfVaporReleasingSubstanceContainingToxicSubstance: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        SaleOfRegulatedChemicals: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        SaleOfPrecursorChemicals: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        ProductionOrTransportationOfMarijuana: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PossessionUseOrSaleOfMarijuanaDangerousDrugsOrNarcoticDrugs: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PossessionUseAdministrationAcquisitionSaleManufactureOrTransportationOfPrescriptionOnlyDrugs: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        AdministrationAcquisitionManufactureOrTransportationOfDangerousDrugsOrNarcoticDrugs: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        ManufacturingMethamphetamineUnderCircumstancesCausingInjuryToMinorUnder15: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        InvolvingOrUsingMinorsInDrugOffenses: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PossessionUseSaleOrTransferOfVariousSubstancesInDrugFreeSchoolZone: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        PossessionManufactureDeliveryAndAdvertisementOfDrugParaphernalia: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        UseOfWireOrElectronicCommunicationInDrugRelatedTransactions: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        UsingABuildingForSaleOrManufactureOfDangerousOrNarcoticDrugs: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        ManufactureOrDistributionOfPrescriptionOnlyDrug: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        ManufactureDistributionPossessionOrPossessionWithIntentToUseImitationControlledSubstancesOrDrugs: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        },
        ManufactureOfCertainSubstancesAndDrugsByCertainMeans: {
            type: String,
            enum: ['WITHIN 5 YEARS', 'OVER 5 YEARS', 'No'],
        }
    },
    appealableOffenses: {
        Theft: {
            type: String,
            enum: ['Yes', 'No'],
        },
        TheftByExtortion: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Shoplifting: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Forgery: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CriminalPossessionOfForgeryDevice: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ObtainingSignatureByDeception: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CriminalImpersonation: {
            type: String,
            enum: ['Yes', 'No'],
        },
        TheftOfCreditCardOrObtainingByFraudulentMeans: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ReceiptOfAnythingObtainedByFraudulentUseOfCreditCard: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ForgeryOfCreditCard: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FraudulentUseOfCreditCard: {
            type: String,
            enum: ['Yes', 'No'],
        },
        PossessionOfIncompleteCreditCard: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FalseStatementsToObtainCreditCard: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FraudByPersonsAuthorizedToProvideGoodsOrServices: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CreditCardTransactionRecordTheft: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisconductInvolvingWeapons: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisconductInvolvingExplosives: {
            type: String,
            enum: ['Yes', 'No'],
        },
        DepositingExplosives: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisconductInvolvingSimulatedExplosives: {
            type: String,
            enum: ['Yes', 'No'],
        },
        ConcealedWeaponViolation: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorIndecentExposure: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPublicSexualIndecency: {
            type: String,
            enum: ['Yes', 'No'],
        },
        AggravatedCriminalDamage: {
            type: String,
            enum: ['Yes', 'No'],
        },
        AddingPoisonOrHarmfulSubstanceToFoodDrinkMedicine: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CriminalOffenseInvolvingCriminalTrespass: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CriminalOffenseInvolvingCriminalBurglary: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CriminalOffenseInvolvingOrganizedCrimeOrFraud: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorOffensesInvolvingChildNeglect: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorOffensesInvolvingContributingToDelinquencyOfMinor: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorOffensesInvolvingDomesticViolence: {
            type: String,
            enum: ['Yes', 'No'],
        },
        FelonyOffensesInvolvingDomesticViolence: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Arson: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CriminalDamage: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisappropriationOfCharterSchoolMonies: {
            type: String,
            enum: ['Yes', 'No'],
        },
        TakingIdentityOfAnotherPersonOrEntity: {
            type: String,
            enum: ['Yes', 'No'],
        },
        AggravatedTakingIdentityOfAnotherPersonOrEntity: {
            type: String,
            enum: ['Yes', 'No'],
        },
        TraffickingInIdentityOfAnotherPersonOrEntity: {
            type: String,
            enum: ['Yes', 'No'],
        },
        CrueltyToAnimals: {
            type: String,
            enum: ['Yes', 'No'],
        },
        Prostitution: {
            type: String,
            enum: ['Yes', 'No'],
        },
        SaleOrDistributionOfMaterialHarmfulToMinors: {
            type: String,
            enum: ['Yes', 'No'],
        },
        WelfareFraud: {
            type: String,
            enum: ['Yes', 'No'],
        },
        RobberyAggravatedRobberyOrArmedRobbery: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorEndangerment: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorThreateningOrIntimidating: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorAssault: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorAggravatedAssault: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorUnlawfullyAdministeringIntoxicatingLiquorNarcoticDrugsOrDangerousDrugs: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorDangerousOrDeadlyAssaultByPrisonerOrJuvenile: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPrisonersWhoCommitAssaultWithIntentToInciteRiot: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorAssaultByViciousAnimals: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorDriveByShooting: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorAssaultsOnPublicSafetyEmployeesOrVolunteersAndStateHospitalEmployees: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorDischargingFirearmAtStructure: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPrisonerAssaultWithBodilyFluids: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorAimingLaserPointerAtPeaceOfficer: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPossessionAndSaleOfPeyote: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPossessionAndSaleOfVaporReleasingSubstanceContainingToxicSubstance: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorSellingOrGivingNitrousOxideToUnderagePersons: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorSaleOfRegulatedChemicals: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorSaleOfPrecursorChemicals: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorProductionOrTransportationOfMarijuana: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPossessionUseOrSaleOfMarijuanaDangerousDrugsOrNarcoticDrugs: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPossessionUseAdministrationAcquisitionSaleManufactureOrTransportationOfPrescriptionOnlyDrugs: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorAdministrationAcquisitionManufactureOrTransportationOfDangerousDrugsOrNarcoticDrugs: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorManufacturingMethamphetamineUnderCircumstancesCausingInjuryToMinorUnder15: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorInvolvingOrUsingMinorsInDrugOffenses: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPossessionUseSaleOrTransferOfMarijuanaPeyotePrescriptionDrugsDangerousDrugsOrNarcoticDrugsOrManufactureInDrugFreeSchoolZone: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorPossessionManufactureDeliveryAndAdvertisementOfDrugParaphernalia: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorUseOfWireCommunicationOrElectronicCommunicationInDrugRelatedTransactions: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorUsingBuildingForSaleOrManufactureOfDangerousOrNarcoticDrugs: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorManufactureOrDistributionOfPrescriptionOnlyDrug: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorManufactureDistributionOrPossessionWithIntentToUseImitationControlledSubstancesOrDrugs: {
            type: String,
            enum: ['Yes', 'No'],
        },
        MisdemeanorManufactureOfCertainSubstancesAndDrugsByCertainMeans: {
            type: String,
            enum: ['Yes', 'No'],
        },
    }
});
const BHTJobDescription = mongoose.model('lrc1031A', bhtJobDescriptionSchema);
module.exports = BHTJobDescription;
