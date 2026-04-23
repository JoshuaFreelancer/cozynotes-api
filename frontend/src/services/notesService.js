import { api } from './axios';

export const notesService = {
  // Get all notes
  getAll: async () => {
    const { data } = await api.get('/notes');
    return data;
  },

  // Create a new note
  create: async (noteData) => {
    const { data } = await api.post('/notes', noteData);
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
    const { data } = await api.get('/notes/trash');
    return data;
  },
  emptyTrash: async () => {
    const { data } = await api.delete('/notes/trash');
    return data;
  }
};