import { api } from "./axios";

export const notesService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/notes", { params });
    return data;
  },

  getArchived: async (params = {}) => {
    const { data } = await api.get("/notes/archived", { params });
    return data;
  },

  // Create a new note
  create: async (noteData) => {
    const { data } = await api.post("/notes", noteData);
    return data;
  },

  // Update a note (for editing or pinning)
  update: async (id, noteData) => {
    const { data } = await api.put(`/notes/${id}`, noteData);
    return data;
  },

  // Delete a note
  delete: async (id) => {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
  },

  getTrash: async () => {
    const { data } = await api.get("/notes/trash");
    return data;
  },
  emptyTrash: async () => {
    const { data } = await api.delete("/notes/trash");
    return data;
  },

  restoreFromTrash: async (id) => {
    const { data } = await api.patch(`/notes/${id}/restore`);
    return data;
  },

  deleteFromTrash: async (id) => {
    const { data } = await api.delete(`/notes/${id}/permanent`);
    return data;
  },

  addTag: async (id, name) => {
    const { data } = await api.post(`/notes/${id}/tags`, { name });
    return data;
  },

  removeTag: async (id, tagId) => {
    const { data } = await api.delete(`/notes/${id}/tags/${tagId}`);
    return data;
  },

  getTags: async () => {
    const { data } = await api.get("/tags");
    return data;
  },

  createTag: async (name) => {
    const { data } = await api.post("/tags", { name });
    return data;
  },
};
