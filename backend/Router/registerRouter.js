const express = require("express");
const router = express.Router();
const {
    registerStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    updateStudentStatus,
    bulkUpdateStudentStatus,
    deleteStudent,
    exportToExcel
} = require("../Controller/registerController");

// POST - Register a new student
router.post("/register", registerStudent);

// GET - Get all students (with search and filter query parameters)
router.get("/students", getAllStudents);

// GET - Get single student by ID
router.get("/students/:id", getStudentById);

// PUT - Update student by ID
router.put("/students/:id", updateStudent);

// PUT - Update student status by ID
router.put("/students/:id/status", updateStudentStatus);

// PUT - Bulk update student statuses for a class
router.put("/students/class/:className/status", bulkUpdateStudentStatus);

// DELETE - Delete student by ID
router.delete("/students/:id", deleteStudent);

// GET - Export students to Excel
router.get("/students/export/excel", exportToExcel);

module.exports = router;
