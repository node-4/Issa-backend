const auth = require("../controller/superAdminController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/superAdmin/registration', auth.registration);
        app.post('/api/v1/superAdmin/signin', auth.signin);
        app.get('/api/v1/superAdmin/getProfile', authJwt.verifyToken, auth.getProfile);
        app.post('/api/v1/superAdmin/createAdmin', authJwt.verifyToken, auth.createAdmin);
        app.get('/api/v1/superAdmin/getAdmin', authJwt.verifyToken, auth.getAdmin);
        app.get('/api/v1/superAdmin/getAdminById/:id', authJwt.verifyToken, auth.getAdminById);
        app.delete('/api/v1/superAdmin/deleteAdmin/:id', authJwt.verifyToken, auth.deleteAdmin);
        app.get('/api/v1/superAdmin/getAdminTracking', authJwt.verifyToken, auth.getAdminTracking);
        app.get('/api/v1/superAdmin/getAdmitDetails', authJwt.verifyToken, auth.getAdmitDetails);
        app.get('/api/v1/superAdmin/getAllNotes', authJwt.verifyToken, auth.getAllNotes);
        app.get('/api/v1/superAdmin/getAllReceipt', authJwt.verifyToken, auth.getAllReceipt);
        app.post('/api/v1/superAdmin/addPackage', authJwt.verifyToken, upload.single('image'), auth.addPackage);
        app.get('/api/v1/superAdmin/getPackageById/:id', auth.getPackageById);
        app.get('/api/v1/superAdmin/getAllPackage', auth.getAllPackage);
        app.delete('/api/v1/superAdmin/deletePackage/:id', authJwt.verifyToken, auth.deletePackage);
        app.post('/api/v1/superAdmin/addBhrfTherapy', authJwt.verifyToken, auth.addBhrfTherapy);
        app.get('/api/v1/superAdmin/getBhrfTherapyById/id', auth.getBhrfTherapyById)
        app.get('/api/v1/superAdmin/getAllBhrfTherapy', auth.getAllBhrfTherapy);
        app.delete('/api/v1/superAdmin/deleteBhrfTherapy/:id', authJwt.verifyToken, auth.deleteBhrfTherapy);
        app.post('/api/v1/superAdmin/addBhrfTherapyTopic', authJwt.verifyToken, auth.addBhrfTherapyTopic);
        app.get('/api/v1/superAdmin/getBhrfTherapyTopicById/id', auth.getBhrfTherapyTopicById)
        app.get('/api/v1/superAdmin/getAllBhrfTherapyTopic', auth.getAllBhrfTherapyTopic);
        app.delete('/api/v1/superAdmin/deleteBhrfTherapyTopic/:id', authJwt.verifyToken, auth.deleteBhrfTherapyTopic);
}