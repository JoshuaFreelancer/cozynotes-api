const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const authenticateToken = require("../middlewares/authMiddleware");

// Applying my JWT middleware to all note routes to ensure only logged-in users get here
router.use(authenticateToken);

// Mapping the HTTP methods to my controller logic
router.get("/", getAllNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
