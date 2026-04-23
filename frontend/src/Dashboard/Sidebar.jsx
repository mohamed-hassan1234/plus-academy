import { Link, NavLink, useLocation } from "react-router-dom";
import BrandLogo from "../Components/BrandLogo";
import { dashboardNavigation } from "./dashboardNavigation.jsx";
import { useDashboardAuth } from "../context/DashboardAuthContext";

function Sidebar({ onNavigate }) {
  const location = useLocation();
  const { currentUser } = useDashboardAuth();

  return (
    <aside className="dashboard-sidebar h-full">
      <div className="dashboard-sidebar__brand">
        <BrandLogo className="max-w-[9.5rem]" />
        <div className="dashboard-sidebar__user-card">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#4eaebe]">
            Signed in
          </p>
          <p className="mt-2 text-[0.95rem] font-semibold text-[#144a58]">
            {currentUser?.fullName || "Administrator"}
          </p>
          <p className="mt-1 break-all text-[0.78rem] text-[#6b8c96]">
            {currentUser?.email || ""}
          </p>
        </div>
      </div>

      <div className="dashboard-sidebar__scroll">
        <div className="mb-4">
          <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#83cdd8]">
            Workspace
          </p>
          <nav className="space-y-1.5">
            {dashboardNavigation.map((item) => {
              const exact =
                item.path === "/waji"
                  ? location.pathname === "/waji"
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={`dashboard-nav-link ${exact ? "dashboard-nav-link--active" : ""}`}
                >
                  <span className="dashboard-nav-link__icon">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {item.icon}
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[0.72rem] leading-5 text-[#9fdde5]">
                      {item.description}
                    </span>
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <nav className="dashboard-sidebar__footer space-y-1.5">
        <Link
          to="/"
          onClick={onNavigate}
          className="dashboard-nav-link"
        >
          <span className="dashboard-nav-link__icon">
            <svg
              className="h-5 w-5"
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
          </span>
          <span className="text-sm font-semibold">Back to Website</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
