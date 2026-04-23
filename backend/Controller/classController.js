const Class = require("../model/classModel");
const Student = require("../model/registerModel");

// POST - Create a new class
const createClass = async (req, res) => {
    try {
        const { className, description, startDate, endDate } = req.body;

        if (!className) {
            return res.status(400).json({
                success: false,
                message: "Class name is required"
            });
        }

        const newClass = new Class({
            className,
            description,
            startDate: startDate || new Date(),
            endDate
        });

        const savedClass = await newClass.save();

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: savedClass
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Class name already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error creating class",
            error: error.message
        });
    }
};

// GET - Get all classes
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().sort({ createdAt: -1 });

        // Get student count for each class
        const classesWithCounts = await Promise.all(
            classes.map(async (classItem) => {
                const studentCount = await Student.countDocuments({
                    className: classItem.className
                });
                return {
                    ...classItem.toObject(),
                    studentCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: classesWithCounts.length,
            data: classesWithCounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching classes",
            error: error.message
        });
    }
};

// GET - Get single class by ID
const getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        const classItem = await Class.findById(id);

        if (!classItem) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const studentCount = await Student.countDocuments({
            className: classItem.className
        });

        res.status(200).json({
            success: true,
            data: {
                ...classItem.toObject(),
                studentCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching class",
            error: error.message
        });
    }
};

// PUT - Update class by ID
const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Class updated successfully",
            data: updatedClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating class",
            error: error.message
        });
    }
};

// DELETE - Delete class by ID
const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Class deleted successfully",
            data: deletedClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting class",
            error: error.message
        });
    }
};

// PUT - Toggle registration status
const toggleRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        const classItem = await Class.findById(id);

        if (!classItem) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        classItem.registrationOpen = !classItem.registrationOpen;
        const updatedClass = await classItem.save();

        res.status(200).json({
            success: true,
            message: `Registration ${updatedClass.registrationOpen ? "opened" : "closed"} successfully`,
            data: updatedClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error toggling registration",
            error: error.message
        });
    }
};

// GET - Get students by class name
const getStudentsByClass = async (req, res) => {
    try {
        const { className } = req.params;

        const students = await Student.find({ className }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching students",
            error: error.message
        });
    }
};

module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    toggleRegistration,
    getStudentsByClass
};
