import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../utils/api";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    students: [],
    classes: [],
    contacts: [],
    hackathons: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          fetch(apiUrl("/api/students")).then((response) => response.json()),
          fetch(apiUrl("/api/classes")).then((response) => response.json()),
          fetch(apiUrl("/api/contacts")).then((response) => response.json()),
          fetch(apiUrl("/api/hackathons")).then((response) => response.json()),
        ]);

        const [studentsResult, classesResult, contactsResult, hackathonsResult] =
          results;

        setDashboardData({
          students:
            studentsResult.status === "fulfilled" && studentsResult.value.success
              ? studentsResult.value.data || []
              : [],
          classes:
            classesResult.status === "fulfilled" && classesResult.value.success
              ? classesResult.value.data || []
              : [],
          contacts:
            contactsResult.status === "fulfilled" && contactsResult.value.success
              ? contactsResult.value.data || []
              : [],
          hackathons:
            hackathonsResult.status === "fulfilled" &&
            hackathonsResult.value.success
              ? hackathonsResult.value.data || []
              : [],
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const students = dashboardData.students || [];
    const classes = dashboardData.classes || [];
    const contacts = dashboardData.contacts || [];
    const hackathons = dashboardData.hackathons || [];

    return {
      totalStudents: students.length,
      activeClasses: classes.filter((item) => item.isActive !== false).length,
      openHackathons: hackathons.filter(
        (item) => item.registrationOpen !== false
      ).length,
      newMessages: contacts.filter((item) => item.status === "new").length,
      withLaptop: students.filter((item) => item.hasLaptop === "Yes").length,
      femaleStudents: students.filter((item) => item.gender === "Female").length,
    };
  }, [dashboardData]);

  const recentStudents = useMemo(() => {
    return [...dashboardData.students]
      .sort(
        (first, second) =>
          new Date(second.createdAt || 0) - new Date(first.createdAt || 0)
      )
      .slice(0, 4);
  }, [dashboardData.students]);

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      note: "All student registrations",
    },
    {
      label: "Active Classes",
      value: stats.activeClasses,
      note: "Current open class groups",
    },
    {
      label: "Open Hackathons",
      value: stats.openHackathons,
      note: "Hackathons accepting registration",
    },
    {
      label: "New Messages",
      value: stats.newMessages,
      note: "Unread contact requests",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      text: "Open dashboard accounts, suspend access, or delete a user.",
      path: "/waji/manage-users",
    },
    {
      title: "Add Student",
      text: "Create a new student record and assign the correct class.",
      path: "/waji/create",
    },
    {
      title: "Manage Classes",
      text: "Open or close registration and organize current sessions.",
      path: "/waji/classes",
    },
    {
      title: "Hackathons",
      text: "Create new hackathons and review registrations.",
      path: "/waji/hackathons",
    },
  ];

  return (
    <div className="dashboard-page mx-auto max-w-[1160px]">
      <div className="grid items-start gap-4 xl:grid-cols-[1.32fr_0.9fr]">
        <section className="dashboard-panel p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4eaebe]">
            Dashboard Overview
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black leading-tight text-[#144a58] md:text-[2rem]">
                Clean view of your academy data.
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5f7d87]">
                This dashboard uses your live students, classes, hackathons, and
                contact messages so you can manage everything from one place.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-[#d7e8ec] bg-[#f7fcfd] px-4 py-4 lg:min-w-[14rem] lg:max-w-[18rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#74a7b2]">
                Quick Signal
              </p>
              <strong className="mt-2 block text-2xl font-black text-[#144a58]">
                {stats.withLaptop}
              </strong>
              <p className="mt-2 text-sm leading-6 text-[#5f7d87]">
                student{stats.withLaptop === 1 ? "" : "s"} currently have laptops
                ready for class and hackathon work.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[1.2rem] border border-[#d7e8ec] bg-[#fbfeff] p-4 shadow-[0_12px_26px_rgba(20,74,88,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#74a7b2]">
                  {card.label}
                </p>
                <strong className="mt-2 block text-3xl font-black text-[#144a58]">
                  {loading ? "-" : card.value}
                </strong>
                <p className="mt-2 text-sm leading-6 text-[#5f7d87]">
                  {card.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4eaebe]">
                Fresh Activity
              </p>
              <h3 className="mt-2 text-xl font-black text-[#144a58]">
                Recent students
              </h3>
            </div>
            <Link to="/waji/students" className="dashboard-secondary-button">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-2.5">
            {loading ? (
              <div className="rounded-[1.2rem] border border-dashed border-[#d7e8ec] bg-[#f8fcfd] px-4 py-7 text-center text-[#6f8d96]">
                Loading students...
              </div>
            ) : recentStudents.length === 0 ? (
              <div className="rounded-[1.2rem] border border-dashed border-[#d7e8ec] bg-[#f8fcfd] px-4 py-7 text-center text-[#6f8d96]">
                No student data found yet.
              </div>
            ) : (
              recentStudents.map((student) => (
                <Link
                  key={student._id}
                  to={`/waji/students/${student._id}`}
                  className="block rounded-[1.15rem] border border-[#d7e8ec] bg-[#f8fcfd] px-4 py-3 transition hover:-translate-y-[1px] hover:shadow-[0_16px_30px_rgba(20,74,88,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-[0.96rem] font-bold text-[#144a58]">
                        {student.fullName}
                      </p>
                      <p className="mt-1 truncate text-[0.84rem] text-[#6b8c96]">
                        {student.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1d6273]">
                      {student.className || "No class"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-5 grid items-start gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="dashboard-panel p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4eaebe]">
                Student Snapshot
              </p>
              <h3 className="mt-2 text-xl font-black text-[#144a58]">
                Quick breakdown
              </h3>
            </div>
            <Link to="/waji/students" className="dashboard-secondary-button">
              Open list
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-[#d7e8ec] bg-[#f8fcfd] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#74a7b2]">
                With Laptop
              </p>
              <strong className="mt-2 block text-3xl font-black text-[#144a58]">
                {loading ? "-" : stats.withLaptop}
              </strong>
              <p className="mt-2 text-sm text-[#5f7d87]">
                Ready for practical learning.
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[#d7e8ec] bg-[#f8fcfd] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#74a7b2]">
                Female Students
              </p>
              <strong className="mt-2 block text-3xl font-black text-[#144a58]">
                {loading ? "-" : stats.femaleStudents}
              </strong>
              <p className="mt-2 text-sm text-[#5f7d87]">
                Current female student registrations.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-[#d7e8ec] bg-[linear-gradient(135deg,#144a58_0%,#1d6273_52%,#4eaebe_100%)] p-5 text-white shadow-[0_20px_40px_rgba(20,74,88,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8fbff]">
              Academy Status
            </p>
            <h4 className="mt-2 text-xl font-black leading-tight">
              {stats.activeClasses} active classes and {stats.openHackathons} open
              hackathons.
            </h4>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#e4fbff]">
              Your dashboard is reading the current data and summarizing the
              active learning and event flow from the same records used across the
              site.
            </p>
          </div>
        </section>

        <section className="dashboard-panel p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4eaebe]">
                Quick Actions
              </p>
              <h3 className="mt-2 text-xl font-black text-[#144a58]">
                Manage faster
              </h3>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="min-w-0 rounded-[1.15rem] border border-[#d7e8ec] bg-[#f8fcfd] p-4 transition hover:-translate-y-[1px] hover:shadow-[0_16px_30px_rgba(20,74,88,0.08)]"
              >
                <h4 className="text-base font-black text-[#144a58]">
                  {action.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#5f7d87] break-words">
                  {action.text}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 overflow-x-auto rounded-[1.2rem] border border-[#d7e8ec]">
            <table className="w-full">
              <thead className="border-b border-[#d7e8ec] bg-[#f4fbfd]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#7aaab5]">
                    Student
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#7aaab5]">
                    Class
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#7aaab5]">
                    Laptop
                  </th>
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : recentStudents.slice(0, 4)).map((student) => (
                  <tr key={student._id} className="border-b border-[#eef5f7] last:border-b-0">
                    <td className="px-5 py-4">
                      <Link
                        to={`/waji/students/${student._id}`}
                        className="block font-semibold text-[#144a58] transition hover:text-[#1d6273]"
                      >
                        {student.fullName}
                      </Link>
                      <span className="mt-1 block text-sm text-[#6b8c96]">
                        {student.email}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4e707a]">
                      {student.className || "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4e707a]">
                      {student.hasLaptop || "-"}
                    </td>
                  </tr>
                ))}
                {!loading && recentStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-5 py-10 text-center text-sm text-[#6f8d96]"
                    >
                      No recent student records available.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-5 py-10 text-center text-sm text-[#6f8d96]"
                    >
                      Loading table data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
