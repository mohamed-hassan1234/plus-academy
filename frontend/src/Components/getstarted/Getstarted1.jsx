import { useState, useEffect } from "react";
import { apiUrl } from "../../utils/api";
import MagneticButton from "../Immersive/MagneticButton";
import SectionHeader from "../Immersive/SectionHeader";

function Getstarted1() {
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
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await fetch(apiUrl("/api/classes"));
      const data = await response.json();

      if (data.success) {
        const activeClasses = data.data.filter(
          (cls) => cls.isActive !== false && cls.registrationOpen !== false
        );
        setClasses(activeClasses);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoadingClasses(false);
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
          text: "Registration successful! Welcome to our tech community.",
        });
        setFormData({
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
    <section className="immersive-section">
      <div className="immersive-container">
        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader align="left" eyebrow="Get Started" title="Join Our Tech Community">
              Start your journey to becoming a tech professional. Fill out the
              form below to begin your transformation.
            </SectionHeader>

            <div className="cinematic-panel p-6 text-sm leading-relaxed text-white/64" data-cinematic>
              <p>
                Select an active class, add your learning details, and submit
                your registration directly to the academy dashboard.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-[#4FFFEA]">Monthly Cohorts</p>
                  <p className="mt-1 text-white/62">Choose from currently open class sessions.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-[#4FFFEA]">Hands-On Learning</p>
                  <p className="mt-1 text-white/62">Build practical projects while learning modern tech.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cinematic-panel p-6 md:p-8" data-cinematic>
            {message.text && (
              <div
                className={`mb-6 rounded-lg border p-4 ${
                  message.type === "success"
                    ? "border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-300/35 bg-rose-400/10 text-rose-200"
                }`}
              >
                <p className="text-sm md:text-base">{message.text}</p>
              </div>
            )}

            {!loadingClasses && classes.length === 0 && (
              <div className="mb-6 rounded-lg border border-amber-300/35 bg-amber-400/10 p-6 text-center text-amber-200">
                <h3 className="mb-2 text-xl font-bold">No Classes Available</h3>
              </div>
            )}

            {!loadingClasses && classes.length > 0 && (
              <form onSubmit={handleSubmit} className="cinematic-form space-y-5 text-sm md:text-base">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="px-4 py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="px-4 py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="+25261xxxxxxx"
                      className="px-4 py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">Where do you live?</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter your city/location"
                      className="px-4 py-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">Level of Education</label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="px-4 py-3"
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                      <option value="Master's Degree">Master&apos;s Degree</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">University/School Name</label>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      placeholder="Enter your institution name"
                      className="px-4 py-3"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">Gender</label>
                    <div className="flex flex-wrap gap-4 text-white/74">
                      {["Male", "Female"].map((gender) => (
                        <label key={gender} className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleChange}
                            className="h-4 w-4 border-[#4FFFEA] text-[#00A99D] focus:ring-[#4FFFEA]"
                            required
                          />
                          <span>{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-white/72">Do you have a laptop?</label>
                    <div className="flex flex-wrap gap-4 text-white/74">
                      {["Yes", "No"].map((answer) => (
                        <label key={answer} className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="hasLaptop"
                            value={answer}
                            checked={formData.hasLaptop === answer}
                            onChange={handleChange}
                            className="h-4 w-4 border-[#4FFFEA] text-[#00A99D] focus:ring-[#4FFFEA]"
                            required
                          />
                          <span>{answer}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-white/72">Select Class/Session</label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="px-4 py-3"
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
                </div>

                <MagneticButton
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Registering..." : "Start Your Tech Journey"}
                </MagneticButton>
              </form>
            )}

            {loadingClasses && (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#4FFFEA]" />
                <p className="mt-4 text-white/56">Loading classes...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Getstarted1;
