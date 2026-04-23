import { create } from 'zustand';
import { notesService } from '../services/notes.service';

export const useNoteStore = create((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  // Action to fetch notes from the database
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notesService.getAll();
      set({ notes: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Action to add a note
  addNote: async (newNote) => {
    try {
      const createdNote = await notesService.create(newNote);
      // Optimistically update the UI or use the DB response
      set((state) => ({ notes: [createdNote, ...state.notes] }));
    } catch (error) {
      console.error("Failed to add note", error);
    }
  },

  // Action to delete a note
  deleteNote: async (id) => {
    try {
      await notesService.delete(id);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  }
}));