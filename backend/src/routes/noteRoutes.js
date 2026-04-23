const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  getArchivedNotes,
  getTrash,
  createNote,
  updateNote,
  deleteNote,
  emptyTrash,
  restoreFromTrash,
  deleteFromTrash,
  addTagToNote,
  removeTagFromNote,
} = require("../controllers/noteController");
const authenticateToken = require("../middlewares/authMiddleware");

// Applying my JWT middleware to all note routes to ensure only logged-in users get here
router.use(authenticateToken);

// Mapping the HTTP methods to my controller logic
router.get("/", getAllNotes);
router.get("/archived", getArchivedNotes);

// I placed the trash routes BEFORE the /:id routes to prevent Express from parsing "trash" as an ID
router.get("/trash", getTrash);
router.delete("/trash", emptyTrash);

router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/restore", restoreFromTrash);
router.delete("/:id/permanent", deleteFromTrash);
router.post("/:id/tags", addTagToNote);
router.delete("/:id/tags/:tagId", removeTagFromNote);

module.exports = router;