const auth = require("../controller/adminController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/admin/addStaffScheduleAdministrator', authJwt.verifyToken, auth.addStaffScheduleAdministrator);
        app.get('/api/v1/admin/getStaffScheduleAdministratorForAdmin', authJwt.verifyToken, auth.getStaffScheduleAdministratorForAdmin);
        app.post('/api/v1/admin/signin', auth.signin);
        app.get('/api/v1/admin/getProfile', authJwt.verifyToken, auth.getProfile);
        app.put('/api/v1/admin/updateProfile', authJwt.verifyToken, upload.single('image'), auth.updateProfile);
        app.post('/api/v1/admin/createUser', authJwt.verifyToken, upload.single('file'), auth.createUser);
        app.get('/api/v1/admin/getUser', authJwt.verifyToken, auth.getUser);
        app.get('/api/v1/admin/getUserById/:id', authJwt.verifyToken, auth.getUserById);
        app.put('/api/v1/admin/providePermission/:id', authJwt.verifyToken, auth.providePermission);
        app.delete('/api/v1/admin/deleteUser/:id', authJwt.verifyToken, auth.deleteUser);
        app.post('/api/v1/admin/addAdminTracking', authJwt.verifyToken, auth.addAdminTracking);
        app.get('/api/v1/admin/getAdminTrackingById/:id', auth.getAdminTrackingById);
        app.put('/api/v1/admin/updateAdminTracking/:id', authJwt.verifyToken, auth.updateAdminTracking);
        app.delete('/api/v1/admin/deleteAdminTracking/:id', authJwt.verifyToken, auth.deleteAdminTracking);
        app.get('/api/v1/admin/getAdminTracking', authJwt.verifyToken, auth.getAdminTracking);
        app.post('/api/v1/admin/addAdmitDetails', authJwt.verifyToken, auth.addAdmitDetails);
        app.get('/api/v1/admin/getAdmitDetailsById/:id', auth.getAdmitDetailsById);
        app.put('/api/v1/admin/updateAdmitDetails/:id', authJwt.verifyToken, auth.updateAdmitDetails);
        app.delete('/api/v1/admin/deleteAdmitDetails/:id', authJwt.verifyToken, auth.deleteAdmitDetails);
        app.get('/api/v1/admin/getAdmitDetails', authJwt.verifyToken, auth.getAdmitDetails);
        app.post('/api/v1/admin/addTask', authJwt.verifyToken, auth.addTask);
        app.get('/api/v1/admin/getTaskById/:id', auth.getTaskById);
        app.put('/api/v1/admin/markAsDoneTask/:id', authJwt.verifyToken, auth.markAsDoneTask);
        app.delete('/api/v1/admin/deleteTask/:id', authJwt.verifyToken, auth.deleteTask);
        app.get('/api/v1/admin/getTask', authJwt.verifyToken, auth.getAllTask);
        app.post('/api/v1/admin/addReceipt', authJwt.verifyToken, upload.single('file'), auth.addReceipt);
        app.get('/api/v1/admin/getRecieptById/:id', auth.getRecieptById);
        app.get('/api/v1/admin/getAllReceipt', authJwt.verifyToken, auth.getAllReceipt);
        app.post('/api/v1/admin/addFirstAidChecklist', authJwt.verifyToken, auth.addFirstAidChecklist);
        app.post('/api/v1/admin/addFireEquipementMonitoring', authJwt.verifyToken, auth.addFireEquipementMonitoring);
        app.put('/api/v1/admin/editFireEquipementMonitoring/:id', authJwt.verifyToken, auth.editFireEquipementMonitoring);


        app.post('/api/v1/admin/addEvacuationAndFireDrill', authJwt.verifyToken, auth.addEvacuationAndFireDrill);
        app.post('/api/v1/admin/addDisasterDrill', authJwt.verifyToken, auth.addDisasterDrill);
        app.post('/api/v1/admin/addWeeklyVehicleInspectionChecklist', authJwt.verifyToken, auth.addWeeklyVehicleInspectionChecklist);
        app.post('/api/v1/admin/addClinicalOversight', authJwt.verifyToken, auth.addClinicalOversight);
        app.post('/api/v1/admin/addMonthlyVehicleInspection', authJwt.verifyToken, auth.addMonthlyVehicleInspection);
        app.post('/api/v1/admin/addVanEmergencyInformationForm', authJwt.verifyToken, auth.addVanEmergencyInformationForm);
        app.post('/api/v1/admin/addQualityManagement', authJwt.verifyToken, auth.addQualityManagement);
        app.post('/api/v1/admin/addInfectiousData', authJwt.verifyToken, auth.addInfectiousData);
        app.post('/api/v1/admin/addIncidentReport', authJwt.verifyToken, auth.addIncidentReport);
        app.post('/api/v1/admin/addDisasterPlanReview', authJwt.verifyToken, auth.addDisasterPlanReview);
        app.get('/api/v1/admin/getAllNotes', authJwt.verifyToken, auth.getAllNotes);
        app.get('/api/v1/admin/getNotesById/:id', auth.getNotesById);
        app.delete('/api/v1/admin/deleteNotes/:id', authJwt.verifyToken, auth.deleteNotes);

        app.post('/api/v1/admin/addBhrfTherapyTopic', authJwt.verifyToken, auth.addBhrfTherapyTopic);
        app.put('/api/v1/admin/editBhrfTherapyTopic/:id', authJwt.verifyToken, auth.editBhrfTherapyTopic)
        app.get('/api/v1/admin/getBhrfTherapyTopicById/id', auth.getBhrfTherapyTopicById)
        app.get('/api/v1/admin/getAllBhrfTherapyTopic', authJwt.verifyToken, auth.getAllBhrfTherapyTopic);
        app.delete('/api/v1/admin/deleteBhrfTherapyTopic/:id', authJwt.verifyToken, auth.deleteBhrfTherapyTopic);
        app.get('/api/v1/admin/getAllTimeOffRequestForAdmin', authJwt.verifyToken, auth.getAllTimeOffRequestForAdmin);
        app.put('/api/v1/admin/updateTimeOffRequestStatus/:id', authJwt.verifyToken, auth.updateTimeOffRequestStatus);
        app.get('/api/v1/admin/getAllEmployeePerformanceReviewForAdmin', authJwt.verifyToken, auth.getAllEmployeePerformanceReviewForAdmin);
        app.put('/api/v1/admin/updateEmployeePerformanceReview/:id', authJwt.verifyToken, auth.updateEmployeePerformanceReview);
        app.get('/api/v1/admin/getAllPatientTracking', authJwt.verifyToken, auth.getAllPatientTracking);
        app.put('/api/v1/admin/updateDueDateInPatientTracking/:id', authJwt.verifyToken, auth.updateDueDateInPatientTracking);

        app.get('/api/v1/admin/getPatientVitalsByPatientId/:patientId', authJwt.verifyToken, auth.getPatientVitalsByPatientId);
        app.post('/api/v1/admin/assignPatientToEmployee', authJwt.verifyToken, auth.assignPatientToEmployee);
        app.post('/api/v1/admin/unAssignPatientToEmployee', authJwt.verifyToken, auth.unAssignPatientToEmployee);
        app.post('/api/v1/admin/addMedicationEmployee', authJwt.verifyToken, auth.addMedicationEmployee);
        app.get('/api/v1/admin/getMedicationEmployeeById/:id', auth.getMedicationEmployeeById);
        app.put('/api/v1/admin/updateMedicationEmployee/:id', authJwt.verifyToken, auth.updateMedicationEmployee);
        app.delete('/api/v1/admin/deleteMedicationEmployee/:id', authJwt.verifyToken, auth.deleteMedicationEmployee);
        app.get('/api/v1/admin/getAllMedicationEmployee', authJwt.verifyToken, auth.getAllMedicationEmployee);
        app.put("/api/v1/admin/addInstructionInMedicationEmployee/:id", authJwt.verifyToken, auth.addInstructionInMedicationEmployee);
        app.delete("/api/v1/admin/deleteInstructionInMedicationEmployee/:id/:instructionId", authJwt.verifyToken, auth.deleteInstructionInMedicationEmployee);
        app.post('/api/v1/admin/createPatientMedication', authJwt.verifyToken, upload.single('file'), auth.createPatientMedication);
        app.get('/api/v1/admin/getPatientMedicationById/:id', authJwt.verifyToken, auth.getPatientMedicationById);
        app.get('/api/v1/admin/getAllPatientMedication', authJwt.verifyToken, auth.getAllPatientMedication);
        app.delete('/api/v1/admin/deletePatientMedication/:id', authJwt.verifyToken, auth.deletePatientMedication);
        app.post('/api/v1/admin/addOfferLetter', authJwt.verifyToken, auth.addOfferLetter);
        app.get('/api/v1/admin/getOfferLetterById/:id', authJwt.verifyToken, auth.getOfferLetterById);
        app.get('/api/v1/admin/getAllOfferLetter', authJwt.verifyToken, auth.getAllOfferLetter);
        app.delete('/api/v1/admin/deleteOfferLetter/:id', authJwt.verifyToken, auth.deleteOfferLetter);
        app.post('/api/v1/admin/addJobDescription', authJwt.verifyToken, auth.addJobDescription);
        app.get('/api/v1/admin/getJobDescriptionById/:id', authJwt.verifyToken, auth.getJobDescriptionById);
        app.get('/api/v1/admin/getAllJobDescription', authJwt.verifyToken, auth.getAllJobDescription);
        app.delete('/api/v1/admin/deleteJobDescription/:id', authJwt.verifyToken, auth.deleteJobDescription);
        app.post('/api/v1/admin/sendNotification', auth.sendNotification);
        app.get('/api/v1/admin/allNotification', authJwt.verifyToken, auth.allNotification);
        app.post("/api/v1/takeSubscription/:id", auth.takeSubscription);
        app.post("/api/v1/verifySubscription/:transactionId", auth.verifySubscription);
}