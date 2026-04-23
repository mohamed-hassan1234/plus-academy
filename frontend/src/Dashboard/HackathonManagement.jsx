import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../utils/api";

function HackathonManagement() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    details: "",
    registrationOpen: true,
    image1: "",
    image2: "",
    image3: "",
  });

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl("/api/hackathons"));
      const data = await response.json();

      if (data.success) {
        setHackathons(data.data);
      }
    } catch (error) {
      console.error("Error fetching hackathons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingHackathon(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      details: "",
      registrationOpen: true,
      image1: "",
      image2: "",
      image3: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.location ||
      !formData.details
    ) {
      setMessage({
        type: "error",
        text: "Title, description, date, location and details are required",
      });
      return;
    }

    if (!formData.image1 || !formData.image2 || !formData.image3) {
      setMessage({
        type: "error",
        text: "Exactly 3 image URLs are required",
      });
      return;
    }

    try {
      const url = editingHackathon
        ? apiUrl(`/api/hackathons/${editingHackathon._id}`)
        : apiUrl("/api/hackathons");
      const method = editingHackathon ? "PUT" : "POST";

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        details: formData.details,
        registrationOpen: formData.registrationOpen,
        images: [formData.image1, formData.image2, formData.image3],
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: editingHackathon
            ? "Hackathon updated successfully!"
            : "Hackathon created successfully!",
        });
        setShowForm(false);
        resetForm();
        fetchHackathons();
        setTimeout(() => setMessage({ type: "", text: "" }), 2500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error saving hackathon",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const handleEdit = (hack) => {
    setEditingHackathon(hack);
    setFormData({
      title: hack.title || "",
      description: hack.description || "",
      date: hack.date
        ? new Date(hack.date).toISOString().split("T")[0]
        : "",
      location: hack.location || "",
      details: hack.details || "",
      registrationOpen: hack.registrationOpen !== false,
      image1: (hack.images && hack.images[0]) || "",
      image2: (hack.images && hack.images[1]) || "",
      image3: (hack.images && hack.images[2]) || "",
    });
    setShowForm(true);
  };

  const handleToggleRegistration = async (hack) => {
    try {
      const response = await fetch(apiUrl(`/api/hackathons/${hack._id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationOpen: hack.registrationOpen === false,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text:
            hack.registrationOpen === false
              ? "Registration reopened successfully!"
              : "Registration closed successfully!",
        });
        fetchHackathons();
        setTimeout(() => setMessage({ type: "", text: "" }), 2500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error updating registration status",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hackathon?")) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl(`/api/hackathons/${id}`),
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Hackathon deleted successfully!");
        fetchHackathons();
      } else {
        alert(data.message || "Error deleting hackathon");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Hackathon Management
              </h1>
              <p className="text-gray-400">
                Create, edit, and manage hackathons shown on the website
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                resetForm();
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
              Create Hackathon
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
          {showForm && (
            <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingHackathon ? "Edit Hackathon" : "Create New Hackathon"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Ado Madhasana Web Hackathon"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Date (event day) *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                      placeholder="e.g., Ado Madhasana Campus"
                    className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="1–2 lines summary for the card."
                    className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Full Details *
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Faahfaahin dheeraad ah oo ku saabsan hackathon‑ka (what happened, goals, etc.)"
                    className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>

                <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#020617]/50 px-4 py-3">
                  <input
                    type="checkbox"
                    name="registrationOpen"
                    checked={formData.registrationOpen}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/10 bg-[#020617] text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Registration is open
                    </p>
                    <p className="text-xs text-gray-400">
                      Turn this off to show users that registration has ended.
                    </p>
                  </div>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Image 1 URL *
                    </label>
                    <input
                      type="text"
                      name="image1"
                      value={formData.image1}
                      onChange={handleChange}
                      placeholder="/images/hackathons/web-1.jpg"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Image 2 URL *
                    </label>
                    <input
                      type="text"
                      name="image2"
                      value={formData.image2}
                      onChange={handleChange}
                      placeholder="/images/hackathons/web-2.jpg"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Image 3 URL *
                    </label>
                    <input
                      type="text"
                      name="image3"
                      value={formData.image3}
                      onChange={handleChange}
                      placeholder="/images/hackathons/web-3.jpg"
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                  >
                    {editingHackathon ? "Update Hackathon" : "Create Hackathon"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Hackathons List */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : hackathons.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No hackathons found. Create your first hackathon!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#020617]/50 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Location
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
                    {hackathons.map((hack) => (
                      <tr
                        key={hack._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                          {hack.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {hack.date
                            ? new Date(hack.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {hack.location || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              hack.registrationOpen === false
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {hack.registrationOpen === false ? "Closed" : "Open"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-3 items-center">
                            <button
                              onClick={() => handleEdit(hack)}
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(hack._id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleToggleRegistration(hack)}
                              className={
                                hack.registrationOpen === false
                                  ? "text-emerald-300 hover:text-emerald-200"
                                  : "text-amber-300 hover:text-amber-200"
                              }
                            >
                              {hack.registrationOpen === false
                                ? "Reopen registration"
                                : "Close registration"}
                            </button>
                            <Link
                              to={`/hackathons/${hack._id}`}
                              className="text-cyan-300 hover:text-cyan-200"
                              target="_blank"
                              rel="noreferrer"
                            >
                              View page
                            </Link>
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

export default HackathonManagement;

