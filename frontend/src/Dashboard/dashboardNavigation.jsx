export const dashboardNavigation = [
  {
    label: "Dashboard",
    path: "/waji",
    description: "Overview, growth, and quick actions",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3.75 12.75 12 4.5l8.25 8.25M6.75 10.5V19.5h10.5v-9"
      />
    ),
  },
  {
    label: "Manage Users",
    path: "/waji/manage-users",
    description: "View, suspend, activate, and delete dashboard users",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M16.5 18.75v-.75A3.75 3.75 0 0 0 12.75 14.25h-1.5A3.75 3.75 0 0 0 7.5 18v.75M15 7.875a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm5.25 10.875v-.75A3 3 0 0 0 17.25 15M16.5 5.625a2.625 2.625 0 1 1 0 5.25"
      />
    ),
  },
  {
    label: "All Students",
    path: "/waji/students",
    description: "Student records and filters",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15 19.5v-1.125a3.375 3.375 0 0 0-3.375-3.375H8.25a3.375 3.375 0 0 0-3.375 3.375V19.5M14.25 7.5a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0ZM19.125 19.5v-.75A3 3 0 0 0 16.5 15.78M14.625 4.969a2.625 2.625 0 0 1 0 5.062"
      />
    ),
  },
  {
    label: "Add Student",
    path: "/waji/create",
    description: "Create a new student record",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 4.5v15m7.5-7.5h-15"
      />
    ),
  },
  {
    label: "Classes",
    path: "/waji/classes",
    description: "Sessions and registration control",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 6.75v12m0-12C10.687 5.963 8.989 5.625 7.125 5.625S3.563 5.963 2.25 6.75v12c1.313-.787 3.01-1.125 4.875-1.125s3.562.338 4.875 1.125m0-12c1.313-.787 3.01-1.125 4.875-1.125s3.562.338 4.875 1.125v12c-1.313-.787-3.01-1.125-4.875-1.125s-3.562.338-4.875 1.125"
      />
    ),
  },
  {
    label: "Attendance",
    path: "/waji/attendance",
    description: "Daily attendance and export",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M7.5 3.75v2.25m9-2.25v2.25M3.75 8.25h16.5M5.25 6h13.5A1.5 1.5 0 0 1 20.25 7.5v10.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V7.5A1.5 1.5 0 0 1 5.25 6ZM8.25 12.75h3v3h-3v-3Z"
      />
    ),
  },
  {
    label: "Alumni",
    path: "/waji/alumni",
    description: "Public alumni showcase",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M18 18.75h3.75v-3.75M6 18.75H2.25v-3.75M8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Zm8.25 9v-.75A3.75 3.75 0 0 0 12.75 14.25h-1.5A3.75 3.75 0 0 0 7.5 18v.75"
      />
    ),
  },
  {
    label: "Events",
    path: "/waji/hackathons",
    description: "Create events, workshops, hackathons, and graduations",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4.5 6.75h15m-15 5.25h15m-12 5.25h9M6.75 3.75h10.5A2.25 2.25 0 0 1 19.5 6v12a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25Z"
      />
    ),
  },
  {
    label: "Registrations",
    path: "/waji/hackathon-registrations",
    description: "Hackathon applications and review",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4.5 6.75h15m-15 5.25h15m-15 5.25h9"
      />
    ),
  },
  {
    label: "Contacts",
    path: "/waji/contacts",
    description: "Inbox and contact messages",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M21.75 8.25v7.5A2.25 2.25 0 0 1 19.5 18H4.5a2.25 2.25 0 0 1-2.25-2.25v-7.5m19.5 0A2.25 2.25 0 0 0 19.5 6H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.69 5.212a2.25 2.25 0 0 1-2.122 0L2.25 8.25"
      />
    ),
  },
];

export function getDashboardMeta(pathname) {
  const exactMatch = dashboardNavigation.find((item) => item.path === pathname);

  if (exactMatch) {
    return exactMatch;
  }

  if (pathname.startsWith("/waji/students/")) {
    return {
      label: "Student Details",
      description: "Review and update a student profile",
    };
  }

  if (pathname.startsWith("/waji/classes/")) {
    return {
      label: "Class Students",
      description: "Manage students inside one class",
    };
  }

  if (pathname.startsWith("/waji/hackathon-registrations/")) {
    return {
      label: "Registration Details",
      description: "Review one hackathon application",
    };
  }

  return {
    label: "Dashboard",
    description: "Manage PlusAcademy data in one place",
  };
}
