const express = require("express");
const {
  getDashboardAuthStatus,
  registerDashboardUser,
  loginDashboardUser,
  listDashboardUsers,
  updateDashboardUserStatus,
  deleteDashboardUser,
} = require("../Controller/dashboardAuthController");

const router = express.Router();

router.get("/dashboard-auth/status", getDashboardAuthStatus);
router.post("/dashboard-auth/register", registerDashboardUser);
router.post("/dashboard-auth/login", loginDashboardUser);
router.get("/dashboard-auth/users", listDashboardUsers);
router.patch("/dashboard-auth/users/:id/status", updateDashboardUserStatus);
router.delete("/dashboard-auth/users/:id", deleteDashboardUser);

module.exports = router;
