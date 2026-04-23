import { useEffect, useState } from "react";
import { apiUrl } from "../utils/api";
import {
  createAlumniEntry,
  deleteAlumniEntry,
  fetchAlumniCollection,
  updateAlumniEntry,
} from "../utils/alumniApi";

const initialFormData = {
  name: "",
  role: "",
  course: "",
};

function AlumniManagement() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const result = await fetchAlumniCollection();
      setAlumni(result.data || []);
      setUsingFallback(result.source === "local");
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setMessage({
        type: "error",
        text: error.message || "Could not load alumni.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveImageSrc = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (/^(https?:\/\/|data:|blob:)/i.test(imagePath)) {
      return imagePath;
    }

    const normalizedPath = String(imagePath).replace(/\\/g, "/").trim();

    if (normalizedPath.startsWith("/uploads/")) {
      return apiUrl(normalizedPath);
    }

    if (normalizedPath.startsWith("uploads/")) {
      return apiUrl(`/${normalizedPath}`);
    }

    return apiUrl(`/uploads/alumni/${normalizedPath.split("/").pop()}`);
  };

  const resetForm = () => {
    setEditingAlumni(null);
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(editingAlumni?.image ? resolveImageSrc(editingAlumni.image) : "");
    }
  };

  const handleEdit = (person) => {
    setEditingAlumni(person);
    setFormData({
      name: person.name || "",
      role: person.role || "",
      course: person.course || "",
    });
    setImageFile(null);
    setImagePreview(person.image ? resolveImageSrc(person.image) : "");
    setMessage({ type: "", text: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.name || !formData.role || !formData.course) {
      setMessage({
        type: "error",
        text: "Name, role, and course are required.",
      });
      return;
    }

    if (!editingAlumni && !imageFile) {
      setMessage({
        type: "error",
        text: "Please upload an image file.",
      });
      return;
    }

    try {
      setSaving(true);
      const result = editingAlumni
        ? await updateAlumniEntry(
            editingAlumni._id,
            formData,
            imageFile,
            editingAlumni.image
          )
        : await createAlumniEntry(formData, imageFile);

      setMessage({
        type: "success",
        text:
          result.source === "local"
            ? editingAlumni
              ? "Alumni updated in this browser on https://plusacademyhub.com."
              : "Alumni created in this browser on https://plusacademyhub.com."
            : editingAlumni
            ? "Alumni updated successfully."
            : "Alumni created successfully.",
      });
      resetForm();
      fetchAlumni();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Network error. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alumni profile?")) {
      return;
    }

    try {
      const result = await deleteAlumniEntry(id);
      setMessage({
        type: "success",
        text:
          result.source === "local"
            ? "Alumni deleted from this browser on https://plusacademyhub.com."
            : "Alumni deleted successfully.",
      });
      if (editingAlumni?._id === id) {
        resetForm();
      }
      fetchAlumni();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="dashboard-page">
      <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-white">Alumni Management</h1>
            <p className="text-gray-400">
              Add, update, and manage alumni profiles shown on the public alumni page.
            </p>
          </div>

          {usingFallback && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-300">
              <p>
                Live alumni API is not deployed yet on https://plusacademyhub.com. Alumni you add here will be saved in this browser until the backend route is deployed.
              </p>
            </div>
          )}

          {message.text && (
            <div
              className={`mb-6 rounded-xl border p-4 ${
                message.type === "success"
                  ? "border-green-500/50 bg-green-500/20 text-green-300"
                  : "border-red-500/50 bg-red-500/20 text-red-300"
              }`}
            >
              <p>{message.text}</p>
            </div>
          )}

          <div className="mb-6 rounded-xl border border-white/10 bg-[#070F24]/90 p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingAlumni ? "Edit Alumni" : "Create Alumni"}
              </h2>
              {editingAlumni && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter alumni name"
                    className="w-full rounded-lg border border-white/10 bg-[#020617]/70 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-gray-300">Role / Job Title</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    className="w-full rounded-lg border border-white/10 bg-[#020617]/70 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-gray-300">Course</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="Full Stack Development"
                    className="w-full rounded-lg border border-white/10 bg-[#020617]/70 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-gray-300">
                    Image File {editingAlumni ? "(optional for update)" : "*"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-lg border border-white/10 bg-[#020617]/70 px-4 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="w-fit rounded-2xl border border-white/10 bg-[#020617]/70 p-3">
                  <p className="mb-3 text-sm text-gray-300">Image preview</p>
                  <img
                    src={imagePreview}
                    alt="Alumni preview"
                    className="h-32 w-32 rounded-2xl object-cover"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={`rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-6 py-2 font-semibold text-white transition-all hover:brightness-110 ${
                    saving ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {saving
                    ? editingAlumni
                      ? "Updating..."
                      : "Creating..."
                    : editingAlumni
                    ? "Update Alumni"
                    : "Create Alumni"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#070F24]/90">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading alumni...</div>
            ) : alumni.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No alumni found. Add your first alumni profile.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-[#020617]/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {alumni.map((person) => (
                      <tr key={person._id} className="transition-colors hover:bg-white/5">
                        <td className="px-6 py-4">
                          <img
                            src={resolveImageSrc(person.image)}
                            alt={person.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                          {person.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {person.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {person.course}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(person)}
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(person._id)}
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

export default AlumniManagement;
