const express = require("express");
const router = express.Router();
const {
    markAttendance,
    markBulkAttendance,
    getAttendanceByClass,
    getAttendanceByStudent,
    getAttendanceSummary,
    updateAttendance,
    deleteAttendance,
    exportAttendanceToGoogleSheets
} = require("../Controller/attendanceController");

// POST - Mark attendance for a student
router.post("/attendance", markAttendance);

// POST - Mark attendance for multiple students (bulk)
router.post("/attendance/bulk", markBulkAttendance);

// GET - Get attendance for a specific class
router.get("/attendance/class/:className", getAttendanceByClass);

// GET - Get attendance summary for a class
router.get("/attendance/class/:className/summary", getAttendanceSummary);

// GET - Get attendance for a specific student
router.get("/attendance/student/:studentId", getAttendanceByStudent);

// PUT - Update attendance record
router.put("/attendance/:id", updateAttendance);

// DELETE - Delete attendance record
router.delete("/attendance/:id", deleteAttendance);

// GET - Export attendance to Google Sheets format
router.get("/attendance/class/:className/export/google-sheets", exportAttendanceToGoogleSheets);

module.exports = router;
