import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardAuth } from "../context/DashboardAuthContext";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function ManageUsers() {
  const navigate = useNavigate();
  const { currentUser, getUsers, setUserSuspended, removeUser } = useDashboardAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeAction, setActiveAction] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUsers();

        if (!ignore) {
          setUsers(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Could not load dashboard users.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [getUsers]);

  const stats = useMemo(() => {
    const activeUsers = users.filter((user) => !user.isSuspended).length;
    const suspendedUsers = users.filter((user) => user.isSuspended).length;

    return {
      total: users.length,
      active: activeUsers,
      suspended: suspendedUsers,
    };
  }, [users]);

  const handleToggleSuspension = async (user) => {
    const nextSuspendedState = !user.isSuspended;
    const actionKey = `suspend:${user.id}`;

    try {
      setActiveAction(actionKey);
      setError("");
      setMessage("");

      const updatedUser = await setUserSuspended(user.id, nextSuspendedState);

      setUsers((previous) =>
        previous.map((item) => (item.id === updatedUser.id ? updatedUser : item))
      );
      setMessage(
        nextSuspendedState
          ? `${user.fullName} has been suspended.`
          : `${user.fullName} has been activated.`
      );

      if (currentUser?.id === updatedUser.id && updatedUser.isSuspended) {
        navigate("/waji/login", { replace: true });
      }
    } catch (actionError) {
      setError(actionError.message || "Could not update this user.");
    } finally {
      setActiveAction("");
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.fullName} (${user.email}) from dashboard users?`
    );

    if (!confirmed) {
      return;
    }

    const actionKey = `delete:${user.id}`;

    try {
      setActiveAction(actionKey);
      setError("");
      setMessage("");

      const result = await removeUser(user.id);
      setUsers((previous) => previous.filter((item) => item.id !== user.id));
      setMessage(`${user.fullName} has been deleted.`);

      if (result.deletedCurrentUser) {
        navigate("/waji/login", { replace: true });
      }
    } catch (actionError) {
      setError(actionError.message || "Could not delete this user.");
    } finally {
      setActiveAction("");
    }
  };

  return (
    <div className="dashboard-page mx-auto max-w-[1160px]">
      <section className="dashboard-panel p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4eaebe]">
              Dashboard Users
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-[#144a58] md:text-[2rem]">
              Manage who can access the admin dashboard.
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#5f7d87]">
              These users come from your existing Mongo dashboard user data. You
              can review accounts, suspend access, activate access again, or delete
              a user.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[19rem]">
            <div className="rounded-[1.1rem] border border-[#d7e8ec] bg-[#f8fcfd] p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#74a7b2]">
                Total
              </p>
              <strong className="mt-2 block text-3xl font-black text-[#144a58]">
                {loading ? "-" : stats.total}
              </strong>
            </div>
            <div className="rounded-[1.1rem] border border-[#d7e8ec] bg-[#f8fcfd] p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#74a7b2]">
                Active
              </p>
              <strong className="mt-2 block text-3xl font-black text-[#144a58]">
                {loading ? "-" : stats.active}
              </strong>
            </div>
            <div className="rounded-[1.1rem] border border-[#d7e8ec] bg-[#f8fcfd] p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#74a7b2]">
                Suspended
              </p>
              <strong className="mt-2 block text-3xl font-black text-[#144a58]">
                {loading ? "-" : stats.suspended}
              </strong>
            </div>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`mt-5 rounded-[1.1rem] border px-4 py-3 text-sm ${
              error
                ? "border-[#f4c3c7] bg-[#fff5f6] text-[#9f2837]"
                : "border-[#cbe7d2] bg-[#f4fbf6] text-[#226342]"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="mt-5 overflow-x-auto rounded-[1.2rem] border border-[#d7e8ec]">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-[#d7e8ec] bg-[#f4fbfd]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#7aaab5]">
                  User
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#7aaab5]">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#7aaab5]">
                  Created
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#7aaab5]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-sm text-[#6f8d96]">
                    Loading dashboard users...
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-sm text-[#6f8d96]">
                    No dashboard users found yet.
                  </td>
                </tr>
              )}

              {!loading &&
                users.map((user) => {
                  const suspensionActionKey = `suspend:${user.id}`;
                  const deleteActionKey = `delete:${user.id}`;
                  const isUpdatingStatus = activeAction === suspensionActionKey;
                  const isDeleting = activeAction === deleteActionKey;

                  return (
                    <tr key={user.id} className="border-b border-[#eef5f7] last:border-b-0">
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[#144a58]">
                            {user.fullName}
                          </span>
                          {currentUser?.id === user.id && (
                            <span className="rounded-full bg-[#e5f7fa] px-2.5 py-1 text-[0.72rem] font-semibold text-[#1d6273]">
                              You
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-[#6b8c96]">{user.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isSuspended
                              ? "bg-[#fff1f2] text-[#b42339]"
                              : "bg-[#ecfdf3] text-[#027a48]"
                          }`}
                        >
                          {user.isSuspended ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4e707a]">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSuspension(user)}
                            disabled={Boolean(activeAction)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                              user.isSuspended
                                ? "bg-[#e5f7fa] text-[#1d6273] hover:bg-[#d7f0f4]"
                                : "bg-[#fff4e8] text-[#b54708] hover:bg-[#ffe6c7]"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            {isUpdatingStatus
                              ? "Saving..."
                              : user.isSuspended
                                ? "Activate"
                                : "Suspend"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={Boolean(activeAction)}
                            className="rounded-full bg-[#fff1f2] px-4 py-2 text-sm font-semibold text-[#b42339] transition hover:bg-[#ffe3e8] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ManageUsers;
