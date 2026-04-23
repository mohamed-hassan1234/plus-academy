import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

function ClassManagement() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl("/api/classes"));
      const data = await response.json();

      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.className) {
      setMessage({
        type: "error",
        text: "Class name is required",
      });
      return;
    }

    try {
      const url = editingClass
        ? apiUrl(`/api/classes/${editingClass._id}`)
        : apiUrl("/api/classes");
      const method = editingClass ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: editingClass
            ? "Class updated successfully!"
            : "Class created successfully!",
        });
        setShowCreateForm(false);
        setEditingClass(null);
        setFormData({
          className: "",
          description: "",
          startDate: "",
          endDate: "",
        });
        fetchClasses();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error saving class",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      className: classItem.className,
      description: classItem.description || "",
      startDate: classItem.startDate
        ? new Date(classItem.startDate).toISOString().split("T")[0]
        : "",
      endDate: classItem.endDate
        ? new Date(classItem.endDate).toISOString().split("T")[0]
        : "",
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/classes/${id}`), {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Class deleted successfully!");
        fetchClasses();
      } else {
        alert(data.message || "Error deleting class");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const handleViewStudents = (className) => {
    navigate(`/waji/classes/${encodeURIComponent(className)}/students`);
  };

  const handleToggleRegistration = async (id, currentStatus) => {
    try {
      const response = await fetch(
        apiUrl(`/api/classes/${id}/toggle-registration`),
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: data.message || `Registration ${currentStatus ? "closed" : "opened"} successfully!`,
        });
        fetchClasses();
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error toggling registration",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="dashboard-page">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Class Management
              </h1>
              <p className="text-gray-400">
                Create and manage classes/sessions
              </p>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingClass(null);
                setFormData({
                  className: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                });
              }}
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
              Create New Class
            </button>
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

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingClass ? "Edit Class" : "Create New Class"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Class Name *
                    </label>
                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      placeholder="e.g., Class 2026 "
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      disabled={!!editingClass}
                    />
                    {editingClass && (
                      <p className="text-xs text-gray-400 mt-1">
                        Class name cannot be changed
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Optional description"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                  >
                    {editingClass ? "Update Class" : "Create Class"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingClass(null);
                      setFormData({
                        className: "",
                        description: "",
                        startDate: "",
                        endDate: "",
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

          {/* Classes List */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : classes.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No classes found. Create your first class!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#020617]/50 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Class Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Class Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Registration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {classes.map((classItem) => (
                      <tr
                        key={classItem._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                          {classItem.className}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {classItem.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewStudents(classItem.className)}
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            {classItem.studentCount || 0} students
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {new Date(classItem.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              classItem.isActive !== false
                                ? "bg-green-500/20 text-green-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {classItem.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                classItem.registrationOpen !== false
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {classItem.registrationOpen !== false ? "Open" : "Closed"}
                            </span>
                            <button
                              onClick={() =>
                                handleToggleRegistration(
                                  classItem._id,
                                  classItem.registrationOpen !== false
                                )
                              }
                              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                classItem.registrationOpen !== false
                                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                  : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                              }`}
                              title={
                                classItem.registrationOpen !== false
                                  ? "Close Registration"
                                  : "Open Registration"
                              }
                            >
                              {classItem.registrationOpen !== false ? "Close" : "Open"}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(classItem)}
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleViewStudents(classItem.className)}
                              className="text-green-400 hover:text-green-300"
                            >
                              View Students ({classItem.studentCount || 0})
                            </button>
                            <button
                              onClick={() => handleDelete(classItem._id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
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

export default ClassManagement;
