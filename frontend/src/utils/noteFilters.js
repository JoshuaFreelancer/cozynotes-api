const normalize = (value) => (value || "").toString().toLowerCase().trim();

const extractTextFromNode = (node) => {
  if (!node || typeof node !== "object") return "";

  if (typeof node.text === "string") {
    return `${node.text} `;
  }

  if (!Array.isArray(node.content)) return "";
  return node.content.map(extractTextFromNode).join("");
};

const extractContentText = (content) => {
  if (!content) return "";

  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    if (typeof parsed === "string") return parsed;
    if (parsed?.body) return parsed.body;

    if (Array.isArray(parsed?.tasks)) {
      return parsed.tasks.map((task) => task?.text || "").join(" ");
    }

    return extractTextFromNode(parsed);
  } catch {
    return typeof content === "string" ? content : "";
  }
};

const hasTypeMatch = (note, selectedType) => {
  if (!selectedType || selectedType === "all") return true;
  return normalize(note?.type) === normalize(selectedType);
};

const hasTagMatch = (note, selectedTag) => {
  if (!selectedTag) return true;

  const tags = Array.isArray(note?.tags) ? note.tags : [];
  return tags.some((tag) => normalize(tag?.name) === normalize(selectedTag));
};

const hasTextMatch = (note, query) => {
  const cleanQuery = normalize(query);
  if (!cleanQuery) return true;

  const title = normalize(note?.title);
  const contentText = normalize(extractContentText(note?.content));
  const tagNames = (Array.isArray(note?.tags) ? note.tags : [])
    .map((tag) => normalize(tag?.name))
    .join(" ");

  return (
    title.includes(cleanQuery) ||
    contentText.includes(cleanQuery) ||
    tagNames.includes(cleanQuery)
  );
};

export const filterNotes = (notes, filters) => {
  const safeNotes = Array.isArray(notes) ? notes : [];

  return safeNotes.filter((note) => {
    return (
      hasTypeMatch(note, filters?.type) &&
      hasTagMatch(note, filters?.tag) &&
      hasTextMatch(note, filters?.query)
    );
  });
};

export const collectTags = (...noteCollections) => {
  const tagSet = new Set();

  noteCollections.forEach((collection) => {
    (Array.isArray(collection) ? collection : []).forEach((note) => {
      (Array.isArray(note?.tags) ? note.tags : []).forEach((tag) => {
        const normalizedTag = normalize(tag?.name);
        if (normalizedTag) tagSet.add(normalizedTag);
      });
    });
  });

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
};
