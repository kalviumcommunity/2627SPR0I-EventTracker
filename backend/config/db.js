const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const practiceOutageEnabled = () =>
  process.env.PRACTICE_DB_OUTAGE === "true";

const getSafeFailureCode = (error) =>
  typeof error?.code === "string" && error.code
    ? error.code
    : "CONNECTION_FAILURE";

const logDatabaseFailure = (error) => {
  console.error(
    `Dependency=PostgreSQL; failure=${getSafeFailureCode(error)}`
  );
};

const probeDatabase = async () => {
  if (practiceOutageEnabled()) {
    const error = new Error("Practice database outage");
    error.code = "PRACTICE_DB_OUTAGE";
    throw error;
  }

  return pool.query("SELECT 1");
};

pool.on("error", (error) => {
  logDatabaseFailure(error);
});

const connectDB = async () => {
  try {
    await probeDatabase();
    console.log("PostgreSQL Connected Successfully!");
    return true;
  } catch (error) {
    logDatabaseFailure(error);
    if (!practiceOutageEnabled()) {
      process.exit(1);
    }
    return false;
  }
};

module.exports = {
  pool,
  connectDB,
  probeDatabase,
  logDatabaseFailure,
  practiceOutageEnabled,
};
