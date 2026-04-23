const Attendance = require("../model/attendanceModel");
const Student = require("../model/registerModel");
const Class = require("../model/classModel");
const ExcelJS = require("exceljs");

// POST - Mark attendance for a student
const markAttendance = async (req, res) => {
    try {
        const { className, studentId, date, status, notes } = req.body;

        if (!className || !studentId || !date) {
            return res.status(400).json({
                success: false,
                message: "Class name, student ID, and date are required"
            });
        }

        // Verify student exists and belongs to the class
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (student.className !== className) {
            return res.status(400).json({
                success: false,
                message: "Student does not belong to this class"
            });
        }

        // Check if attendance already exists for this date
        const existingAttendance = await Attendance.findOne({
            className,
            studentId,
            date: new Date(date)
        });

        if (existingAttendance) {
            // Update existing attendance
            existingAttendance.status = status || existingAttendance.status;
            existingAttendance.notes = notes || existingAttendance.notes;
            const updated = await existingAttendance.save();

            return res.status(200).json({
                success: true,
                message: "Attendance updated successfully",
                data: updated
            });
        }

        // Create new attendance record
        const attendance = new Attendance({
            className,
            studentId,
            studentName: student.fullName,
            date: new Date(date),
            status: status || "Present",
            notes
        });

        const savedAttendance = await attendance.save();

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            data: savedAttendance
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Attendance already marked for this date"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error marking attendance",
            error: error.message
        });
    }
};

// POST - Mark attendance for multiple students (bulk)
const markBulkAttendance = async (req, res) => {
    try {
        const { className, date, attendanceRecords } = req.body;

        if (!className || !date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
            return res.status(400).json({
                success: false,
                message: "Class name, date, and attendance records array are required"
            });
        }

        const results = [];
        const errors = [];

        for (const record of attendanceRecords) {
            try {
                const { studentId, status, notes } = record;

                if (!studentId) {
                    errors.push({ studentId, error: "Student ID is required" });
                    continue;
                }

                // Verify student exists and belongs to the class
                const student = await Student.findById(studentId);
                if (!student) {
                    errors.push({ studentId, error: "Student not found" });
                    continue;
                }

                if (student.className !== className) {
                    errors.push({ studentId, error: "Student does not belong to this class" });
                    continue;
                }

                // Check if attendance already exists
                const existingAttendance = await Attendance.findOne({
                    className,
                    studentId,
                    date: new Date(date)
                });

                if (existingAttendance) {
                    existingAttendance.status = status || existingAttendance.status;
                    existingAttendance.notes = notes || existingAttendance.notes;
                    const updated = await existingAttendance.save();
                    results.push(updated);
                } else {
                    const attendance = new Attendance({
                        className,
                        studentId,
                        studentName: student.fullName,
                        date: new Date(date),
                        status: status || "Present",
                        notes
                    });
                    const saved = await attendance.save();
                    results.push(saved);
                }
            } catch (error) {
                errors.push({ studentId: record.studentId, error: error.message });
            }
        }

        res.status(200).json({
            success: true,
            message: `Attendance marked for ${results.length} student(s)`,
            data: results,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error marking bulk attendance",
            error: error.message
        });
    }
};

// GET - Get attendance for a specific class
const getAttendanceByClass = async (req, res) => {
    try {
        const { className } = req.params;
        const { date, startDate, endDate } = req.query;

        let query = { className };

        if (date) {
            // Get attendance for a specific date
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query.date = { $gte: targetDate, $lt: nextDay };
        } else if (startDate && endDate) {
            // Get attendance for a date range
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const attendance = await Attendance.find(query)
            .populate("studentId", "fullName email whatsappNumber")
            .sort({ date: -1, studentName: 1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching attendance",
            error: error.message
        });
    }
};

// GET - Get attendance for a specific student
const getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { className, startDate, endDate } = req.query;

        let query = { studentId };

        if (className) {
            query.className = className;
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const attendance = await Attendance.find(query)
            .sort({ date: -1 });

        // Calculate statistics
        const total = attendance.length;
        const present = attendance.filter(a => a.status === "Present").length;
        const absent = attendance.filter(a => a.status === "Absent").length;
        const late = attendance.filter(a => a.status === "Late").length;
        const excused = attendance.filter(a => a.status === "Excused").length;

        res.status(200).json({
            success: true,
            count: total,
            statistics: {
                total,
                present,
                absent,
                late,
                excused,
                attendanceRate: total > 0 ? ((present + excused) / total * 100).toFixed(2) : 0
            },
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching student attendance",
            error: error.message
        });
    }
};

// GET - Get attendance summary for a class (by date)
const getAttendanceSummary = async (req, res) => {
    try {
        const { className } = req.params;
        const { startDate, endDate } = req.query;

        let dateQuery = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateQuery = { $gte: start, $lte: end };
        }

        const attendance = await Attendance.find({
            className,
            ...(Object.keys(dateQuery).length > 0 && { date: dateQuery })
        }).sort({ date: -1 });

        // Group by date
        const groupedByDate = {};
        attendance.forEach(record => {
            const dateKey = new Date(record.date).toISOString().split("T")[0];
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = {
                    date: dateKey,
                    total: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                    records: []
                };
            }
            groupedByDate[dateKey].total++;
            groupedByDate[dateKey][record.status.toLowerCase()]++;
            groupedByDate[dateKey].records.push(record);
        });

        const summary = Object.values(groupedByDate).sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        res.status(200).json({
            success: true,
            count: summary.length,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching attendance summary",
            error: error.message
        });
    }
};

// PUT - Update attendance record
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const attendance = await Attendance.findByIdAndUpdate(
            id,
            { status, notes },
            { new: true, runValidators: true }
        );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating attendance",
            error: error.message
        });
    }
};

// DELETE - Delete attendance record
const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await Attendance.findByIdAndDelete(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Attendance record deleted successfully",
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting attendance",
            error: error.message
        });
    }
};

// GET - Export attendance to Google Sheets format (Excel)
const exportAttendanceToGoogleSheets = async (req, res) => {
    try {
        const { className } = req.params;
        const { startDate, endDate } = req.query;

        if (!className) {
            return res.status(400).json({
                success: false,
                message: "Class name is required"
            });
        }

        // Get all students for the class
        const students = await Student.find({ className }).sort({ fullName: 1 });
        
        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No students found for this class"
            });
        }

        // Calculate date range (4 months = 16 weeks = 80 days, 5 days per week)
        let dateRange = { start: null, end: null };
        
        if (startDate && endDate) {
            dateRange.start = new Date(startDate);
            dateRange.end = new Date(endDate);
        } else {
            // Default to last 4 months
            dateRange.end = new Date();
            dateRange.start = new Date();
            dateRange.start.setMonth(dateRange.start.getMonth() - 4);
        }

        // Get all attendance records for the date range
        const attendanceRecords = await Attendance.find({
            className,
            date: {
                $gte: dateRange.start,
                $lte: dateRange.end
            }
        }).sort({ date: 1 });

        // Group attendance by date
        const attendanceByDate = {};
        attendanceRecords.forEach(record => {
            const dateKey = new Date(record.date).toISOString().split("T")[0];
            if (!attendanceByDate[dateKey]) {
                attendanceByDate[dateKey] = {};
            }
            const studentId = record.studentId.toString();
            attendanceByDate[dateKey][studentId] = record.status;
        });

        // Generate all dates (Monday to Friday only, for 16 weeks)
        const allDates = [];
        const currentDate = new Date(dateRange.start);
        let weekCount = 0;
        const maxWeeks = 16;

        while (currentDate <= dateRange.end && weekCount < maxWeeks) {
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
                allDates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
            
            // Count weeks (every 5 weekdays = 1 week)
            if (dayOfWeek === 5) { // Friday
                weekCount++;
            }
        }

        // Group dates by week
        const weeks = [];
        let currentWeek = [];
        let weekNumber = 1;

        allDates.forEach((date, index) => {
            if (currentWeek.length === 0 || currentWeek.length === 5) {
                if (currentWeek.length === 5) {
                    weeks.push({ weekNumber: weekNumber++, dates: [...currentWeek] });
                }
                currentWeek = [];
            }
            currentWeek.push(date);
        });
        if (currentWeek.length > 0) {
            weeks.push({ weekNumber: weekNumber++, dates: currentWeek });
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Attendance");

        // Set column widths
        worksheet.getColumn(1).width = 5; // n
        worksheet.getColumn(2).width = 25; // Name

        // Create first header row (with week headers)
        const firstHeaderRow = worksheet.addRow(["n", "Name"]);
        let currentCol = 3; // Start from column C (after n and Name)
        
        weeks.forEach(week => {
            const weekStartCol = currentCol;
            const numDays = week.dates.length;
            const weekEndCol = currentCol + numDays - 1;
            
            // Merge cells for week header
            if (numDays > 0) {
                worksheet.mergeCells(1, weekStartCol, 1, weekEndCol);
                const weekHeaderCell = worksheet.getCell(1, weekStartCol);
                const weekNames = ["one", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen"];
                weekHeaderCell.value = `Week ${weekNames[week.weekNumber - 1] || week.weekNumber}`;
                weekHeaderCell.font = { bold: true };
                weekHeaderCell.alignment = { horizontal: "center", vertical: "middle" };
                weekHeaderCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFE0E0E0" }
                };
            }
            
            currentCol += numDays;
        });

        // Create second header row (with day names)
        const secondHeaderRow = ["n", "Name"];
        weeks.forEach(week => {
            week.dates.forEach(date => {
                const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
                secondHeaderRow.push(dayName);
            });
        });
        worksheet.addRow(secondHeaderRow);

        // Style header rows
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).font = { bold: true };
        worksheet.getRow(2).height = 20;
        
        // Style first two columns in header
        worksheet.getCell(1, 1).font = { bold: true };
        worksheet.getCell(1, 2).font = { bold: true };
        worksheet.getCell(2, 1).font = { bold: true };
        worksheet.getCell(2, 2).font = { bold: true };

        // Add student rows
        students.forEach((student, index) => {
            const row = worksheet.addRow([
                index + 1,
                student.fullName
            ]);

            // Check if student is cancelled or inactive - color entire row red
            const isCancelledOrInactive = (student.status === "Cancelled" || student.status === "Inactive");
            
            if (isCancelledOrInactive) {
                // Color the entire row red
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFFF0000" } // Red
                    };
                    cell.font = { color: { argb: "FFFFFFFF" } }; // White text
                });
            }

            // Add attendance data for each week
            let dataCol = 3; // Start from column C (after n and Name)
            weeks.forEach(week => {
                week.dates.forEach(date => {
                    const dateKey = date.toISOString().split("T")[0];
                    const studentId = student._id.toString();
                    const attendanceStatus = attendanceByDate[dateKey]?.[studentId];

                    let cellValue = "";
                    if (attendanceStatus === "Present") {
                        cellValue = "1";
                    } else if (attendanceStatus === "Absent") {
                        cellValue = "0";
                    } else if (attendanceStatus === "Excused") {
                        cellValue = "E";
                    } else if (attendanceStatus === "Late") {
                        cellValue = "1"; // Late counts as present
                    }

                    const cell = row.getCell(dataCol);
                    cell.value = cellValue;
                    cell.alignment = { horizontal: "center", vertical: "middle" };

                    // Color absent cells red (if not already red from cancelled/inactive)
                    if (cellValue === "0" && !isCancelledOrInactive) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFFFCCCC" } // Light red
                        };
                    }
                    
                    dataCol++;
                });
            });
        });

        // Set response headers for Excel download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Attendance_${className}_${new Date().toISOString().split("T")[0]}.xlsx`
        );

        // Write Excel file to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error exporting attendance to Google Sheets",
            error: error.message
        });
    }
};

module.exports = {
    markAttendance,
    markBulkAttendance,
    getAttendanceByClass,
    getAttendanceByStudent,
    getAttendanceSummary,
    updateAttendance,
    deleteAttendance,
    exportAttendanceToGoogleSheets
};
