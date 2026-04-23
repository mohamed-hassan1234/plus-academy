import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import BrandLogo from "../Components/BrandLogo";
import { getDashboardMeta } from "./dashboardNavigation.jsx";
import { useDashboardAuth } from "../context/DashboardAuthContext";

const DASHBOARD_SIDEBAR_KEY = "plusacademy_dashboard_sidebar_collapsed";
const LEGACY_DASHBOARD_SIDEBAR_KEY = "elivate_dashboard_sidebar_collapsed";

function readStoredSidebarState() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const storedValue =
      window.localStorage.getItem(DASHBOARD_SIDEBAR_KEY) ??
      window.localStorage.getItem(LEGACY_DASHBOARD_SIDEBAR_KEY);

    return storedValue === "true";
  } catch (error) {
    console.error("Error reading dashboard sidebar state:", error);
    return false;
  }
}

function DashboardShell() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readStoredSidebarState);
  const [toolbarSearch, setToolbarSearch] = useState("");
  const { currentUser, logout } = useDashboardAuth();

  const pageMeta = useMemo(
    () => getDashboardMeta(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DASHBOARD_SIDEBAR_KEY,
        sidebarCollapsed ? "true" : "false"
      );
      window.localStorage.removeItem(LEGACY_DASHBOARD_SIDEBAR_KEY);
    } catch (error) {
      console.error("Error saving dashboard sidebar state:", error);
    }
  }, [sidebarCollapsed]);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed((previous) => !previous);
      return;
    }

    setMobileSidebarOpen((previous) => !previous);
  };

  return (
    <div className="dashboard-shell dashboard-shell--zoom-half min-h-screen bg-white">
      <div className="dashboard-shell__orb dashboard-shell__orb--one" />
      <div className="dashboard-shell__orb dashboard-shell__orb--two" />

      <div
        className={`dashboard-shell__mobile-backdrop ${
          mobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside
        className={`dashboard-shell__sidebar ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"
        }`}
      >
        <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
      </aside>

      <div
        className={`dashboard-shell__main ${
          sidebarCollapsed ? "lg:pl-0" : "lg:pl-[18.5rem]"
        }`}
      >
        <div className="dashboard-shell__main-scale">
          <header className="dashboard-topbar">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSidebarToggle}
                className="dashboard-icon-button"
                aria-label={sidebarCollapsed ? "Show dashboard sidebar" : "Hide dashboard sidebar"}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {sidebarCollapsed ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4.5 12h15m-9-6 6 6-6 6"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>

              <div className="hidden lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4eaebe]">
                  PlusAcademy
                </p>
                <h1 className="text-2xl font-black text-[#144a58]">
                  {pageMeta.label}
                </h1>
              </div>
            </div>

            <div className="dashboard-topbar__search">
              <svg
                className="h-5 w-5 text-[#7aaab5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="m21 21-4.35-4.35m1.35-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                />
              </svg>
              <input
                type="text"
                value={toolbarSearch}
                onChange={(event) => setToolbarSearch(event.target.value)}
                aria-label="Search anything"
                placeholder={`Search inside ${pageMeta.label.toLowerCase()}...`}
                className="dashboard-topbar__search-input"
              />
            </div>

            <div className="dashboard-topbar__user">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4eaebe]">
                  Dashboard access
                </span>
                <span className="text-sm font-semibold text-[#144a58]">
                  {currentUser?.fullName || "Administrator"}
                </span>
              </div>

              <div className="dashboard-topbar__avatar">
                {(currentUser?.fullName || "A")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <button type="button" onClick={logout} className="dashboard-ghost-button">
                Logout
              </button>
            </div>
          </header>

          <div className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
            <div className="mb-6 overflow-hidden rounded-[1.75rem] border border-[#d4e7eb] bg-white shadow-[0_24px_80px_rgba(20,74,88,0.08)]">
              <div className="grid gap-5 px-5 py-5 md:grid-cols-[1.9fr_0.95fr] md:px-7">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#4eaebe]">
                    Admin Workspace
                  </p>
                  <h2 className="max-w-2xl text-xl font-black leading-tight text-[#144a58] md:text-[1.85rem]">
                    Manage students, classes, hackathons, alumni, and messages in
                    one responsive dashboard.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5f7d87]">
                    {pageMeta.description}
                  </p>
                </div>

                <div className="dashboard-shell__hero-card">
                  <BrandLogo className="max-w-[10rem]" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="dashboard-shell__metric">
                      <span className="dashboard-shell__metric-label">Mode</span>
                      <strong className="dashboard-shell__metric-value">Live</strong>
                    </div>
                    <div className="dashboard-shell__metric">
                      <span className="dashboard-shell__metric-label">Access</span>
                      <strong className="dashboard-shell__metric-value">Protected</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </div>

      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          className="dashboard-sidebar-reveal"
          aria-label="Show sidebar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M4.5 12h15m-9-6 6 6-6 6"
            />
          </svg>
          <span>Show sidebar</span>
        </button>
      )}
    </div>
  );
}

export default DashboardShell;
