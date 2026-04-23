import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "../utils/api";

function Attendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [viewMode, setViewMode] = useState("mark"); // "mark" or "view"

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch(apiUrl("/api/classes"));
      const data = await response.json();
      if (data.success) {
        setClasses(data.data.filter((cls) => cls.isActive !== false));
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        apiUrl(`/api/classes/${encodeURIComponent(selectedClass)}/students`)
      );
      const data = await response.json();
      if (data.success) {
        // Filter to show only Active students
        const activeStudents = data.data.filter(
          (student) => (student.status || "Active") === "Active"
        );
        setStudents(activeStudents);
        // Initialize attendance records
        const initialRecords = {};
        activeStudents.forEach((student) => {
          initialRecords[student._id] = "Present";
        });
        setAttendanceRecords(initialRecords);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({
        type: "error",
        text: "Error fetching students",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  const fetchAttendanceForDate = useCallback(async () => {
    if (!selectedClass || !attendanceDate) return;

    try {
      const response = await fetch(
        apiUrl(`/api/attendance/class/${encodeURIComponent(selectedClass)}?date=${attendanceDate}`)
      );
      const data = await response.json();
      if (data.success) {
        const records = {};
        data.data.forEach((record) => {
          const studentId = typeof record.studentId === 'object' && record.studentId?._id 
            ? record.studentId._id 
            : record.studentId;
          records[studentId] = record.status;
        });
        setAttendanceRecords(records);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }, [attendanceDate, selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchAttendanceForDate();
    }
  }, [selectedClass, attendanceDate, fetchStudents, fetchAttendanceForDate]);

  const fetchAttendanceSummary = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      // Calculate 4 months date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 4);

      const response = await fetch(
        apiUrl(`/api/attendance/class/${encodeURIComponent(
          selectedClass
        )}/summary?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`)
      );
      const data = await response.json();
      if (data.success) {
        setAttendanceSummary(data.data);
      }
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
      setMessage({
        type: "error",
        text: "Error fetching attendance summary",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedClass || !attendanceDate) {
      setMessage({
        type: "error",
        text: "Please select a class and date",
      });
      return;
    }

    try {
      setLoading(true);
      const records = Object.entries(attendanceRecords).map(
        ([studentId, status]) => ({
          studentId,
          status,
        })
      );

      const response = await fetch(
        apiUrl("/api/attendance/bulk"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            className: selectedClass,
            date: attendanceDate,
            attendanceRecords: records,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Attendance marked successfully for ${data.data.length} student(s)`,
        });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
        fetchAttendanceForDate();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error marking attendance",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  const isWeekday = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  };

  const handleExportToGoogleSheets = async () => {
    if (!selectedClass) {
      setMessage({
        type: "error",
        text: "Please select a class first",
      });
      return;
    }

    try {
      setLoading(true);
      // Calculate 4 months date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 4);

      const response = await fetch(
        apiUrl(`/api/attendance/class/${encodeURIComponent(
          selectedClass
        )}/export/google-sheets?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`)
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Attendance_${selectedClass}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({
        type: "success",
        text: "Attendance exported to Google Sheets format successfully!",
      });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Error exporting to Google Sheets. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Attendance Management
            </h1>
            <p className="text-gray-400">
              Mark and view student attendance by class
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500/50 text-green-300"
                  : "bg-red-500/20 border border-red-500/50 text-red-300"
              }`}
            >
              <p>{message.text}</p>
            </div>
          )}

          {/* Class Selection */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setAttendanceSummary([]);
                  }}
                  className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls.className}>
                      {cls.className}
                      {cls.description && ` - ${cls.description}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setViewMode("mark");
                    if (selectedClass) fetchAttendanceForDate();
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "mark"
                      ? "bg-indigo-500 text-white"
                      : "bg-[#020617]/70 text-gray-300 border border-white/10"
                  }`}
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => {
                    setViewMode("view");
                    fetchAttendanceSummary();
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "view"
                      ? "bg-indigo-500 text-white"
                      : "bg-[#020617]/70 text-gray-300 border border-white/10"
                  }`}
                >
                  View History
                </button>
                {selectedClass && (
                  <button
                    onClick={handleExportToGoogleSheets}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Export to Google Sheets
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedClass && (
            <>
              {viewMode === "mark" ? (
                <>
                  {/* Date Selection */}
                  <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-300 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {attendanceDate && (
                          <p className="text-sm text-gray-400 mt-1">
                            {getDayName(attendanceDate)}
                            {!isWeekday(attendanceDate) && (
                              <span className="text-yellow-400 ml-2">
                                (Weekend - Not a class day)
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Attendance Table */}
                  {loading ? (
                    <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                      Loading...
                    </div>
                  ) : students.length === 0 ? (
                    <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                      No students found in this class
                    </div>
                  ) : (
                    <div className="bg-[#070F24]/90 border border-white/10 rounded-xl overflow-hidden">
                      <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">
                          Mark Attendance - {attendanceDate}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                          {students.length} student(s) in {selectedClass}
                        </p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#020617]/50 border-b border-white/10">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Student Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {students.map((student, index) => (
                              <tr
                                key={student._id}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                  {student.fullName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                  {student.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={
                                      attendanceRecords[student._id] || "Present"
                                    }
                                    onChange={(e) =>
                                      handleAttendanceChange(
                                        student._id,
                                        e.target.value
                                      )
                                    }
                                    className="rounded-lg bg-[#020617]/70 border border-white/10 px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Late">Late</option>
                                    <option value="Excused">Excused</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-6 border-t border-white/10">
                        <button
                          onClick={handleSubmitAttendance}
                          disabled={loading}
                          className={`px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white rounded-lg font-semibold hover:brightness-110 transition-all ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Saving..." : "Save Attendance"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Attendance History */}
                  <div className="bg-[#070F24]/90 border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <h2 className="text-xl font-bold text-white">
                        Attendance History - {selectedClass}
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">
                        Last 4 months (5 days per week)
                      </p>
                    </div>
                    {loading ? (
                      <div className="p-8 text-center text-gray-400">
                        Loading...
                      </div>
                    ) : attendanceSummary.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        No attendance records found
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#020617]/50 border-b border-white/10">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Day
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Present
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Absent
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Late
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Excused
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {attendanceSummary.map((day, index) => (
                              <tr
                                key={index}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                  {new Date(day.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                  {getDayName(day.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-green-400">
                                  {day.present}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-red-400">
                                  {day.absent}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-yellow-400">
                                  {day.late}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-blue-400">
                                  {day.excused}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                  {day.total}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {!selectedClass && (
            <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-8 text-center text-gray-400">
              Please select a class to manage attendance
            </div>
          )}
        </div>
    </div>
  );
}

export default Attendance;
