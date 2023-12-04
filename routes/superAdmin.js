const auth = require("../controller/superAdminController");
const authJwt = require("../middleware/authJwt");
module.exports = (app) => {
        app.post('/api/v1/superAdmin/registration', auth.registration);
        app.post('/api/v1/superAdmin/signin', auth.signin);
        app.get('/api/v1/superAdmin/getProfile', authJwt.verifyToken, auth.getProfile);
        app.post('/api/v1/superAdmin/createAdmin', authJwt.verifyToken, auth.createAdmin);
        app.get('/api/v1/superAdmin/getAdmin', authJwt.verifyToken, auth.getAdmin);
        app.get('/api/v1/superAdmin/getAdminById/:id', authJwt.verifyToken, auth.getAdminById);
        app.delete('/api/v1/superAdmin/deleteAdmin/:id', authJwt.verifyToken, auth.deleteAdmin);
}