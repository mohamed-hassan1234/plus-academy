import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

function StudentCreate() {
  const navigate = useNavigate();
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

  const [loading, setLoading] = useState(false);
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
        const activeClasses = data.data.filter((cls) => cls.isActive !== false);
        setClasses(activeClasses);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
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

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.whatsappNumber ||
      !formData.gender ||
      !formData.location ||
      !formData.educationLevel ||
      !formData.institutionName ||
      !formData.hasLaptop ||
      !formData.className
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all fields including class selection",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          whatsappNumber: formData.whatsappNumber,
          gender: formData.gender,
          location: formData.location,
          educationLevel: formData.educationLevel,
          institutionName: formData.institutionName,
          hasLaptop: formData.hasLaptop,
          className: formData.className,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Student registered successfully!",
        });
        setTimeout(() => {
          navigate("/waji/students");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Registration failed. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="max-w-4xl mx-auto">
          <div className="mb-8">
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
              Add New Student
            </h1>
          </div>

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

          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="+25261xxxxxxx"
                    className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <option value="">Select gender</option>
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
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select education level</option>
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
                    name="hasLaptop"
                    value={formData.hasLaptop}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Select Class/Session *
                  </label>
                  {classes.length === 0 ? (
                    <div className="text-yellow-400 text-sm">
                      No active classes available. Please create a class first.
                    </div>
                  ) : (
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select a class/session</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls.className}>
                          {cls.className}
                          {cls.description && ` - ${cls.description}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white rounded-lg font-semibold hover:brightness-110 transition-all ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Registering..." : "Register Student"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/waji/students")}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}

export default StudentCreate;
