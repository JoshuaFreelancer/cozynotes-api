import { create } from "zustand";

// Creating a global store to manage all note-related state across the application
export const useNoteStore = create((set) => ({
  notes: [],
  isLoading: false,

  // Actions to manipulate the state
  setNotes: (notes) => set({ notes }),

  addNote: (newNote) =>
    set((state) => ({
      // New notes go to the top of the array
      notes: [newNote, ...state.notes],
    })),

  // I will implement the update and delete actions here
  // once I hook up the Axios calls to the backend
}));
