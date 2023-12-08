const auth = require("../controller/employeeController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/employee/signin', auth.signin);
        app.get('/api/v1/employee/getProfile', authJwt.verifyToken, auth.getProfile);
        app.get('/api/v1/employee/getPatient', authJwt.verifyToken, auth.getPatient);
        app.put('/api/v1/employee/updateProfile', authJwt.verifyToken, upload.single('image'), auth.updateProfile);
}