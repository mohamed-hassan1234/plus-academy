const crypto = require("crypto");
const DashboardUser = require("../model/dashboardUserModel");

const hashPassword = (password, salt) =>
  crypto.scryptSync(password, salt, 64).toString("hex");

const createPasswordRecord = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);

  return {
    salt,
    hash,
  };
};

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  isSuspended: Boolean(user.isSuspended),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getDashboardAuthStatus = async (req, res) => {
  try {
    const count = await DashboardUser.countDocuments();

    return res.status(200).json({
      success: true,
      hasUsers: count > 0,
      count,
      activeCount: await DashboardUser.countDocuments({ isSuspended: { $ne: true } }),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking dashboard auth status.",
      error: error.message,
    });
  }
};

const registerDashboardUser = async (req, res) => {
  try {
    const fullName = req.body?.fullName?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password?.trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const existingUser = await DashboardUser.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This dashboard email is already registered.",
      });
    }

    const { salt, hash } = createPasswordRecord(password);

    const user = await DashboardUser.create({
      fullName,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      isSuspended: false,
    });

    return res.status(201).json({
      success: true,
      message: "Dashboard account created successfully.",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating dashboard account.",
      error: error.message,
    });
  }
};

const loginDashboardUser = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await DashboardUser.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "This dashboard account is suspended. Please contact the admin.",
      });
    }

    const attemptedHash = hashPassword(password, user.passwordSalt);

    if (attemptedHash !== user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard login successful.",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging into dashboard.",
      error: error.message,
    });
  }
};

const listDashboardUsers = async (req, res) => {
  try {
    const users = await DashboardUser.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users.map(sanitizeUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error loading dashboard users.",
      error: error.message,
    });
  }
};

const updateDashboardUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body || {};

    if (typeof isSuspended !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isSuspended must be true or false.",
      });
    }

    const user = await DashboardUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Dashboard user not found.",
      });
    }

    if (!user.isSuspended && isSuspended) {
      const activeUsers = await DashboardUser.countDocuments({
        isSuspended: { $ne: true },
      });

      if (activeUsers <= 1) {
        return res.status(400).json({
          success: false,
          message: "You cannot suspend the last active dashboard user.",
        });
      }
    }

    user.isSuspended = isSuspended;
    await user.save();

    return res.status(200).json({
      success: true,
      message: isSuspended
        ? "Dashboard user suspended successfully."
        : "Dashboard user activated successfully.",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating dashboard user status.",
      error: error.message,
    });
  }
};

const deleteDashboardUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await DashboardUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Dashboard user not found.",
      });
    }

    const totalUsers = await DashboardUser.countDocuments();

    if (totalUsers <= 1) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete the last dashboard user.",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Dashboard user deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting dashboard user.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardAuthStatus,
  registerDashboardUser,
  loginDashboardUser,
  listDashboardUsers,
  updateDashboardUserStatus,
  deleteDashboardUser,
};
