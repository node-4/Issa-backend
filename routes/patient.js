const auth = require("../controller/patientController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/Patient/signin', auth.signin);
        app.get('/api/v1/Patient/getProfile', authJwt.verifyToken, auth.getProfile);
        app.put('/api/v1/Patient/updateProfile', authJwt.verifyToken, upload.single('image'), auth.updateProfile);
        app.post('/api/v1/Patient/createAppointment', authJwt.verifyToken, auth.createAppointment);
        app.get('/api/v1/Patient/getAllUpcomingAppointments', authJwt.verifyToken, auth.getAllUpcomingAppointments);
        app.get('/api/v1/Patient/getAllTodayAppointments', authJwt.verifyToken, auth.getAllTodayAppointments);
        app.get('/api/v1/Patient/getAllPastAppointments', authJwt.verifyToken, auth.getAllPastAppointments);
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
        app.post('/api/v1/Patient/createInitialAssessment', authJwt.verifyToken, auth.createInitialAssessment);
        app.get('/api/v1/Patient/InitialAssessment/:patientId', authJwt.verifyToken, auth.getInitialAssessment);
        app.post('/api/v1/Patient/createRefusalMedicalTreatment', authJwt.verifyToken, auth.createRefusalMedicalTreatment);
        app.get('/api/v1/Patient/getRefusalMedicalTreatment/:patientId', authJwt.verifyToken, auth.getRefusalMedicalTreatment);
        app.get('/api/v1/Patient/getOngoingMedications/:patientId', auth.getOngoingMedications);
        app.post('/api/v1/Patient/createFaceSheet', authJwt.verifyToken, auth.createFaceSheet);
        app.get('/api/v1/Patient/getFaceSheet/:patientId', authJwt.verifyToken, auth.getFaceSheet);
}