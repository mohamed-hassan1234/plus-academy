const express = require("express");
const router = express.Router();
const {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    toggleRegistration,
    getStudentsByClass
} = require("../Controller/classController");

// POST - Create a new class
router.post("/classes", createClass);

// GET - Get all classes
router.get("/classes", getAllClasses);

// GET - Get single class by ID
router.get("/classes/:id", getClassById);

// PUT - Update class by ID
router.put("/classes/:id", updateClass);

// DELETE - Delete class by ID
router.delete("/classes/:id", deleteClass);

// PUT - Toggle registration status
router.put("/classes/:id/toggle-registration", toggleRegistration);

// GET - Get students by class name
router.get("/classes/:className/students", getStudentsByClass);

module.exports = router;
