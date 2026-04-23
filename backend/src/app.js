const express = require("express");
const cors = require("cors");

// Let's set up the main app instance
const app = express();

// Standard global middlewares
app.use(cors());
app.use(express.json());

// Importing the central router that holds all my API endpoints
const apiRoutes = require("./routes");

// Mounting the main router under the /api prefix
app.use("/api", apiRoutes);

// Quick health check just to make sure the server is breathing
// Note: I moved this to the root level so it's accessible at /health
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Cozy Notes API running smoothly 🍃" });
});

module.exports = app;
