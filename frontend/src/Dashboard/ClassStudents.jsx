import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

function ClassStudents() {
  const { className } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
    gender: "",
    location: "",
    educationLevel: "",
    institutionName: "",
    hasLaptop: "",
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const decodedClassName = decodeURIComponent(className);
      const response = await fetch(
        apiUrl(`/api/classes/${encodeURIComponent(decodedClassName)}/students`)
      );
      const data = await response.json();

      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [className]);

  useEffect(() => {
    if (className) {
      fetchStudents();
    }
  }, [className, fetchStudents]);

  const handleExportExcel = async () => {
    try {
      const decodedClassName = decodeURIComponent(className);
      const response = await fetch(
        apiUrl(`/api/students/export/excel?className=${encodeURIComponent(decodedClassName)}`)
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${decodedClassName}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting to Excel");
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const response = await fetch(
        apiUrl(`/api/students/${studentId}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Student status updated to ${newStatus}`,
        });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
        fetchStudents();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error updating student status",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to set all students in this class to ${newStatus}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl(`/api/students/class/${encodeURIComponent(className)}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Updated ${data.modifiedCount} student(s) status to ${newStatus}`,
        });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
        fetchStudents();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error updating student statuses",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.whatsappNumber ||
      !formData.gender ||
      !formData.location ||
      !formData.educationLevel ||
      !formData.institutionName ||
      !formData.hasLaptop
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all fields",
      });
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          className: decodeURIComponent(className),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Student added successfully!",
        });
        setShowAddStudentForm(false);
        setFormData({
          fullName: "",
          email: "",
          whatsappNumber: "",
          gender: "",
          location: "",
          educationLevel: "",
          institutionName: "",
          hasLaptop: "",
        });
        fetchStudents();
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error adding student",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.whatsappNumber.includes(searchTerm) ||
      student.location.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-page">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/waji/classes")}
              className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Classes
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Students: {decodeURIComponent(className)}
                </h1>
                <p className="text-gray-400">
                  Total registered: {students.length} students | Active:{" "}
                  {students.filter((s) => s.status === "Active").length} |
                  Inactive:{" "}
                  {students.filter((s) => s.status === "Inactive").length} |
                  Cancelled:{" "}
                  {students.filter((s) => s.status === "Cancelled").length}
                </p>
              </div>
              <button
                onClick={() => setShowAddStudentForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white rounded-lg font-semibold hover:brightness-110 transition-all flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Student to Class
              </button>
            </div>
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

          {/* Add Student Form */}
          {showAddStudentForm && (
            <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Add Student to {decodeURIComponent(className)}
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Enter full name"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whatsappNumber: e.target.value,
                        })
                      }
                      placeholder="+25261xxxxxxx"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Enter city/location"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Education Level
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          educationLevel: e.target.value,
                        })
                      }
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">
                        Bachelor's Degree
                      </option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={formData.institutionName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          institutionName: e.target.value,
                        })
                      }
                      placeholder="Enter institution name"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Has Laptop?
                    </label>
                    <select
                      value={formData.hasLaptop}
                      onChange={(e) =>
                        setFormData({ ...formData, hasLaptop: e.target.value })
                      }
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                  >
                    Add Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddStudentForm(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        whatsappNumber: "",
                        gender: "",
                        location: "",
                        educationLevel: "",
                        institutionName: "",
                        hasLaptop: "",
                      });
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search, Filter and Export */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto flex gap-3">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkStatusChange("Inactive")}
                    className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-all text-sm"
                    title="Set all students to Inactive (class ended)"
                  >
                    Close All
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange("Active")}
                    className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm"
                    title="Restore all students to Active"
                  >
                    Restore All
                  </button>
                </div>
                <button
                  onClick={handleExportExcel}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:brightness-110 transition-all flex items-center gap-2"
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
                  Export to Excel
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                {students.length === 0
                  ? "No students registered for this class"
                  : "No students found matching your search"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#020617]/50 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        WhatsApp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Education
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Institution
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Laptop
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                          {student.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {student.whatsappNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.gender === "Male"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-pink-500/20 text-pink-300"
                            }`}
                          >
                            {student.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {student.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {student.educationLevel}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {student.institutionName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.hasLaptop === "Yes"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {student.hasLaptop}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={student.status || "Active"}
                            onChange={(e) =>
                              handleStatusChange(student._id, e.target.value)
                            }
                            className={`rounded-lg bg-[#020617]/70 border border-white/10 px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              student.status === "Active"
                                ? "text-green-400"
                                : student.status === "Inactive"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                navigate(`/waji/students/${student._id}`)
                              }
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default ClassStudents;
