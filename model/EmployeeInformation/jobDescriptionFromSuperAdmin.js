const mongoose = require('mongoose');
const bhtJobDescriptionSchema = new mongoose.Schema({
        jobDescription: {
                type: String,
        },
});
const BHTJobDescription = mongoose.model('jobDescriptionFromSuperAdmin', bhtJobDescriptionSchema);
module.exports = BHTJobDescription;
