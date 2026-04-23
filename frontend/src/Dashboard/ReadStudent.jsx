import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

function ReadStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
    gender: "",
    location: "",
    educationLevel: "",
    institutionName: "",
    hasLaptop: "",
    className: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch(apiUrl("/api/classes"));
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(`/api/students/${id}`));
      const data = await response.json();

      if (data.success) {
        setStudent(data.data);
        setFormData({
          fullName: data.data.fullName,
          email: data.data.email,
          whatsappNumber: data.data.whatsappNumber,
          gender: data.data.gender,
          location: data.data.location,
          educationLevel: data.data.educationLevel,
          institutionName: data.data.institutionName,
          hasLaptop: data.data.hasLaptop,
          className: data.data.className || "",
        });
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      setMessage({ type: "error", text: "Error loading student data" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id, fetchStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(apiUrl(`/api/students/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Student updated successfully!",
        });
        setEditing(false);
        fetchStudent();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error updating student",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/students/${id}`), {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Student deleted successfully!");
        navigate("/waji/students");
      } else {
        alert(data.message || "Error deleting student");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="dashboard-page">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-400">Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate("/waji/students")}
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
                Back to Students
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">
                {editing ? "Edit Student" : "Student Details"}
              </h1>
            </div>
            {!editing && (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            )}
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

          {/* Form/Details */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-8">
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Education Level
                    </label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
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
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Has Laptop?
                    </label>
                    <select
                      name="hasLaptop"
                      value={formData.hasLaptop}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Class/Session
                    </label>
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls.className}>
                          {cls.className}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      fetchStudent();
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Full Name</p>
                    <p className="text-white text-lg">{student.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white text-lg">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      WhatsApp Number
                    </p>
                    <p className="text-white text-lg">{student.whatsappNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Gender</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        student.gender === "Male"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-pink-500/20 text-pink-300"
                      }`}
                    >
                      {student.gender}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Location</p>
                    <p className="text-white text-lg">{student.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Education Level
                    </p>
                    <p className="text-white text-lg">{student.educationLevel}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Institution Name
                    </p>
                    <p className="text-white text-lg">{student.institutionName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Has Laptop?</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        student.hasLaptop === "Yes"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {student.hasLaptop}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Class/Session</p>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
                      {student.className || "Not assigned"}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-1">
                    Registration Date
                  </p>
                  <p className="text-white">
                    {new Date(student.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default ReadStudent;
