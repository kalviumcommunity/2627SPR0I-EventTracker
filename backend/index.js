require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Backend health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "EventTracker backend is running",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EventTracker backend running on port ${PORT}`);
});
