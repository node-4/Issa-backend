const auth = require("../controller/employeeController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/employee/signin', auth.signin);
        app.get('/api/v1/employee/getProfile', authJwt.verifyToken, auth.getProfile);
        app.get('/api/v1/employee/getPatient', authJwt.verifyToken, auth.getPatient);
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
}