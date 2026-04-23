const noteService = require("../services/noteService");

const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await noteService.getActiveNotes(userId, req.query.tag);
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ message: "Failed to retrieve notes." });
  }
};

const getArchivedNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await noteService.getArchivedNotes(userId, req.query.tag);
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching archived notes:", error);
    res.status(500).json({ message: "Failed to retrieve archived notes." });
  }
};

const getTrash = async (req, res) => {
  try {
    const notes = await noteService.getTrashedNotes(req.user.id);
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching trash:", error);
    res.status(500).json({ message: "Failed to retrieve trash." });
  }
};

const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const newNote = await noteService.createNote(userId, req.body);
    res.status(201).json(newNote);
  } catch (error) {
    console.error("❌ Error creating note:", error);
    res.status(500).json({ message: "Failed to create the note." });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedNote = await noteService.updateNote(id, userId, req.body);
    res.json(updatedNote);
  } catch (error) {
    console.error("❌ Error updating note:", error.message);
    if (error.message === "Note not found or unauthorized.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update the note." });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await noteService.deleteNote(id, userId);
    res.json({ message: "Note moved to trash successfully." });
  } catch (error) {
    console.error("❌ Error deleting note:", error.message);
    if (error.message === "Note not found or unauthorized.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to delete the note." });
  }
};

const emptyTrash = async (req, res) => {
  try {
    await noteService.emptyTrash(req.user.id);
    res.json({ message: "Trash emptied successfully." });
  } catch (error) {
    console.error("❌ Error emptying trash:", error);
    res.status(500).json({ message: "Failed to empty trash." });
  }
};

const restoreFromTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const restoredNote = await noteService.restoreFromTrash(id, userId);
    res.json(restoredNote);
  } catch (error) {
    console.error("❌ Error restoring note from trash:", error.message);
    if (error.message === "Note not found or unauthorized.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to restore note from trash." });
  }
};

const deleteFromTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await noteService.deleteFromTrash(id, userId);
    res.json({ message: "Note permanently deleted." });
  } catch (error) {
    console.error("❌ Error deleting note from trash:", error.message);
    if (error.message === "Note not found or unauthorized.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to delete note from trash." });
  }
};

const addTagToNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name } = req.body;

    const note = await noteService.addTagToNote(id, userId, name);
    res.json(note);
  } catch (error) {
    console.error("❌ Error adding tag:", error.message);
    if (error.message === "Note not found or unauthorized.") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Tag name is required.") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to add tag to note." });
  }
};

const removeTagFromNote = async (req, res) => {
  try {
    const { id, tagId } = req.params;
    const userId = req.user.id;

    const note = await noteService.removeTagFromNote(id, userId, tagId);
    res.json(note);
  } catch (error) {
    console.error("❌ Error removing tag:", error.message);
    if (error.message === "Note not found or unauthorized.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to remove tag from note." });
  }
};

module.exports = {
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
};
