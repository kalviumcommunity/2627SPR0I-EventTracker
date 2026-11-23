require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);

const { pool, connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/boards");
const dutyRoutes = require("./routes/duties");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Session configuration
app.use(
  session({
    name: "eventtracker.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Authentication routes
app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);
app.use("/duties", dutyRoutes);

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "healthy",
      message: "EventTracker backend and PostgreSQL are connected!",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      message: "Database connection unavailable",
    });
  }
});

// Start server after database connects
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
