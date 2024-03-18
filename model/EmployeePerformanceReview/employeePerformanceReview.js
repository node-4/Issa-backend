const mongoose = require('mongoose');
const schema = mongoose.Schema;
const performanceReviewSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        name: {
                type: String
        },
        date: {
                type: Date
        },
        employeeJobTitle: {
                type: String
        },
        employeeManager: {
                type: String
        },
        typeOfReview: {
                type: String,
                enum: ['sixMonth', 'Annual', 'Other']
        },
        employeeHireDate: {
                type: Date
        },
        ratingsPerformanceAndQualityOfWork: {
                type: Number
        },
        ratingsCommunication: {
                type: Number
        },
        ratingsProfessionalism: {
                type: Number
        },
        ratingsAttendanceAndPunctuality: {
                type: Number
        },
        ratingsTimeManagement: {
                type: Number
        },
        ratingsReliabilityDependability: {
                type: Number
        },
        overallRating: {
                type: Number
        },
        evaluation: {
                type: String,
        },
        additionalComments: {
                type: String
        },
        employeeName: {
                type: String
        },
        employeeSignature: {
                type: String
        },
        employeeDate: {
                type: Date
        },
        employeeTime: {
                type: String
        },
        administratorName: {
                type: String
        },
        administratorSignature: {
                type: String
        },
        administratorDate: {
                type: Date
        },
        administratorTime: {
                type: String
        },
});
const PerformanceReview = mongoose.model('PerformanceReview', performanceReviewSchema);
module.exports = PerformanceReview;
