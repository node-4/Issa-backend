const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
    adminId: {
        type: schema.Types.ObjectId,
        ref: "user"
    },
    userId: {
        type: schema.Types.ObjectId,
        ref: "user"
    },
    currentDate: {
        type: Number
    },
    month: {
        type: String
    },
    year: {
        type: String
    },
    date: {
        type: String
    },
    day: {
        type: String
    },
    totalTime: {
        type: String
    },
    workingTime: {
        type: String
    },
    overTime: {
        type: String
    },
    lunch: [{
        startBreak: {
            type: String
        },
        stopBreak: {
            type: String
        },
        timeTaken: {
            type: String
        },
        lunchType: {
            type: String,
        },
    }],
    totalLunchtime: {
        type: String
    },
    attendanceStatus: {
        type: String,
        enum: ["PRESENT", "ABSENT"],
    },
    dayStatus: {
        type: String,
        enum: ["FULLDAY", "HALFDAY", "OVERTIME", "PENDING", "WEEKLYOFF", "ABSENT", "LEAVE"],
        default: "PENDING"
    },
    inType: {
        type: String,
    },
    outType: {
        type: String,
    },
    requestStatus: {
        type: String,
        enum: ["APPROVED", "REJECT", "PENDING", " "],
        default: " "
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK"],
        default: 'ACTIVE'
    }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("attendance", DocumentSchema);
