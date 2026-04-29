const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/plus_academyhub";

const firstConfiguredValue = (...keys) =>
  keys.map((key) => process.env[key]?.trim()).find(Boolean);

const encodeCredential = (value) => encodeURIComponent(value);

const buildMongoUriFromParts = () => {
  const username = firstConfiguredValue("MONGODB_USER", "MONGO_USER", "DB_USER");
  const password = firstConfiguredValue(
    "MONGODB_PASSWORD",
    "MONGO_PASSWORD",
    "DB_PASSWORD"
  );
  const host = firstConfiguredValue("MONGODB_HOST", "MONGO_HOST", "DB_HOST");

  if (!username || !password || !host) {
    return "";
  }

  const database =
    firstConfiguredValue("MONGODB_DATABASE", "MONGO_DATABASE", "DB_NAME") ||
    "plus_academyhub";
  const authSource =
    firstConfiguredValue("MONGODB_AUTH_SOURCE", "MONGO_AUTH_SOURCE") || "admin";
  const protocol = host.startsWith("mongodb+srv://")
    ? "mongodb+srv://"
    : "mongodb://";
  const normalizedHost = host.replace(/^mongodb(\+srv)?:\/\//, "");

  return `${protocol}${encodeCredential(username)}:${encodeCredential(
    password
  )}@${normalizedHost}/${database}?authSource=${encodeURIComponent(authSource)}`;
};

const getMongoUri = () =>
  firstConfiguredValue(
    "MONGODB_URI",
    "MONGO_URI",
    "MONGODB_URL",
    "DATABASE_URL"
  ) ||
  buildMongoUriFromParts() ||
  DEFAULT_MONGODB_URI;

const maskMongoUri = (uri) =>
  uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:@/]+):([^@/]+)@/i, "$1***:***@");

module.exports = {
  getMongoUri,
  maskMongoUri,
};
