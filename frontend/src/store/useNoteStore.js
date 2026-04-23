// src/store/useNoteStore.js
import { create } from "zustand";
import { notesService } from "../services/notesService";
import { collectTags } from "../utils/noteFilters";
import { showActionToast, showErrorToast } from "../utils/sileoToasts";

export const useNoteStore = create((set, get) => ({
  notes: [],
  archivedNotes: [],
  trashedNotes: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  selectedNoteType: "text",
  filters: {
    query: "",
    type: "all",
    tag: "",
  },
  availableTags: [],

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

  setSearchQuery: (query) =>
    set((state) => ({
      filters: { ...state.filters, query },
    })),

  setTypeFilter: (type) =>
    set((state) => ({
      filters: { ...state.filters, type },
    })),

  setTagFilter: (tag) =>
    set((state) => ({
      filters: { ...state.filters, tag },
    })),

  clearFilters: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        query: "",
        type: "all",
        tag: "",
      },
    })),

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notesService.getAll();
      set((state) => ({
        notes: data,
        availableTags: collectTags(data, state.archivedNotes),
        isLoading: false,
      }));
    } catch {
      set({ error: "Failed to fetch notes", isLoading: false });
    }
  },

  fetchArchivedNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notesService.getArchived();
      set((state) => ({
        archivedNotes: data,
        availableTags: collectTags(state.notes, data),
        isLoading: false,
      }));
    } catch {
      set({ error: "Failed to fetch archived notes", isLoading: false });
    }
  },

  createNote: async (noteData) => {
    set({ isLoading: true, error: null });
    try {
      const newNote = await notesService.create(noteData);
      set((state) => ({
        notes: newNote.isArchived
          ? state.notes
          : [newNote, ...state.notes],
        archivedNotes: newNote.isArchived
          ? [newNote, ...state.archivedNotes]
          : state.archivedNotes,
        availableTags: collectTags(
          newNote.isArchived ? state.notes : [newNote, ...state.notes],
          newNote.isArchived ? [newNote, ...state.archivedNotes] : state.archivedNotes,
        ),
        isModalOpen: false,
        isLoading: false,
      }));
      showActionToast("create", noteData);
      return true;
    } catch {
      showErrorToast("Could not create note", "Create failed");
      set({ error: "Failed to create note", isLoading: false });
      return false;
    }
  },

  updateNote: async (noteId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await notesService.update(noteId, updatedData);

      set((state) => ({
        notes: [
          ...state.notes.filter((note) => note.id !== noteId),
          ...(updatedNote.isArchived ? [] : [updatedNote]),
        ],
        archivedNotes: [
          ...state.archivedNotes.filter((note) => note.id !== noteId),
          ...(updatedNote.isArchived ? [updatedNote] : []),
        ],
        availableTags: collectTags(
          [
            ...state.notes.filter((note) => note.id !== noteId),
            ...(updatedNote.isArchived ? [] : [updatedNote]),
          ],
          [
            ...state.archivedNotes.filter((note) => note.id !== noteId),
            ...(updatedNote.isArchived ? [updatedNote] : []),
          ],
        ),
        isModalOpen: false,
        isLoading: false,
        currentNoteToEdit: null,
      }));
      showActionToast("update", updatedData);
      return true;
    } catch {
      showErrorToast("Could not update note", "Update failed");
      set({ error: "Failed to update note", isLoading: false });
      return false;
    }
  },

  deleteNote: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      const removedNote = get().notes.find((note) => note.id === noteId);
      await notesService.delete(noteId); 

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
        archivedNotes: state.archivedNotes.filter((note) => note.id !== noteId),
        isModalOpen: false,
        isLoading: false,
        currentNoteToEdit: null,
      }));
      showActionToast("archive", {
        isArchived: true,
        isPinned: removedNote?.isPinned,
      });
      return true;
    } catch {
      showErrorToast("Could not delete note", "Delete failed");
      set({ error: "Failed to delete note", isLoading: false });
      return false;
    }
  },

  // --- NUEVAS FUNCIONES DE LA PAPELERA QUE FALTABAN ---

  fetchTrashedNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notesService.getTrash();
      set({ trashedNotes: data, isLoading: false });
    } catch {
      set({ error: "Failed to fetch trash", isLoading: false });
    }
  },

  emptyTrash: async () => {
    set({ isLoading: true, error: null });
    try {
      await notesService.emptyTrash();
      set({ trashedNotes: [], isLoading: false });
      showActionToast("trash");
      return true;
    } catch {
      showErrorToast("Could not empty trash", "Trash failed");
      set({ error: "Failed to empty trash", isLoading: false });
      return false;
    }
  },

  restoreTrashedNote: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      const restoredNote = await notesService.restoreFromTrash(noteId);
      set((state) => ({
        trashedNotes: state.trashedNotes.filter((note) => note.id !== noteId),
        notes: restoredNote.isArchived
          ? state.notes
          : [restoredNote, ...state.notes],
        archivedNotes: restoredNote.isArchived
          ? [restoredNote, ...state.archivedNotes]
          : state.archivedNotes,
        availableTags: collectTags(
          restoredNote.isArchived ? state.notes : [restoredNote, ...state.notes],
          restoredNote.isArchived
            ? [restoredNote, ...state.archivedNotes]
            : state.archivedNotes,
        ),
        isLoading: false,
      }));
      showActionToast("restore", restoredNote);
      return true;
    } catch {
      showErrorToast("Could not restore note", "Restore failed");
      set({ error: "Failed to restore note", isLoading: false });
      return false;
    }
  },

  deleteTrashedNote: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      await notesService.deleteFromTrash(noteId);
      set((state) => ({
        trashedNotes: state.trashedNotes.filter((note) => note.id !== noteId),
        isLoading: false,
      }));
      showActionToast("destroy");
      return true;
    } catch {
      showErrorToast("Could not permanently delete note", "Permanent delete failed");
      set({ error: "Failed to permanently delete note", isLoading: false });
      return false;
    }
  },

  addTagToNote: async (noteId, name) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await notesService.addTag(noteId, name);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? updatedNote : note,
        ),
        archivedNotes: state.archivedNotes.map((note) =>
          note.id === noteId ? updatedNote : note,
        ),
        availableTags: collectTags(
          state.notes.map((note) => (note.id === noteId ? updatedNote : note)),
          state.archivedNotes.map((note) =>
            note.id === noteId ? updatedNote : note,
          ),
        ),
        currentNoteToEdit:
          state.currentNoteToEdit?.id === noteId
            ? updatedNote
            : state.currentNoteToEdit,
        isLoading: false,
      }));
      showActionToast("tagAdd", { name });
      return true;
    } catch {
      showErrorToast("Could not add tag", "Tag add failed");
      set({ error: "Failed to add tag", isLoading: false });
      return false;
    }
  },

  removeTagFromNote: async (noteId, tagId) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await notesService.removeTag(noteId, tagId);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? updatedNote : note,
        ),
        archivedNotes: state.archivedNotes.map((note) =>
          note.id === noteId ? updatedNote : note,
        ),
        availableTags: collectTags(
          state.notes.map((note) => (note.id === noteId ? updatedNote : note)),
          state.archivedNotes.map((note) =>
            note.id === noteId ? updatedNote : note,
          ),
        ),
        currentNoteToEdit:
          state.currentNoteToEdit?.id === noteId
            ? updatedNote
            : state.currentNoteToEdit,
        isLoading: false,
      }));
      showActionToast("tagRemove", {}, { description: "Tag removed from note." });
      return true;
    } catch {
      showErrorToast("Could not remove tag", "Tag remove failed");
      set({ error: "Failed to remove tag", isLoading: false });
      return false;
    }
  },

  createGlobalTag: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const tag = await notesService.createTag(name);
      set((state) => ({
        availableTags: collectTags(
          state.notes,
          state.archivedNotes,
          [{ tags: [tag] }],
        ),
        isLoading: false,
      }));
      showActionToast("tagCreate", { name: tag.name });
      return tag;
    } catch {
      showErrorToast("Could not create tag", "Tag creation failed");
      set({ error: "Failed to create tag", isLoading: false });
      return null;
    }
  },

  fetchGlobalTags: async () => {
    try {
      const tags = await notesService.getTags();
      set((state) => ({
        availableTags: collectTags(
          state.notes,
          state.archivedNotes,
          [{ tags }],
        ),
      }));
    } catch {
      set({ error: "Failed to fetch tags" });
    }
  },
}));