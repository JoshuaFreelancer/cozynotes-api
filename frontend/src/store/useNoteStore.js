// src/store/useNoteStore.js
import { create } from "zustand";
import { notesService } from "../services/notesService";

export const useNoteStore = create((set) => ({
  notes: [],
  trashedNotes: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  selectedNoteType: "text",

  currentNoteToEdit: null,
  modalMode: "create", // can be 'create' or 'edit'

  openCreateModal: (type) =>
    set({
      isModalOpen: true,
      modalMode: "create",
      selectedNoteType: type,
      currentNoteToEdit: null, 
    }),

  openEditModal: (note) =>
    set({
      isModalOpen: true,
      modalMode: "edit",
      currentNoteToEdit: note,
      selectedNoteType: note.type.toLowerCase(),
    }),

  closeModal: () => set({ isModalOpen: false, currentNoteToEdit: null }),

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notesService.getAll();
      set({ notes: data, isLoading: false });
    } catch {
      set({ error: "Failed to fetch notes", isLoading: false });
    }
  },

  createNote: async (noteData) => {
    set({ isLoading: true, error: null });
    try {
      const newNote = await notesService.create(noteData);
      set((state) => ({
        notes: [newNote, ...state.notes],
        isModalOpen: false,
        isLoading: false,
      }));
      return true;
    } catch {
      set({ error: "Failed to create note", isLoading: false });
      return false;
    }
  },

  updateNote: async (noteId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await notesService.update(noteId, updatedData);

      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? updatedNote : note,
        ),
        isModalOpen: false,
        isLoading: false,
        currentNoteToEdit: null,
      }));
      return true;
    } catch {
      set({ error: "Failed to update note", isLoading: false });
      return false;
    }
  },

  deleteNote: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      await notesService.delete(noteId); 

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
        isModalOpen: false,
        isLoading: false,
        currentNoteToEdit: null,
      }));
      return true;
    } catch {
      set({ error: "Failed to delete note", isLoading: false });
      return false;
    }
  },

  // --- NUEVAS FUNCIONES DE LA PAPELERA QUE FALTABAN ---

  fetchTrashedNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notesService.getTrash(); // Asegúrate de tener getTrash en notesService.js
      set({ trashedNotes: data, isLoading: false });
    } catch {
      set({ error: "Failed to fetch trash", isLoading: false });
    }
  },

  emptyTrash: async () => {
    set({ isLoading: true, error: null });
    try {
      await notesService.emptyTrash(); // Asegúrate de tener emptyTrash en notesService.js
      set({ trashedNotes: [], isLoading: false });
      return true;
    } catch {
      set({ error: "Failed to empty trash", isLoading: false });
      return false;
    }
  },
}));