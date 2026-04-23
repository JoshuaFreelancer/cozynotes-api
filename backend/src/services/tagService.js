const { Tag } = require("../models");

const normalizeTagName = (tagName) => {
  if (!tagName || typeof tagName !== "string") return "";
  return tagName.trim().toLowerCase();
};

const listTags = async () => {
  return await Tag.findAll({
    order: [["name", "ASC"]],
  });
};

const createTag = async (tagName) => {
  const normalized = normalizeTagName(tagName);
  if (!normalized) {
    throw new Error("Tag name is required.");
  }

  const [tag] = await Tag.findOrCreate({
    where: { name: normalized },
    defaults: { name: normalized },
  });

  return tag;
};

module.exports = {
  listTags,
  createTag,
};
