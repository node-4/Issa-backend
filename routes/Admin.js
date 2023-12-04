const auth = require("../controller/adminController");
const authJwt = require("../middleware/authJwt");
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
}