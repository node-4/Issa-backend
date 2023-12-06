const auth = require("../controller/adminController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/admin/signin', auth.signin);
        app.get('/api/v1/admin/getProfile', authJwt.verifyToken, auth.getProfile);
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
}