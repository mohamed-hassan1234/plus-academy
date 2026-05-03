import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../utils/api";

const EVENT_TYPE_LABELS = {
  event: "Event",
  workshop: "Workshop",
  hackathon: "Hackathon",
  graduation: "Graduation",
};

function ReadHackathonRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingHackathon, setSavingHackathon] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrationResponse, hackathonsResponse] = await Promise.all([
          fetch(apiUrl(`/api/hackathon-registrations/${id}`)),
          fetch(apiUrl("/api/hackathons")),
        ]);

        const registrationData = await registrationResponse.json();
        const hackathonsData = await hackathonsResponse.json();

        if (registrationResponse.ok && registrationData.success) {
          setRegistration(registrationData.data);
          setSelectedHackathonId(
            registrationData.data?.hackathonId?._id ||
              registrationData.data?.hackathonId ||
              ""
          );
        }

        if (hackathonsResponse.ok && hackathonsData.success) {
          setHackathons(hackathonsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching registration:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getHackathonName = () => {
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

    if (selectedHackathonId) {
      const selectedHackathon = hackathons.find(
        (hackathon) => hackathon._id === selectedHackathonId
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

  const getRegistrationEventType = () => {
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

  const handleHackathonUpdate = async () => {
    if (!selectedHackathonId) {
      setMessage({
        type: "error",
        text: "Please select an event first.",
      });
      return;
    }

    try {
      setSavingHackathon(true);
      setMessage({ type: "", text: "" });

      const response = await fetch(
        apiUrl(`/api/hackathon-registrations/${id}/hackathon`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hackathonId: selectedHackathonId }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setRegistration(data.data);
        setSelectedHackathonId(
          data.data?.hackathonId?._id || data.data?.hackathonId || ""
        );
        setMessage({
          type: "success",
          text: "Event linked to this registration successfully.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Could not update event.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setSavingHackathon(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
          Loading registration...
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="dashboard-page">
        <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
          Registration not found.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/waji/hackathon-registrations")}
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
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
            Back to registrations
          </button>

          <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white mb-4">
              Registration Details
            </h1>

            {message.text && (
              <div
                className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/40 bg-red-500/10 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="mb-6 rounded-xl border border-white/10 bg-[#020617]/50 p-4">
              <p className="mb-3 text-sm font-medium text-white">
                Fix event for this registration
              </p>
              <div className="flex flex-col gap-3 md:flex-row">
                <select
                  value={selectedHackathonId}
                  onChange={(event) => setSelectedHackathonId(event.target.value)}
                  className="flex-1 rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select event</option>
                  {hackathons.map((hackathon) => (
                    <option key={hackathon._id} value={hackathon._id}>
                      {getEventTypeLabel(hackathon.eventType)} - {hackathon.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleHackathonUpdate}
                  disabled={savingHackathon}
                  className="rounded-lg bg-indigo-500 px-5 py-2 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingHackathon ? "Saving..." : "Save event"}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Use this for older registrations that are missing the linked
                event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Event</p>
                <p className="text-white font-medium">
                  {getHackathonName()}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Type</p>
                <p className="text-white font-medium">
                  {getEventTypeLabel(getRegistrationEventType())}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Full Name</p>
                <p className="text-white font-medium">
                  {registration.fullName}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Email</p>
                <p className="text-white font-medium break-all">
                  {registration.email}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">WhatsApp</p>
                <p className="text-white font-medium">
                  {registration.whatsappNumber}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Gender</p>
                <p className="text-white font-medium">{registration.gender}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Highest Education</p>
                <p className="text-white font-medium">
                  {registration.highestEducation}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">MERN Experience</p>
                <p className="text-white font-medium">
                  {registration.mernStackExperience}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Has Computer</p>
                <p className="text-white font-medium">
                  {(registration.hasComputer ?? registration.hasLaptop)
                    ? "Yes"
                    : "No"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Studies at PlusAcademy</p>
                <p className="text-white font-medium">
                  {registration.studyRiseAcademy ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Created At</p>
                <p className="text-white font-medium">
                  {registration.createdAt
                    ? new Date(registration.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Updated At</p>
                <p className="text-white font-medium">
                  {registration.updatedAt
                    ? new Date(registration.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default ReadHackathonRegistration;

