require("dotenv").config();

const crypto = require("crypto");
const readline = require("readline");
const mongoose = require("mongoose");
const { getMongoUri, maskMongoUri } = require("./config/database");
const DashboardUser = require("./model/dashboardUserModel");

const hashPassword = (password, salt) =>
  crypto.scryptSync(password, salt, 64).toString("hex");

const createPasswordRecord = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");

  return {
    salt,
    hash: hashPassword(password, salt),
  };
};

const getArgValue = (name) => {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));

  if (arg) {
    return arg.slice(prefix.length).trim();
  }

  const flagIndex = process.argv.indexOf(`--${name}`);

  if (flagIndex >= 0) {
    return process.argv[flagIndex + 1]?.trim() || "";
  }

  return "";
};

const ask = (rl, question) =>
  new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });

const readSeedInput = async () => {
  const positionalArgs = process.argv.slice(2).filter((value) => {
    return value && !value.startsWith("--");
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const fullName =
      getArgValue("name") ||
      process.env.DASHBOARD_ADMIN_NAME?.trim() ||
      process.env.DASHBOARD_ADMIN_FULL_NAME?.trim() ||
      positionalArgs[0]?.trim() ||
      (await ask(rl, "Dashboard full name: "));
    const email = (
      getArgValue("email") ||
      process.env.DASHBOARD_ADMIN_EMAIL?.trim() ||
      positionalArgs[1]?.trim() ||
      (await ask(rl, "Dashboard email: "))
    ).toLowerCase();
    const password =
      getArgValue("password") ||
      process.env.DASHBOARD_ADMIN_PASSWORD?.trim() ||
      positionalArgs[2]?.trim() ||
      (await ask(rl, "Dashboard password: "));

    return { fullName, email, password };
  } finally {
    rl.close();
  }
};

const seedDashboardUser = async () => {
  const { fullName, email, password } = await readSeedInput();

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
