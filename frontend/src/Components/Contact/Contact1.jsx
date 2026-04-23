import { useState } from "react";
import { apiUrl } from "../../utils/api";
import MagneticButton from "../Immersive/MagneticButton";
import SectionHeader from "../Immersive/SectionHeader";

function Contact1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Message sent successfully! We will get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to send message. Please try again.",
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
        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeader align="left" eyebrow="Contact Us" title="Have a question? Send us a message." />
            <div className="cinematic-panel p-6 text-sm leading-relaxed text-white/64" data-cinematic>
              <p>
                Reach the PlusAcademy team with questions about programs,
                admissions, partnerships, and upcoming learning opportunities.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-[#4FFFEA]">Programs</p>
                  <p className="mt-1 text-white/62">Full-Stack Development, Mobile App Development, IoT, and Basic Computer Skills.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-[#4FFFEA]">Response</p>
                  <p className="mt-1 text-white/62">We will get back to you soon.</p>
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
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="cinematic-form space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/72">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/72">
                  Email Address *
                </label>
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

              <div>
                <label className="mb-2 block text-sm text-white/72">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+25261xxxxxxx"
                  className="px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/72">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/72">Message *</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="resize-none px-4 py-3"
                  required
                />
              </div>

              <MagneticButton
                type="submit"
                disabled={loading}
                className="mt-2 w-full"
              >
                {loading ? "Sending..." : "Send Message"}
              </MagneticButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact1;
