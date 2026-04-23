import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import BrandLogo from "../Components/BrandLogo";
import { useDashboardAuth } from "../context/DashboardAuthContext";

function DashboardLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, hasRegisteredUsers } = useDashboardAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      await login(formData);
      const nextPath = location.state?.from?.pathname || "/waji";
      navigate(nextPath, { replace: true });
    } catch (error) {
      setMessage(error.message || "Could not sign in.");
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
            Admin access
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#144a58]">
            Login to your PlusAcademy dashboard.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#5f7d87]">
            Your dashboard is now protected. Only registered dashboard users can
            open student records, classes, hackathons, alumni, and contact data.
          </p>

          <div className="dashboard-auth__highlights">
            <div className="dashboard-auth__highlight">
              <strong>Responsive</strong>
              <span>Built to work cleanly across mobile, tablet, and desktop.</span>
            </div>
            <div className="dashboard-auth__highlight">
              <strong>Brand based</strong>
              <span>Styled from your logo colors with a clean white background.</span>
            </div>
            <div className="dashboard-auth__highlight">
              <strong>Protected</strong>
              <span>Unauthenticated visitors are redirected away from the dashboard.</span>
            </div>
          </div>
        </section>

        <section className="dashboard-auth__card">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#4eaebe]">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#144a58]">
              Dashboard login
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5f7d87]">
              Enter the dashboard account email and password you created.
            </p>
          </div>

          {message && (
            <div className="dashboard-alert dashboard-alert--error">{message}</div>
          )}

          {!hasRegisteredUsers && (
            <div className="dashboard-alert dashboard-alert--error">
              No dashboard account is signed up yet. Login stays protected, and you
              can create the first dashboard account below.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                className="dashboard-auth__input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="dashboard-primary-button w-full justify-center"
            >
              {loading ? "Signing in..." : "Login to dashboard"}
            </button>
          </form>

          {/* <p className="text-sm text-[#5f7d87]">
            Need a dashboard account?{" "}
            <Link
              to="/waji/register"
              className="font-semibold text-[#1d6273] transition hover:text-[#144a58]"
            >
              Register here
            </Link>
          </p> */}
        </section>
      </div>
    </div>
  );
}

export default DashboardLogin;
