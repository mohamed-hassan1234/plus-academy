import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

const EVENT_TYPE_LABELS = {
  event: "Event",
  workshop: "Workshop",
  hackathon: "Hackathon",
  graduation: "Graduation",
};

const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

function HackathonRegistrations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    hackathonId: "",
    eventType: "",
    gender: "",
    highestEducation: "",
    mernStackExperience: "",
    hasComputer: "",
    studyRiseAcademy: "",
  });

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch(apiUrl("/api/hackathons"));
        const data = await response.json();

        if (response.ok && data.success) {
          setHackathons(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching hackathons:", error);
      }
    };

    fetchHackathons();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      let url = apiUrl("/api/hackathon-registrations?");
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (filters.hackathonId) params.append("hackathonId", filters.hackathonId);
      if (filters.eventType) params.append("eventType", filters.eventType);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.highestEducation)
        params.append("highestEducation", filters.highestEducation);
      if (filters.mernStackExperience)
        params.append("mernStackExperience", filters.mernStackExperience);
      if (filters.hasComputer) params.append("hasComputer", filters.hasComputer);
      if (filters.studyRiseAcademy)
        params.append("studyRiseAcademy", filters.studyRiseAcademy);

      url += params.toString();

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setRegistrations(data.data);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    fetchRegistrations();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      const res = await fetch(
        apiUrl(`/api/hackathon-registrations/${id}`),
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        fetchRegistrations();
      } else {
        alert(data.message || "Error deleting registration");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const getHackathonName = (registration) => {
    if (registration?.hackathonTitle && registration.hackathonTitle !== "-") {
      return registration.hackathonTitle;
    }

    const registrationHackathonId =
      registration?.hackathonId?._id || registration?.hackathonId || "";

    if (registrationHackathonId) {
      const matchedHackathon = hackathons.find(
        (hackathon) => hackathon._id === registrationHackathonId
      );

      if (matchedHackathon?.title) {
        return matchedHackathon.title;
      }
    }

    if (filters.hackathonId) {
      const selectedHackathon = hackathons.find(
        (hackathon) => hackathon._id === filters.hackathonId
      );

      if (selectedHackathon?.title) {
        return selectedHackathon.title;
      }
    }

    if (hackathons.length === 1) {
      return hackathons[0].title;
    }

    return "-";
  };

  const getRegistrationEventType = (registration) => {
    if (registration?.eventType) {
      return registration.eventType;
    }

    const registrationHackathonId =
      registration?.hackathonId?._id || registration?.hackathonId || "";
    const matchedHackathon = hackathons.find(
      (hackathon) => hackathon._id === registrationHackathonId
    );

    return matchedHackathon?.eventType || "hackathon";
  };

  const getEventTypeLabel = (eventType) =>
    EVENT_TYPE_LABELS[eventType] || "Hackathon";

  return (
    <div className="dashboard-page">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Event Registrations
              </h1>
              <p className="text-gray-400">
                View all people who registered ({registrations.length})
              </p>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search by name, email, WhatsApp, or event..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                >
                  Search
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <select
                  value={filters.hackathonId}
                  onChange={(e) =>
                    handleFilterChange("hackathonId", e.target.value)
                  }
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All events</option>
                  {hackathons.map((hack) => (
                    <option key={hack._id} value={hack._id}>
                      {getEventTypeLabel(hack.eventType)} - {hack.title}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.eventType}
                  onChange={(e) =>
                    handleFilterChange("eventType", e.target.value)
                  }
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All types</option>
                  {EVENT_TYPE_OPTIONS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <select
                  value={filters.highestEducation}
                  onChange={(e) =>
                    handleFilterChange("highestEducation", e.target.value)
                  }
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Education</option>
                  <option value="Primary school">Primary school</option>
                  <option value="Secondary school">Secondary school</option>
                  <option value="Degree">Degree</option>
                  <option value="Master">Master</option>
                </select>

                <select
                  value={filters.mernStackExperience}
                  onChange={(e) =>
                    handleFilterChange("mernStackExperience", e.target.value)
                  }
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <select
                  value={filters.hasComputer}
                  onChange={(e) =>
                    handleFilterChange("hasComputer", e.target.value)
                  }
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Computer: All</option>
                  <option value="true">Has computer</option>
                  <option value="false">No computer</option>
                </select>

                <select
                  value={filters.studyRiseAcademy}
                  onChange={(e) =>
                    handleFilterChange("studyRiseAcademy", e.target.value)
                  }
                  className="rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">PlusAcademy Student? (All)</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No registrations found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#020617]/50 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
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
                        Education
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        MERN Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Computer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        PlusAcademy Student?
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {registrations.map((reg) => (
                      <tr
                        key={reg._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {getHackathonName(reg)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {getEventTypeLabel(getRegistrationEventType(reg))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                          {reg.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {reg.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {reg.whatsappNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reg.gender === "male"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-pink-500/20 text-pink-300"
                            }`}
                          >
                            {reg.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {reg.highestEducation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {reg.mernStackExperience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (reg.hasComputer ?? reg.hasLaptop)
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {(reg.hasComputer ?? reg.hasLaptop) ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reg.studyRiseAcademy
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {reg.studyRiseAcademy ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-xs">
                          {reg.createdAt
                            ? new Date(reg.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              navigate(
                                `/waji/hackathon-registrations/${reg._id}`
                              )
                            }
                            className="text-indigo-400 hover:text-indigo-300 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(reg._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
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

export default HackathonRegistrations;

