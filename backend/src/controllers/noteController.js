const { Note, Tag } = require("../models");

// Fetch all active notes for the logged-in user
const getAllNotes = async (req, res) => {
  try {
    // The req.user.id will be injected by the JWT middleware later
    const userId = req.user.id;

    const notes = await Note.findAll({
      where: { userId, isArchived: false },
      include: [
        {
          model: Tag,
          as: "tags",
          through: { attributes: [] }, // Hides the junction table data from the response
        },
      ],
      // Pinned notes should always appear first, then sorted by newest
      order: [
        ["isPinned", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ message: "Failed to retrieve notes." });
  }
};

// Create a new note matching the Bento Box dynamic structure
const createNote = async (req, res) => {
  try {
    const { title, content, type, isPinned, colorTheme } = req.body;
    const userId = req.user.id;

    const newNote = await Note.create({
      title,
      content, // This expects a JSON object based on my model configuration
      type: type || "TEXT",
      isPinned: isPinned || false,
      colorTheme: colorTheme || "cream",
      userId,
    });

    // TODO: I will handle dynamic tag creation and association here later

    res.status(201).json(newNote);
  } catch (error) {
    console.error("❌ Error creating note:", error);
    res.status(500).json({ message: "Failed to create the note." });
  }
};

// Update an existing note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, isPinned, isArchived, colorTheme } = req.body;
    const userId = req.user.id;

    const note = await Note.findOne({ where: { id, userId } });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized." });
    }

    // Updating only the fields that were actually sent in the request
    await note.update({
      title: title !== undefined ? title : note.title,
      content: content !== undefined ? content : note.content,
      type: type !== undefined ? type : note.type,
      isPinned: isPinned !== undefined ? isPinned : note.isPinned,
      isArchived: isArchived !== undefined ? isArchived : note.isArchived,
      colorTheme: colorTheme !== undefined ? colorTheme : note.colorTheme,
    });

    res.json(note);
  } catch (error) {
    console.error("❌ Error updating note:", error);
    res.status(500).json({ message: "Failed to update the note." });
  }
};

// Soft delete a note (moves it to the trash thanks to paranoid: true)
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ where: { id, userId } });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized." });
    }

    // This won't actually drop the row, it just populates the 'deletedAt' column
    await note.destroy();

    res.json({ message: "Note moved to trash successfully." });
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    res.status(500).json({ message: "Failed to delete the note." });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
