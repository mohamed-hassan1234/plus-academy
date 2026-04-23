const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        trim: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Excused"],
        default: "Present"
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate attendance for same student on same date in same class
attendanceSchema.index({ className: 1, studentId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
