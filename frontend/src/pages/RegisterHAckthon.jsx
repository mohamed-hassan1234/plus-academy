import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../utils/api";
import PublicPage from "../Components/Immersive/PublicPage";
import MagneticButton from "../Components/Immersive/MagneticButton";

const initialFormData = {
  fullName: "",
  email: "",
  whatsappNumber: "",
  city: "",
  gender: "",
  highestEducation: "",
  mernStackExperience: "",
  hasComputer: "",
  studyRiseAcademy: "",
};

function RegisterHackthon() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await fetch(apiUrl(`/api/hackathons/${id}`));
        const data = await response.json();

        if (response.ok && data.success) {
          setHackathon(data.data);
        } else {
          setMessage({
            type: "error",
            text: data.message || "Hackathon not found.",
          });
        }
      } catch {
        setMessage({
          type: "error",
          text: "We could not load this hackathon right now.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(apiUrl("/api/hackathon-registrations"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hackathonId: id,
          hackathonTitle: hackathon.title,
          fullName: formData.fullName,
          email: formData.email,
          whatsappNumber: formData.whatsappNumber,
          city: formData.city,
          gender: formData.gender,
          highestEducation: formData.highestEducation,
          mernStackExperience: formData.mernStackExperience,
          hasComputer: formData.hasComputer === "true",
          hasLaptop: formData.hasComputer === "true",
          studyRiseAcademy: formData.studyRiseAcademy === "true",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormData(initialFormData);
        setMessage({
          type: "success",
          text: "Your hackathon registration was submitted successfully.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "We could not submit your registration.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicPage className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-white/60 md:text-base">
          Loading registration form...
        </p>
      </PublicPage>
    );
  }

  if (!hackathon) {
    return (
      <PublicPage className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-xl space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-white md:text-3xl">
            Hackathon not found
          </h1>
          <p className="text-sm text-white/64 md:text-base">
            We could not find the hackathon you are trying to register for.
          </p>
          <MagneticButton to="/hackathons">
            Back to hackathons
          </MagneticButton>
        </div>
      </PublicPage>
    );
  }

  const registrationOpen = hackathon.registrationOpen !== false;
  const formattedDate = hackathon.date
    ? new Date(hackathon.date).toLocaleDateString()
    : "";

  return (
    <PublicPage className="min-h-screen py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6 md:px-10 lg:px-0">
        <div className="mb-6 flex items-center gap-2 text-xs text-white/46 md:text-sm" data-cinematic>
          <Link to="/hackathons" className="transition-colors hover:text-[#4FFFEA]">
            Hackathons
          </Link>
          <span>/</span>
          <Link
            to={`/hackathons/${hackathon._id}`}
            className="transition-colors hover:text-[#4FFFEA]"
          >
            {hackathon.title}
          </Link>
          <span>/</span>
          <span className="text-white/66">Registration</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="cinematic-panel p-6 md:p-8" data-cinematic>
            <p className="text-xs uppercase text-[#4FFFEA]">
              Hackathon registration
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
              Join {hackathon.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/64 md:text-base">
              Fill in your real details so the team can review your application
              for this hackathon.
            </p>

            {message.text && (
              <div
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-300/35 bg-rose-400/10 text-rose-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {!registrationOpen ? (
              <div className="mt-8 rounded-lg border border-amber-300/35 bg-amber-400/10 p-6">
                <h2 className="text-lg font-semibold text-amber-200">
                  Registration has ended
                </h2>
                <p className="mt-2 text-sm text-amber-100/80">
                  The registration time for this hackathon is over. Please check
                  back for the next hackathon.
                </p>
                <MagneticButton to={`/hackathons/${hackathon._id}`} className="mt-4">
                  Back to hackathon page
                </MagneticButton>
              </div>
            ) : submitted ? (
              <div className="mt-8 rounded-lg border border-emerald-300/35 bg-emerald-400/10 p-6">
                <h2 className="text-lg font-semibold text-emerald-200">
                  Registration received
                </h2>
                <p className="mt-2 text-sm text-emerald-100/80">
                  Your details were saved successfully. The team can now review
                  your hackathon registration.
                </p>
                <MagneticButton to={`/hackathons/${hackathon._id}`} className="mt-4">
                  Return to hackathon page
                </MagneticButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="cinematic-form mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/72">
                    Selected hackathon
                  </label>
                  <input
                    type="text"
                    value={hackathon.title}
                    readOnly
                    className="px-4 py-3 text-sm font-medium"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      WhatsApp number
                    </label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      Where do you live?
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City / district"
                      required
                      className="px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      Highest education
                    </label>
                    <select
                      name="highestEducation"
                      value={formData.highestEducation}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 text-sm"
                    >
                      <option value="">Select education level</option>
                      <option value="Primary school">Primary school</option>
                      <option value="Secondary school">Secondary school</option>
                      <option value="Degree">Degree</option>
                      <option value="Master">Master</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      Computer experience
                    </label>
                    <select
                      name="mernStackExperience"
                      value={formData.mernStackExperience}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 text-sm"
                    >
                      <option value="">Select your level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/72">
                      Do you have a computer?
                    </label>
                    <select
                      name="hasComputer"
                      value={formData.hasComputer}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 text-sm"
                    >
                      <option value="">Choose an option</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/72">
                    Are you already studying at PlusAcademy?
                  </label>
                  <select
                    name="studyRiseAcademy"
                    value={formData.studyRiseAcademy}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 text-sm"
                  >
                    <option value="">Choose an option</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                  <MagneticButton
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 text-sm"
                  >
                    {submitting ? "Submitting..." : "Submit registration"}
                  </MagneticButton>
                  <Link
                    to={`/hackathons/${hackathon._id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-[#4FFFEA]/55 hover:text-[#4FFFEA]"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </section>

          <aside className="space-y-4">
            <div className="cinematic-panel p-6" data-cinematic>
              <p className="text-xs uppercase text-[#4FFFEA]">
                Event details
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">{hackathon.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/64">
                {hackathon.description}
              </p>

              <div className="mt-5 space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/50">Date</span>
                  <span className="font-medium text-white">
                    {formattedDate || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/50">Location</span>
                  <span className="font-medium text-white">
                    {hackathon.location || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/50">Registration</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      registrationOpen
                        ? "bg-emerald-400/10 text-emerald-200"
                        : "bg-amber-400/10 text-amber-200"
                    }`}
                  >
                    {registrationOpen ? "Open now" : "Closed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-[#4FFFEA]/22 bg-white/5 p-6 text-sm text-white/62" data-cinematic>
              <p className="font-semibold text-white">
                What we collect
              </p>
              <p className="mt-2 leading-relaxed">
                This form saves your name, email, WhatsApp number, where you
                live, education, computer availability, and other registration
                details for this specific hackathon.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </PublicPage>
  );
}

export default RegisterHackthon;
