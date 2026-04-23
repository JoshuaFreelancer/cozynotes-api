const tagService = require("../services/tagService");

const getTags = async (req, res) => {
  try {
    const tags = await tagService.listTags();
    res.json(tags);
  } catch (error) {
    console.error("❌ Error fetching tags:", error);
    res.status(500).json({ message: "Failed to retrieve tags." });
  }
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await tagService.createTag(name);
    res.status(201).json(tag);
  } catch (error) {
    console.error("❌ Error creating tag:", error.message);

    if (error.message === "Tag name is required.") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create tag." });
  }
};

module.exports = {
  getTags,
  createTag,
};
