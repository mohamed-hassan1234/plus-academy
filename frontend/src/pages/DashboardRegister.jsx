import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import BrandLogo from "../Components/BrandLogo";
import { useDashboardAuth } from "../context/DashboardAuthContext";

function DashboardRegister() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useDashboardAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/waji" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password confirmation does not match.");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/waji", { replace: true });
    } catch (error) {
      setMessage(error.message || "Could not create the dashboard account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-auth min-h-screen">
      <div className="dashboard-auth__backdrop" />
      <div className="dashboard-auth__grid">
        <section className="dashboard-auth__intro">
          <BrandLogo className="max-w-[14rem]" />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.26em] text-[#4eaebe]">
            Secure admin area
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#144a58]">
            Create the dashboard access account.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#5f7d87]">
            After registration, the new user is signed in immediately and can
            open the protected PlusAcademy dashboard.
          </p>

          <div className="dashboard-auth__highlights">
            <div className="dashboard-auth__highlight">
              <strong>Quick start</strong>
              <span>Create the account once and continue directly into the dashboard.</span>
            </div>
            <div className="dashboard-auth__highlight">
              <strong>Brand-first UI</strong>
              <span>White surfaces, teal accents, and a layout matched to your logo.</span>
            </div>
            <div className="dashboard-auth__highlight">
              <strong>Protected routes</strong>
              <span>Dashboard pages now require a valid signed-in session.</span>
            </div>
          </div>
        </section>

        <section className="dashboard-auth__card">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#4eaebe]">
              First step
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#144a58]">
              Register dashboard user
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5f7d87]">
              Use the admin name and email you want for dashboard access.
            </p>
          </div>

          {message && (
            <div className="dashboard-alert dashboard-alert--error">{message}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="dashboard-auth__label">Full name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Dashboard administrator"
                className="dashboard-auth__input"
                required
              />
            </div>

            <div>
              <label className="dashboard-auth__label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@plusacademyhub.com"
                className="dashboard-auth__input"
                required
              />
            </div>

            <div>
              <label className="dashboard-auth__label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="dashboard-auth__input"
                required
              />
            </div>

            <div>
              <label className="dashboard-auth__label">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat the password"
                className="dashboard-auth__input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="dashboard-primary-button w-full justify-center"
            >
              {loading ? "Creating account..." : "Register and enter dashboard"}
            </button>
          </form>

          <p className="text-sm text-[#5f7d87]">
            Already created one?{" "}
            <Link
              to="/waji/login"
              className="font-semibold text-[#1d6273] transition hover:text-[#144a58]"
            >
              Go to login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default DashboardRegister;
