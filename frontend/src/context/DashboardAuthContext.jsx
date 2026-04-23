import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { apiClient, getApiErrorMessage } from "../utils/api";

const DASHBOARD_SESSION_KEY = "plusacademy_dashboard_session";
const LEGACY_DASHBOARD_SESSION_KEY = "elivate_dashboard_session";

const DashboardAuthContext = createContext(null);

function readStoredSession() {
  try {
    const rawValue =
      window.localStorage.getItem(DASHBOARD_SESSION_KEY) ??
      window.localStorage.getItem(LEGACY_DASHBOARD_SESSION_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.error("Error reading stored dashboard session:", error);
    return null;
  }
}

async function fetchDashboardAuthStatus() {
  const { data } = await apiClient.get("/api/dashboard-auth/status");

  if (!data.success) {
    throw new Error(data.message || "Could not read dashboard auth status.");
  }

  return data;
}

async function registerDashboardUser(payload) {
  const { data } = await apiClient.post("/api/dashboard-auth/register", payload);

  if (!data.success) {
    throw new Error(data.message || "Could not create dashboard account.");
  }

  return data.data;
}

async function loginDashboardUser(payload) {
  const { data } = await apiClient.post("/api/dashboard-auth/login", payload);

  if (!data.success) {
    throw new Error(data.message || "Could not login to dashboard.");
  }

  return data.data;
}

async function fetchDashboardUsers() {
  const { data } = await apiClient.get("/api/dashboard-auth/users");

  if (!data.success) {
    throw new Error(data.message || "Could not load dashboard users.");
  }

  return data.data || [];
}

async function updateDashboardUserStatus(userId, isSuspended) {
  const { data } = await apiClient.patch(
    `/api/dashboard-auth/users/${userId}/status`,
    { isSuspended }
  );

  if (!data.success) {
    throw new Error(data.message || "Could not update dashboard user.");
  }

  return data.data;
}

async function deleteDashboardUser(userId) {
  const { data } = await apiClient.delete(`/api/dashboard-auth/users/${userId}`);

  if (!data.success) {
    throw new Error(data.message || "Could not delete dashboard user.");
  }

  return data;
}

export function DashboardAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasRegisteredUsers, setHasRegisteredUsers] = useState(false);

  const persistSession = useCallback((user) => {
    setCurrentUser(user);

    if (user) {
      window.localStorage.setItem(
        DASHBOARD_SESSION_KEY,
        JSON.stringify({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isSuspended: Boolean(user.isSuspended),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
      );
      window.localStorage.removeItem(LEGACY_DASHBOARD_SESSION_KEY);
    } else {
      window.localStorage.removeItem(DASHBOARD_SESSION_KEY);
      window.localStorage.removeItem(LEGACY_DASHBOARD_SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedSession = readStoredSession();

      if (storedSession?.email) {
        setCurrentUser(storedSession);
      }

      try {
        const status = await fetchDashboardAuthStatus();
        setHasRegisteredUsers(Boolean(status.hasUsers));

        if (storedSession?.id && status.hasUsers) {
          try {
            const users = await fetchDashboardUsers();
            const matchedUser = users.find((user) => user.id === storedSession.id);

            if (!matchedUser || matchedUser.isSuspended) {
              persistSession(null);
            } else {
              persistSession(matchedUser);
            }
          } catch (error) {
            console.error("Error validating stored dashboard session:", error);
          }
        }
      } catch (error) {
        console.error(
          "Error loading dashboard auth status:",
          getApiErrorMessage(error, "Could not load dashboard auth status.")
        );
        setHasRegisteredUsers(Boolean(storedSession?.email));
      } finally {
        setReady(true);
      }
    };

    bootstrapAuth();
  }, [persistSession]);

  const register = useCallback(async ({ fullName, email, password }) => {
    const user = await registerDashboardUser({
      fullName,
      email,
      password,
    });

    setHasRegisteredUsers(true);
    persistSession(user);

    return user;
  }, [persistSession]);

  const login = useCallback(async ({ email, password }) => {
    const user = await loginDashboardUser({
      email,
      password,
    });

    setHasRegisteredUsers(true);
    persistSession(user);

    return user;
  }, [persistSession]);

  const getUsers = useCallback(async () => fetchDashboardUsers(), []);

  const setUserSuspended = useCallback(async (userId, isSuspended) => {
    const user = await updateDashboardUserStatus(userId, isSuspended);

    if (currentUser?.id === user.id) {
      if (user.isSuspended) {
        persistSession(null);
      } else {
        persistSession(user);
      }
    }

    return user;
  }, [currentUser?.id, persistSession]);

  const removeUser = useCallback(async (userId) => {
    const isCurrentUser = currentUser?.id === userId;

    await deleteDashboardUser(userId);

    if (isCurrentUser) {
      persistSession(null);
    }

    try {
      const status = await fetchDashboardAuthStatus();
      setHasRegisteredUsers(Boolean(status.hasUsers));
    } catch (error) {
      console.error(
        "Error refreshing dashboard auth status:",
        getApiErrorMessage(error, "Could not refresh dashboard auth status.")
      );
    }

    return {
      deletedCurrentUser: isCurrentUser,
    };
  }, [currentUser?.id, persistSession]);

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      currentUser,
      ready,
      isAuthenticated: Boolean(currentUser),
      hasRegisteredUsers,
      register,
      login,
      getUsers,
      setUserSuspended,
      removeUser,
      logout,
    }),
    [
      currentUser,
      ready,
      hasRegisteredUsers,
      register,
      login,
      getUsers,
      setUserSuspended,
      removeUser,
      logout,
    ]
  );

  return (
    <DashboardAuthContext.Provider value={value}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext);

  if (!context) {
    throw new Error("useDashboardAuth must be used inside DashboardAuthProvider");
  }

  return context;
}

export function DashboardProtectedRoute() {
  const location = useLocation();
  const { ready, isAuthenticated } = useDashboardAuth();

  if (!ready) {
    return (
      <div className="dashboard-auth min-h-screen">
        <div className="dashboard-auth__backdrop" />
        <div className="flex min-h-screen items-center justify-center px-6 text-center text-[#144a58]">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/waji/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
