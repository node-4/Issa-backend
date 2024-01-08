const auth = require("../controller/patientController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/Patient/signin', auth.signin);
        app.get('/api/v1/Patient/getProfile', authJwt.verifyToken, auth.getProfile);
        app.put('/api/v1/Patient/updateProfile', authJwt.verifyToken, upload.single('image'), auth.updateProfile);
        app.post('/api/v1/Patient/createAppointment', authJwt.verifyToken, auth.createAppointment);
        app.get('/api/v1/Patient/getAllPatientTracking', authJwt.verifyToken, auth.getAllPatientTracking);
        app.get('/api/v1/Patient/getAllPatientMedication', authJwt.verifyToken, auth.getAllPatientMedication);
        app.post('/api/v1/Patient/createResidentSafetyPlan', auth.createResidentSafetyPlan);
        app.get('/api/v1/Patient/getResidentSafetyPlan/:patientId', authJwt.verifyToken, auth.getResidentSafetyPlan);
        app.post('/api/v1/Patient/createTreatmentPlan', authJwt.verifyToken, auth.createTreatmentPlan);
        app.get('/api/v1/Patient/getTreatmentPlan/:patientId', authJwt.verifyToken, auth.getTreatmentPlan);
        app.post('/api/v1/Patient/createNursingAssessment', authJwt.verifyToken, auth.createNursingAssessment);
        app.get('/api/v1/Patient/getNursingAssessment/:patientId', authJwt.verifyToken, auth.getNursingAssessment);
        app.post('/api/v1/Patient/createResidentIntake', authJwt.verifyToken, auth.createResidentIntake);
        app.get('/api/v1/Patient/ResidentIntake/:patientId', authJwt.verifyToken, auth.getResidentIntake);
}