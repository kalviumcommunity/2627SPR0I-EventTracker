const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL Connected Successfully!");
  } catch (error) {
    console.error("PostgreSQL Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB,
};
