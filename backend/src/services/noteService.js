const { Note, Tag } = require("../models");
const { Op } = require("sequelize");

const normalizeTagName = (tagName) => {
  if (!tagName || typeof tagName !== "string") return "";
  return tagName.trim().toLowerCase();
};

const normalizeTagList = (tags) => {
  if (!Array.isArray(tags)) return [];

  const normalized = tags.map((tag) => normalizeTagName(tag)).filter(Boolean);

  return [...new Set(normalized)];
};

const buildTagInclude = (tagName) => {
  const include = {
    model: Tag,
    as: "tags",
    through: { attributes: [] },
  };

  const normalizedTag = normalizeTagName(tagName);
  if (normalizedTag) {
    include.where = { name: normalizedTag };
    include.required = true;
  }

  return include;
};

const withTags = {
  include: [
    {
      model: Tag,
      as: "tags",
      through: { attributes: [] },
    },
  ],
};

const getActiveNotes = async (userId, tagName) => {
  return await Note.findAll({
    where: { userId, isArchived: false },
    include: [buildTagInclude(tagName)],
    order: [
      ["isPinned", "DESC"],
      ["createdAt", "DESC"],
    ],
  });
};

const getArchivedNotes = async (userId, tagName) => {
  return await Note.findAll({
    where: { userId, isArchived: true },
    include: [buildTagInclude(tagName)],
    order: [["updatedAt", "DESC"]],
  });
};

// I fetch all notes that have a deletedAt timestamp, ignoring the paranoid filter
const getTrashedNotes = async (userId) => {
  return await Note.findAll({
    where: {
      userId,
      deletedAt: { [Op.not]: null },
    },
    paranoid: false,
    order: [["deletedAt", "DESC"]],
    ...withTags,
  });
};

const createNote = async (userId, noteData) => {
  const { title, content, type, isPinned, colorTheme, tags } = noteData;

  const newNote = await Note.create({
    title,
    content,
    type: type || "TEXT",
    isPinned: isPinned || false,
    colorTheme: colorTheme || "cream",
    userId,
  });

  const tagNames = normalizeTagList(tags);
  if (tagNames.length > 0) {
    const tagModels = await Promise.all(
      tagNames.map(async (name) => {
        const [tag] = await Tag.findOrCreate({
          where: { name },
          defaults: { name },
        });
        return tag;
      }),
    );

    await newNote.setTags(tagModels);
  }

  return await Note.findByPk(newNote.id, withTags);
};

const updateNote = async (noteId, userId, updateData) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });

  if (!note) {
    throw new Error("Note not found or unauthorized.");
  }

  await note.update({
    title: updateData.title !== undefined ? updateData.title : note.title,
    content:
      updateData.content !== undefined ? updateData.content : note.content,
    type: updateData.type !== undefined ? updateData.type : note.type,
    isPinned:
      updateData.isPinned !== undefined ? updateData.isPinned : note.isPinned,
    isArchived:
      updateData.isArchived !== undefined
        ? updateData.isArchived
        : note.isArchived,
    colorTheme:
      updateData.colorTheme !== undefined
        ? updateData.colorTheme
        : note.colorTheme,
  });

  if (Array.isArray(updateData.tags)) {
    const tagNames = normalizeTagList(updateData.tags);
    const tagModels = await Promise.all(
      tagNames.map(async (name) => {
        const [tag] = await Tag.findOrCreate({
          where: { name },
          defaults: { name },
        });
        return tag;
      }),
    );

    await note.setTags(tagModels);
  }

  return await Note.findByPk(note.id, withTags);
};

const deleteNote = async (noteId, userId) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });

  if (!note) {
    throw new Error("Note not found or unauthorized.");
  }

  await note.destroy();
  return true;
};

// I execute a hard delete only on the notes that are already in the trash
const emptyTrash = async (userId) => {
  await Note.destroy({
    where: {
      userId,
      deletedAt: { [Op.not]: null },
    },
    force: true,
  });
  return true;
};

const restoreFromTrash = async (noteId, userId) => {
  const note = await Note.findOne({
    where: {
      id: noteId,
      userId,
      deletedAt: { [Op.not]: null },
    },
    paranoid: false,
  });

  if (!note) {
    throw new Error("Note not found or unauthorized.");
  }

  await note.restore();
  return await Note.findByPk(note.id, withTags);
};

const deleteFromTrash = async (noteId, userId) => {
  const note = await Note.findOne({
    where: {
      id: noteId,
      userId,
      deletedAt: { [Op.not]: null },
    },
    paranoid: false,
  });

  if (!note) {
    throw new Error("Note not found or unauthorized.");
  }

  await note.destroy({ force: true });
  return true;
};

const addTagToNote = async (noteId, userId, tagName) => {
  const normalized = normalizeTagName(tagName);
  if (!normalized) {
    throw new Error("Tag name is required.");
  }

  const note = await Note.findOne({ where: { id: noteId, userId } });
  if (!note) {
    throw new Error("Note not found or unauthorized.");
  }

  const [tag] = await Tag.findOrCreate({
    where: { name: normalized },
    defaults: { name: normalized },
  });

  await note.addTag(tag);
  return await Note.findByPk(note.id, withTags);
};

const removeTagFromNote = async (noteId, userId, tagId) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  if (!note) {
    throw new Error("Note not found or unauthorized.");
  }

  const tag = await Tag.findByPk(tagId);
  if (!tag) {
    return await Note.findByPk(note.id, withTags);
  }

  await note.removeTag(tag);
  return await Note.findByPk(note.id, withTags);
};

module.exports = {
  getActiveNotes,
  getArchivedNotes,
  getTrashedNotes,
  createNote,
  updateNote,
  deleteNote,
  emptyTrash,
  restoreFromTrash,
  deleteFromTrash,
  addTagToNote,
  removeTagFromNote,
};
