const express = require("express");
const cors = require("cors");

// Let's set up the main app instance
const app = express();

// --- CORS Configuration ---
// List of allowed origins for development and production
const allowedOrigins = [
  "http://localhost:5173", 
  "https://cozy-notes.web.app",
  "https://cozy-notes.firebaseapp.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Standard global middlewares
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