const express = require("express");
const cors = require("cors");

// Let's set up the main app instance
const app = express();

// Standard global middlewares
app.use(cors());
app.use(express.json());

// TODO: mount notes and auth routes here once they are built
// const notesRoutes = require('./routes/notes');
// app.use('/api/notes', notesRoutes);

// Quick health check just to make sure the API is breathing
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Cozy Notes API running smoothly 🍃" });
});

module.exports = app;
