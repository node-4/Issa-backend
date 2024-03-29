const auth = require("../controller/employeeController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload, employeeTrackingUpload } = require('../middleware/imageupload')


module.exports = (app) => {
        app.post('/api/v1/employee/signin', auth.signin);
        app.get('/api/v1/employee/getProfile', authJwt.verifyToken, auth.getProfile);
        app.get('/api/v1/employee/getPatient', authJwt.verifyToken, auth.getPatient);
        app.get('/api/v1/employee/getEmployee', authJwt.verifyToken, auth.getEmployee);
        app.get('/api/v1/employee/getPatientById/:id', authJwt.verifyToken, auth.getPatientById);
        app.post("/api/v1/employee/forgetPassword", auth.forgetPassword);
        app.post("/api/v1/employee/forgotVerifyOtp", auth.forgotVerifyotp);
        app.post("/api/v1/employee/changePassword/:id", auth.changePassword);
        app.post('/api/v1/employee/updateImage', upload.single('image'), auth.updateImage);
        app.put('/api/v1/employee/updateProfile', authJwt.verifyToken, upload.single('image'), auth.updateProfile);
        app.post('/api/v1/employee/addEmployeeApplication', authJwt.verifyToken, auth.addEmployeeApplication);
        app.get('/api/v1/employee/viewEmployeeApplication', authJwt.verifyToken, auth.viewEmployeeApplication);
        app.get('/api/v1/employee/viewEmployeeApplicationByEmployeeId/:employeeId', authJwt.verifyToken, auth.viewEmployeeApplicationByEmployeeId);
        app.post('/api/v1/employee/addEmployeeEducation', authJwt.verifyToken, auth.addEmployeeEducation);
        app.get('/api/v1/employee/viewEmployeeEducation', authJwt.verifyToken, auth.viewEmployeeEducation);
        app.get('/api/v1/employee/viewEmployeeEducationByEmployeeId/:employeeId', authJwt.verifyToken, auth.viewEmployeeEducationByEmployeeId);
        app.post('/api/v1/employee/addEmployeeHistory', authJwt.verifyToken, auth.addEmployeeHistory);
        app.get('/api/v1/employee/viewEmployeeHistory', authJwt.verifyToken, auth.viewEmployeeHistory);
        app.get('/api/v1/employee/viewEmployeeHistoryByEmployeeId/:employeeId', authJwt.verifyToken, auth.viewEmployeeHistoryByEmployeeId);
        app.post('/api/v1/employee/addEmployeeOtherInfo', authJwt.verifyToken, auth.addEmployeeOtherInfo);
        app.get('/api/v1/employee/viewEmployeeOtherInfo', authJwt.verifyToken, auth.viewEmployeeOtherInfo);
        app.get('/api/v1/employee/viewEmployeeOtherInfoByEmployeeId/:employeeId', authJwt.verifyToken, auth.viewEmployeeOtherInfoByEmployeeId);
        app.post('/api/v1/employee/addEmployeeSkillAndQualification', authJwt.verifyToken, auth.addEmployeeSkillAndQualification);
        app.get('/api/v1/employee/viewEmployeeSkillAndQualification', authJwt.verifyToken, auth.viewEmployeeSkillAndQualification);
        app.get('/api/v1/employee/viewEmployeeSkillAndQualificationByEmployeeId/:employeeId', authJwt.verifyToken, auth.viewEmployeeSkillAndQualificationByEmployeeId);
        app.post('/api/v1/employee/createVisitLog', authJwt.verifyToken, auth.createVisitLog);
        app.get('/api/v1/employee/getAllVisitLog', authJwt.verifyToken, auth.getAllVisitLog);
        app.get('/api/v1/employee/getAllVisitLogByEmployeeId/:employeeId', authJwt.verifyToken, auth.getAllVisitLogByEmployeeId);
        app.get('/api/v1/employee/getVisitLogById/:id', authJwt.verifyToken, auth.getVisitLogById);
        app.put('/api/v1/employee/updateVisitLog/:id', authJwt.verifyToken, auth.updateVisitLog);
        app.delete('/api/v1/employee/deleteVisitLog/:id', authJwt.verifyToken, auth.deleteVisitLog);
        app.post('/api/v1/employee/createMileageLog', authJwt.verifyToken, auth.createMileageLog);
        app.get('/api/v1/employee/getAllMileageLog', authJwt.verifyToken, auth.getAllMileageLog);
        app.get('/api/v1/employee/getAllMileageLogByEmployeeId/:employeeId', authJwt.verifyToken, auth.getAllMileageLogByEmployeeId);
        app.get('/api/v1/employee/getMileageLogById/:id', authJwt.verifyToken, auth.getMileageLogById);
        app.put('/api/v1/employee/updateMileageLog/:id', authJwt.verifyToken, auth.updateMileageLog);
        app.delete('/api/v1/employee/deleteMileageLog/:id', authJwt.verifyToken, auth.deleteMileageLog);
        app.post('/api/v1/Shift/add', authJwt.verifyToken, auth.addShift);
        app.get('/api/v1/Shift/getAll', authJwt.verifyToken, auth.getAllShift);
        app.get('/api/v1/Shift/getById/:id', auth.getShiftById);
        app.delete('/api/v1/Shift/delete/:id', authJwt.verifyToken, auth.deleteShift);


        app.post('/api/v1/StaffSchedule/add', authJwt.verifyToken, auth.addStaffSchedule);
        app.get('/api/v1/StaffSchedule/getStaffScheduleForAdmins', authJwt.verifyToken, auth.getStaffScheduleForAdmin);
        app.get('/api/v1/StaffSchedule/getStaffSchedule', authJwt.verifyToken, auth.getStaffSchedule);
        app.get('/api/v1/StaffSchedule/getStaffScheduleByEmployeeId', authJwt.verifyToken, auth.getStaffScheduleByEmployeeId);
        app.post('/api/v1/employee/createEmployeeInServiceLog', authJwt.verifyToken, auth.createEmployeeInServiceLog);
        app.get('/api/v1/employee/getAllEmployeeInServiceLog', authJwt.verifyToken, auth.getAllEmployeeInServiceLog);
        app.get('/api/v1/employee/getAllEmployeeInServiceLogByEmployeeId/:employeeId', authJwt.verifyToken, auth.getAllEmployeeInServiceLogByEmployeeId);
        app.get('/api/v1/employee/getEmployeeInServiceLogById/:id', authJwt.verifyToken, auth.getEmployeeInServiceLogById);
        app.put('/api/v1/employee/updateEmployeeInServiceLog/:id', authJwt.verifyToken, auth.updateEmployeeInServiceLog);
        app.delete('/api/v1/employee/deleteEmployeeInServiceLog/:id', authJwt.verifyToken, auth.deleteEmployeeInServiceLog);
        app.post('/api/v1/employee/createOnSiteFacility', authJwt.verifyToken, auth.createOnSiteFacility);
        app.get('/api/v1/employee/getAllOnSiteFacility', authJwt.verifyToken, auth.getAllOnSiteFacility);
        app.get('/api/v1/employee/getAllOnSiteFacilityByEmployeeId/:employeeId', authJwt.verifyToken, auth.getAllOnSiteFacilityByEmployeeId);
        app.get('/api/v1/employee/getOnSiteFacilityById/:id', authJwt.verifyToken, auth.getOnSiteFacilityById);
        app.put('/api/v1/employee/updateOnSiteFacility/:id', authJwt.verifyToken, auth.updateOnSiteFacility);
        app.delete('/api/v1/employee/deleteOnSiteFacility/:id', authJwt.verifyToken, auth.deleteOnSiteFacility);
        app.post('/api/v1/employee/createSkillAndKnowledge', authJwt.verifyToken, auth.createSkillAndKnowledge);
        app.get('/api/v1/employee/getAllSkillAndKnowledge', authJwt.verifyToken, auth.getAllSkillAndKnowledge);
        app.get('/api/v1/employee/getAllSkillAndKnowledgeByEmployeeId/:employeeId', authJwt.verifyToken, auth.getAllSkillAndKnowledgeByEmployeeId);
        app.get('/api/v1/employee/getSkillAndKnowledgeById/:id', authJwt.verifyToken, auth.getSkillAndKnowledgeById);
        app.put('/api/v1/employee/updateSkillAndKnowledge/:id', authJwt.verifyToken, auth.updateSkillAndKnowledge);
        app.delete('/api/v1/employee/deleteSkillAndKnowledge/:id', authJwt.verifyToken, auth.deleteSkillAndKnowledge);
        app.get('/api/v1/employee/getAllBhrfTherapyTopic', auth.getAllBhrfTherapyTopic);
        app.post('/api/v1/employee/createTherapySession', authJwt.verifyToken, auth.createTherapySession);
        app.get('/api/v1/employee/getAllTherapySession', authJwt.verifyToken, auth.getAllTherapySession);
        app.get('/api/v1/employee/getAllTherapySessionForResident', authJwt.verifyToken, auth.getAllTherapySessionForResident);
        app.get('/api/v1/employee/getAllTherapySessionByemployeeId/:employeeId', authJwt.verifyToken, auth.getAllTherapySessionByemployeeId);
        app.get('/api/v1/employee/getTherapySessionById/:id', authJwt.verifyToken, auth.getTherapySessionById);
        app.delete('/api/v1/employee/deleteTherapySession/:id', authJwt.verifyToken, auth.deleteTherapySession);
        app.post('/api/v1/employee/createTimeOffRequest', authJwt.verifyToken, auth.createTimeOffRequest);
        app.get('/api/v1/employee/getAllTimeOffRequest', authJwt.verifyToken, auth.getAllTimeOffRequest);
        app.get('/api/v1/employee/getTimeOffRequestById/:id', authJwt.verifyToken, auth.getTimeOffRequestById);
        app.delete('/api/v1/employee/deleteTimeOffRequest/:id', authJwt.verifyToken, auth.deleteTimeOffRequest);
        app.post('/api/v1/employee/createEmployeePerformanceReview', authJwt.verifyToken, auth.createEmployeePerformanceReview);
        app.get('/api/v1/employee/getAllEmployeePerformanceReview', authJwt.verifyToken, auth.getAllEmployeePerformanceReview);
        app.get('/api/v1/employee/getEmployeePerformanceReviewById/:id', authJwt.verifyToken, auth.getEmployeePerformanceReviewById);
        app.delete('/api/v1/employee/deleteEmployeePerformanceReview/:id', authJwt.verifyToken, auth.deleteEmployeePerformanceReview);
        app.post('/api/v1/employee/createPatientTracking', authJwt.verifyToken, auth.createPatientTracking);
        app.get('/api/v1/employee/getAllPatientTracking/:patientId', authJwt.verifyToken, auth.getAllPatientTracking);
        app.get('/api/v1/employee/getPatientTrackingById/:id', authJwt.verifyToken, auth.getPatientTrackingById);
        app.post('/api/v1/employee/createPatientVitals', authJwt.verifyToken, auth.createPatientVitals);
        app.get('/api/v1/employee/getPatientVitalsByPatientId/:patientId', authJwt.verifyToken, auth.getPatientVitalsByPatientId);
        app.post('/api/v1/employee/createPrnMedicationLog', authJwt.verifyToken, auth.createPrnMedicationLog);
        app.get('/api/v1/employee/getPrnMedicationLogById/:id', authJwt.verifyToken, auth.getPrnMedicationLogById);
        app.put('/api/v1/employee/editPrnMedicationLogById/:id', authJwt.verifyToken, auth.editPrnMedicationLogById);
        app.get('/api/v1/employee/getAllPrnMedicationLog', authJwt.verifyToken, auth.getAllPrnMedicationLog);
        app.delete('/api/v1/employee/deletePrnMedicationLog/:id', authJwt.verifyToken, auth.deletePrnMedicationLog);
        app.post('/api/v1/employee/createInformedConsentForMedication', authJwt.verifyToken, auth.createInformedConsentForMedication);
        app.get('/api/v1/employee/getInformedConsentForMedicationById/:id', authJwt.verifyToken, auth.getInformedConsentForMedicationById);
        app.put('/api/v1/employee/editInformedConsentForMedicationById/:id', authJwt.verifyToken, auth.editInformedConsentForMedicationById);
        app.get('/api/v1/employee/getAllInformedConsentForMedication', authJwt.verifyToken, auth.getAllInformedConsentForMedication);
        app.delete('/api/v1/employee/deleteInformedConsentForMedication/:id', authJwt.verifyToken, auth.deleteInformedConsentForMedication);
        app.post('/api/v1/employee/createMedicationOpioidCount', authJwt.verifyToken, auth.createMedicationOpioidCount);
        app.get('/api/v1/employee/getMedicationOpioidCountById/:id', authJwt.verifyToken, auth.getMedicationOpioidCountById);
        app.put('/api/v1/employee/editMedicationOpioidCountById/:id', authJwt.verifyToken, auth.editMedicationOpioidCountById);
        app.get('/api/v1/employee/getAllMedicationOpioidCount', authJwt.verifyToken, auth.getAllMedicationOpioidCount);
        app.delete('/api/v1/employee/deleteMedicationOpioidCount/:id', authJwt.verifyToken, auth.deleteMedicationOpioidCount);
        app.post('/api/v1/employee/createMedicationReconciliation', authJwt.verifyToken, auth.createMedicationReconciliation);
        app.get('/api/v1/employee/getMedicationReconciliationById/:id', authJwt.verifyToken, auth.getMedicationReconciliationById);
        app.put('/api/v1/employee/editMedicationReconciliationById/:id', authJwt.verifyToken, auth.editMedicationReconciliationById);
        app.get('/api/v1/employee/getAllMedicationReconciliation', authJwt.verifyToken, auth.getAllMedicationReconciliation);
        app.delete('/api/v1/employee/deleteMedicationReconciliation/:id', authJwt.verifyToken, auth.deleteMedicationReconciliation);
        app.post('/api/v1/employee/createProgressNote', authJwt.verifyToken, auth.createProgressNote);
        app.get('/api/v1/employee/getProgressNoteById/:id', authJwt.verifyToken, auth.getProgressNoteById);
        app.put('/api/v1/employee/editProgressNoteById/:id', authJwt.verifyToken, auth.editProgressNoteById);
        app.get('/api/v1/employee/getAllProgressNote', authJwt.verifyToken, auth.getAllProgressNote);
        app.delete('/api/v1/employee/deleteProgressNote/:id', authJwt.verifyToken, auth.deleteProgressNote);
        app.post('/api/v1/employee/createDischargeSummary', authJwt.verifyToken, auth.createDischargeSummary);
        app.get('/api/v1/employee/getDischargeSummaryById/:id', authJwt.verifyToken, auth.getDischargeSummaryById);
        app.put('/api/v1/employee/editDischargeSummaryById/:id', authJwt.verifyToken, auth.editDischargeSummaryById);
        app.get('/api/v1/employee/getAllDischargeSummary', authJwt.verifyToken, auth.getAllDischargeSummary);
        app.delete('/api/v1/employee/deleteDischargeSummary/:id', authJwt.verifyToken, auth.deleteDischargeSummary);
        app.post('/api/v1/employee/createADLTrackingForm', authJwt.verifyToken, auth.createADLTrackingForm);
        app.get('/api/v1/employee/getADLTrackingFormById/:id', authJwt.verifyToken, auth.getADLTrackingFormById);
        app.put('/api/v1/employee/editADLTrackingFormById/:id', authJwt.verifyToken, auth.editADLTrackingFormById);
        app.get('/api/v1/employee/getAllADLTrackingForm', authJwt.verifyToken, auth.getAllADLTrackingForm);
        app.delete('/api/v1/employee/deleteADLTrackingForm/:id', authJwt.verifyToken, auth.deleteADLTrackingForm);
        app.post('/api/v1/employee/createFinancialTransactionsRecord', authJwt.verifyToken, auth.createFinancialTransactionsRecord);
        app.get('/api/v1/employee/getFinancialTransactionsRecordById/:id', authJwt.verifyToken, auth.getFinancialTransactionsRecordById);
        app.put('/api/v1/employee/editFinancialTransactionsRecordById/:id', authJwt.verifyToken, auth.editFinancialTransactionsRecordById);
        app.get('/api/v1/employee/getAllFinancialTransactionsRecord', authJwt.verifyToken, auth.getAllFinancialTransactionsRecord);
        app.delete('/api/v1/employee/deleteFinancialTransactionsRecord/:id', authJwt.verifyToken, auth.deleteFinancialTransactionsRecord);
        app.post('/api/v1/employee/createStaffingNote', authJwt.verifyToken, auth.createStaffingNote);
        app.get('/api/v1/employee/getStaffingNoteById/:id', authJwt.verifyToken, auth.getStaffingNoteById);
        app.put('/api/v1/employee/editStaffingNoteById/:id', authJwt.verifyToken, auth.editStaffingNoteById);
        app.get('/api/v1/employee/getAllStaffingNote', authJwt.verifyToken, auth.getAllStaffingNote);
        app.delete('/api/v1/employee/deleteStaffingNote/:id', authJwt.verifyToken, auth.deleteStaffingNote);
        app.post('/api/v1/employee/createAuthorizationForReleaseOfInformation', authJwt.verifyToken, auth.createAuthorizationForReleaseOfInformation);
        app.get('/api/v1/employee/getAuthorizationForReleaseOfInformationById/:id', authJwt.verifyToken, auth.getAuthorizationForReleaseOfInformationById);
        app.put('/api/v1/employee/editAuthorizationForReleaseOfInformationById/:id', authJwt.verifyToken, auth.editAuthorizationForReleaseOfInformationById);
        app.get('/api/v1/employee/getAllAuthorizationForReleaseOfInformation', authJwt.verifyToken, auth.getAllAuthorizationForReleaseOfInformation);
        app.delete('/api/v1/employee/deleteAuthorizationForReleaseOfInformation/:id', authJwt.verifyToken, auth.deleteAuthorizationForReleaseOfInformation);
        app.post('/api/v1/employee/createIncidentReportPartA', authJwt.verifyToken, auth.createIncidentReportPartA);
        app.post('/api/v1/employee/createIncidentReportPartB', authJwt.verifyToken, auth.createIncidentReportPartB);
        app.get('/api/v1/employee/getIncidentReportById/:id', authJwt.verifyToken, auth.getIncidentReportById);
        app.put('/api/v1/employee/editIncidentReportPartA/:id', authJwt.verifyToken, auth.editIncidentReportPartA);
        app.put('/api/v1/employee/editIncidentReportPartB/:id', authJwt.verifyToken, auth.editIncidentReportPartB);
        app.get('/api/v1/employee/getAllIncidentReport', authJwt.verifyToken, auth.getAllIncidentReport);
        app.delete('/api/v1/employee/deleteIncidentReport/:id', authJwt.verifyToken, auth.deleteIncidentReport);
        app.post('/api/v1/employee/createContactNote', authJwt.verifyToken, auth.createContactNote);
        app.get('/api/v1/employee/getContactNoteById/:id', authJwt.verifyToken, auth.getContactNoteById);
        app.put('/api/v1/employee/editContactNoteById/:id', authJwt.verifyToken, auth.editContactNoteById);
        app.get('/api/v1/employee/getAllContactNote', authJwt.verifyToken, auth.getAllContactNote);
        app.delete('/api/v1/employee/deleteContactNote/:id', authJwt.verifyToken, auth.deleteContactNote);
        app.post('/api/v1/employee/createUploadDocument', authJwt.verifyToken, upload.single('file'), auth.createUploadDocument);
        app.get('/api/v1/employee/getUploadDocumentById/:id', authJwt.verifyToken, auth.getUploadDocumentById);
        app.get('/api/v1/employee/getAllUploadDocument', authJwt.verifyToken, auth.getAllUploadDocument);
        app.delete('/api/v1/employee/deleteUploadDocument/:id', authJwt.verifyToken, auth.deleteUploadDocument);
        app.post('/api/v1/employee/createAppointment', authJwt.verifyToken, auth.createAppointment);
        app.get('/api/v1/employee/getAllTodayAppointments', authJwt.verifyToken, auth.getAllTodayAppointments);
        app.get('/api/v1/employee/getAllUpcomingAppointments', authJwt.verifyToken, auth.getAllUpcomingAppointments);
        app.get('/api/v1/employee/getAllPastAppointments', authJwt.verifyToken, auth.getAllPastAppointments);
        app.get('/api/v1/employee/getAllMedicationEmployee', authJwt.verifyToken, auth.getAllMedicationEmployee);
        app.post('/api/v1/employee/createPersonalInformation', authJwt.verifyToken, auth.createPersonalInformation);
        app.get('/api/v1/employee/getPersonalInformation', authJwt.verifyToken, auth.getPersonalInformation);
        app.delete('/api/v1/employee/deletePersonalInformation', authJwt.verifyToken, auth.deletePersonalInformation);
        app.get('/api/v1/employee/getMyOfferLetter', authJwt.verifyToken, auth.getAllOfferLetter);
        app.post('/api/v1/employee/createAppendix', authJwt.verifyToken, auth.createAppendix);
        app.get('/api/v1/employee/getAppendix', authJwt.verifyToken, auth.getAppendix);
        app.delete('/api/v1/employee/deleteAppendix', authJwt.verifyToken, auth.deleteAppendix);
        app.post('/api/v1/employee/createForms2023', authJwt.verifyToken, upload.single('image'), auth.createForms2023);
        app.get('/api/v1/employee/getForms2023', authJwt.verifyToken, auth.getForms2023);
        app.delete('/api/v1/employee/deleteForms2023', authJwt.verifyToken, auth.deleteForms2023);
        app.post('/api/v1/employee/createReferenceCheck', authJwt.verifyToken, auth.createReferenceCheck);
        app.get('/api/v1/employee/getReferenceCheckById/:id', authJwt.verifyToken, auth.getReferenceCheckById);
        app.put('/api/v1/employee/editReferenceCheckById/:id', authJwt.verifyToken, auth.editReferenceCheckById);
        app.get('/api/v1/employee/getReferenceCheck', authJwt.verifyToken, auth.getReferenceCheck);
        app.delete('/api/v1/employee/deleteReferenceCheck/:id', authJwt.verifyToken, auth.deleteReferenceCheck);
        app.get('/api/v1/employee/getMyJobDescription', authJwt.verifyToken, auth.getJobDescription);
        app.post('/api/v1/employee/updateJobDescription', authJwt.verifyToken, auth.updateJobDescription);
        app.post('/api/v1/employee/createApsConsent', authJwt.verifyToken, auth.createApsConsent);
        app.get('/api/v1/employee/getApsConsentById/:id', authJwt.verifyToken, auth.getApsConsentById);
        app.put('/api/v1/employee/editApsConsentById/:id', authJwt.verifyToken, auth.editApsConsentById);
        app.get('/api/v1/employee/getAllApsConsent', authJwt.verifyToken, auth.getAllApsConsent);
        app.delete('/api/v1/employee/deleteApsConsent/:id', authJwt.verifyToken, auth.deleteApsConsent);
        app.post('/api/v1/employee/createTermination', authJwt.verifyToken, auth.createTermination);
        app.get('/api/v1/employee/getTermination', authJwt.verifyToken, auth.getTermination);
        app.delete('/api/v1/employee/deleteTermination', authJwt.verifyToken, auth.deleteTermination);
        app.post('/api/v1/employee/createFw9', authJwt.verifyToken, upload.single('image'), auth.createFw9);
        app.get('/api/v1/employee/getFw9', authJwt.verifyToken, auth.getFw9);
        app.delete('/api/v1/employee/deleteFw9', authJwt.verifyToken, auth.deleteFw9);
        app.post('/api/v1/employee/createI9', authJwt.verifyToken, upload.single('image'), auth.createI9);
        app.get('/api/v1/employee/getI9', authJwt.verifyToken, auth.getI9);
        app.delete('/api/v1/employee/deleteI9', authJwt.verifyToken, auth.deleteI9);
        app.post('/api/v1/employee/createFW4', authJwt.verifyToken, upload.single('image'), auth.createFW4);
        app.get('/api/v1/employee/getFW4', authJwt.verifyToken, auth.getFW4);
        app.delete('/api/v1/employee/deleteFW4', authJwt.verifyToken, auth.deleteFW4);
        app.post('/api/v1/employee/createLrc1031A', authJwt.verifyToken, auth.createLrc1031A);
        app.get('/api/v1/employee/getLrc1031A', authJwt.verifyToken, auth.getLrc1031A);
        app.delete('/api/v1/employee/deleteLrc1031A', authJwt.verifyToken, auth.deleteLrc1031A);
        app.post('/api/v1/employee/createResidentSafetyPlan', authJwt.verifyToken, auth.createResidentSafetyPlan);
        app.get('/api/v1/employee/getResidentSafetyPlan/:patientId', authJwt.verifyToken, auth.getResidentSafetyPlan);
        app.post('/api/v1/employee/createTreatmentPlan', authJwt.verifyToken, auth.createTreatmentPlan);
        app.get('/api/v1/employee/getTreatmentPlan/:patientId', authJwt.verifyToken, auth.getTreatmentPlan);
        app.post('/api/v1/employee/createNursingAssessment', authJwt.verifyToken, auth.createNursingAssessment);
        app.get('/api/v1/employee/getNursingAssessment/:patientId', authJwt.verifyToken, auth.getNursingAssessment);
        app.post('/api/v1/employee/createResidentIntake', authJwt.verifyToken, auth.createResidentIntake);
        app.get('/api/v1/employee/ResidentIntake/:patientId', authJwt.verifyToken, auth.getResidentIntake);
        app.post('/api/v1/employee/createEmployeeTracking', auth.createEmployeeTracking);
        app.get('/api/v1/employee/EmployeeTracking/:employeeId', authJwt.verifyToken, auth.getEmployeeTracking);
        app.get('/api/v1/employee/EmployeeTrackingById/:id', authJwt.verifyToken, auth.getEmployeeTrackingById);
        app.post('/api/v1/employee/createMars', authJwt.verifyToken, auth.createMars);
        app.get('/api/v1/employee/Mars/:patientId', authJwt.verifyToken, auth.getMars);
        app.put('/api/v1/employee/Mars/:MarsId', authJwt.verifyToken, auth.updateMarsStatus);
        app.post('/api/v1/employee/createTimeSheet', auth.createTimeSheet);
        app.get('/api/v1/employee/getTimeSheet', auth.getTimeSheet);
        app.post('/api/v1/employee/attendanceMark', auth.attendanceMark);
}