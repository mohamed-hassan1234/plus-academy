require("dotenv").config();

const crypto = require("crypto");
const mongoose = require("mongoose");
const { getMongoUri, maskMongoUri } = require("./config/database");
const DashboardUser = require("./model/dashboardUserModel");

const DASHBOARD_ACCOUNT = {
  fullName: "Plus Academy Admin",
  email: "admin@plusacademyhub.com",
  password: "ChangeThisPassword123",
};

const hashPassword = (password, salt) =>
  crypto.scryptSync(password, salt, 64).toString("hex");

const createPasswordRecord = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");

  return {
    salt,
    hash: hashPassword(password, salt),
  };
};

const seedDashboardUser = async () => {
  const fullName = DASHBOARD_ACCOUNT.fullName.trim();
  const email = DASHBOARD_ACCOUNT.email.trim().toLowerCase();
  const password = DASHBOARD_ACCOUNT.password.trim();

  if (!fullName || !email || !password) {
    throw new Error("Full name, email, and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const mongoUri = getMongoUri();
  console.log(`Connecting to MongoDB: ${maskMongoUri(mongoUri)}`);

  await mongoose.connect(mongoUri);

  const { salt, hash } = createPasswordRecord(password);
  const existingUser = await DashboardUser.findOne({ email });

  if (existingUser) {
    existingUser.fullName = fullName;
    existingUser.passwordHash = hash;
    existingUser.passwordSalt = salt;
    existingUser.isSuspended = false;
    await existingUser.save();

    console.log(`Dashboard account updated and activated: ${email}`);
    return;
  }

  await DashboardUser.create({
    fullName,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    isSuspended: false,
  });

  console.log(`Dashboard account created: ${email}`);
};

seedDashboardUser()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(`Seed failed: ${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
