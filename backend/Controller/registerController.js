const Student = require("../model/registerModel");
const Class = require("../model/classModel");
const ExcelJS = require("exceljs");

// POST - Register a new student
const registerStudent = async (req, res) => {
    try {
        const {
            fullName,
            email,
            whatsappNumber,
            gender,
            location,
            educationLevel,
            institutionName,
            hasLaptop,
            className
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !whatsappNumber || !gender || !location || !educationLevel || !institutionName || !hasLaptop || !className) {
            return res.status(400).json({
                success: false,
                message: "All fields are required including class name"
            });
        }

        // Check if class exists and registration is open
        const classItem = await Class.findOne({ className });
        if (!classItem) {
            return res.status(400).json({
                success: false,
                message: "Class not found"
            });
        }

        if (classItem.registrationOpen === false) {
            return res.status(400).json({
                success: false,
                message: "Registration for this class is currently closed"
            });
        }

        // Prevent duplicate registration for same email + class
        const existing = await Student.findOne({ email: email.toLowerCase(), className });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You have already registered for this class"
            });
        }

        // Assign a registration number per class (simple sequential based on current count)
        const currentCount = await Student.countDocuments({ className });
        const registrationNumber = currentCount + 1;

        const newStudent = new Student({
            fullName,
            email: email.toLowerCase(),
            whatsappNumber,
            gender,
            location,
            educationLevel,
            institutionName,
            hasLaptop,
            className,
            registrationNumber
        });

        const savedStudent = await newStudent.save();

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: savedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering student",
            error: error.message
        });
    }
};

// GET - Get all students with search and filter
const getAllStudents = async (req, res) => {
    try {
        const { search, gender, educationLevel, hasLaptop, location, className, status } = req.query;
        
        // Build query object
        let query = {};

        // Search filter (searches in name, email, whatsapp, location, institution)
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { whatsappNumber: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { institutionName: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by gender
        if (gender) {
            query.gender = gender;
        }

        // Filter by education level
        if (educationLevel) {
            query.educationLevel = educationLevel;
        }

        // Filter by laptop status
        if (hasLaptop) {
            query.hasLaptop = hasLaptop;
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Filter by class name
        if (className) {
            query.className = className;
        }

        // Filter by status
        if (status) {
            query.status = status;
        } else {
            // Default to showing all statuses, but you can change this to only show Active
            // query.status = "Active";
        }

        const students = await Student.find(query).sort({ createdAt: -1 });

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

// GET - Get single student by ID
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching student",
            error: error.message
        });
    }
};

// PUT - Update student by ID
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating student",
            error: error.message
        });
    }
};

// DELETE - Delete student by ID
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
            data: deletedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting student",
            error: error.message
        });
    }
};

// PUT - Update student status
const updateStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !["Active", "Inactive", "Cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required (Active, Inactive, or Cancelled)"
            });
        }

        const student = await Student.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Student status updated to ${status}`,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating student status",
            error: error.message
        });
    }
};

// PUT - Bulk update student statuses for a class
const bulkUpdateStudentStatus = async (req, res) => {
    try {
        const { className } = req.params;
        const { status, studentIds } = req.body;

        if (!status || !["Active", "Inactive", "Cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required (Active, Inactive, or Cancelled)"
            });
        }

        let query = { className };
        if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
            query._id = { $in: studentIds };
        }

        const result = await Student.updateMany(query, { status });

        res.status(200).json({
            success: true,
            message: `Updated ${result.modifiedCount} student(s) status to ${status}`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error bulk updating student statuses",
            error: error.message
        });
    }
};

        // GET - Export all students to Excel
const exportToExcel = async (req, res) => {
    try {
        const { search, gender, educationLevel, hasLaptop, location, className, status } = req.query;
        
        // Build query object (same as getAllStudents)
        let query = {};

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { whatsappNumber: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { institutionName: { $regex: search, $options: "i" } }
            ];
        }

        if (gender) {
            query.gender = gender;
        }

        if (educationLevel) {
            query.educationLevel = educationLevel;
        }

        if (hasLaptop) {
            query.hasLaptop = hasLaptop;
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (className) {
            query.className = className;
        }

        if (status) {
            query.status = status;
        }

        const students = await Student.find(query).sort({ createdAt: -1 });

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Students");

        // Define columns
        worksheet.columns = [
            { header: "Full Name", key: "fullName", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "WhatsApp Number", key: "whatsappNumber", width: 20 },
            { header: "Gender", key: "gender", width: 10 },
            { header: "Location", key: "location", width: 20 },
            { header: "Education Level", key: "educationLevel", width: 20 },
            { header: "Institution Name", key: "institutionName", width: 30 },
            { header: "Has Laptop", key: "hasLaptop", width: 15 },
            { header: "Class Name", key: "className", width: 20 },
            { header: "Status", key: "status", width: 15 },
            { header: "Registration Date", key: "registrationDate", width: 25 }
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4472C4" }
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

        // Add student data
        students.forEach((student) => {
            worksheet.addRow({
                fullName: student.fullName,
                email: student.email,
                whatsappNumber: student.whatsappNumber,
                gender: student.gender,
                location: student.location,
                educationLevel: student.educationLevel,
                institutionName: student.institutionName,
                hasLaptop: student.hasLaptop,
                className: student.className,
                status: student.status || "Active",
                registrationDate: student.registrationDate.toLocaleString()
            });
        });

        // Set response headers for Excel download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=students_${new Date().toISOString().split("T")[0]}.xlsx`
        );

        // Write Excel file to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error exporting to Excel",
            error: error.message
        });
    }
};

module.exports = {
    registerStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    updateStudentStatus,
    bulkUpdateStudentStatus,
    deleteStudent,
    exportToExcel
};
