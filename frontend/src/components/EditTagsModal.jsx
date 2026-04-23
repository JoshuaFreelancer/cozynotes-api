import React, { useEffect, useMemo, useState } from "react";
import { Tag, X } from "@phosphor-icons/react";
import { useNoteStore } from "../store/useNoteStore";
import { useUIStore } from "../store/useUIStore";

export const EditTagsModal = () => {
  const { isTagModalOpen, closeTagModal } = useUIStore();
  const {
    notes,
    archivedNotes,
    availableTags,
    fetchNotes,
    fetchArchivedNotes,
    fetchGlobalTags,
    createGlobalTag,
    addTagToNote,
    removeTagFromNote,
    isLoading,
  } = useNoteStore();

  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!isTagModalOpen) return;
    fetchNotes();
    fetchArchivedNotes();
    fetchGlobalTags();
  }, [isTagModalOpen, fetchNotes, fetchArchivedNotes, fetchGlobalTags]);

  const availableNotes = useMemo(
    () => [...notes, ...archivedNotes],
    [notes, archivedNotes],
  );

  const activeNoteId =
    selectedNoteId || (availableNotes.length > 0 ? availableNotes[0].id : "");

  const selectedNote =
    availableNotes.find((note) => note.id === activeNoteId) || null;

  const handleAdd = async () => {
    if (!newTag.trim()) return;
    const createdTag = await createGlobalTag(newTag.trim());
    if (createdTag) setNewTag("");
  };

  const handleAssignExistingTag = async (tagName) => {
    if (!activeNoteId || !tagName) return;
    await addTagToNote(activeNoteId, tagName);
  };

  const handleRemove = async (tagId) => {
    if (!activeNoteId || !tagId) return;
    const shouldRemove = window.confirm(
      "Remove this tag from the selected note?",
    );
    if (!shouldRemove) return;
    await removeTagFromNote(activeNoteId, tagId);
  };

  if (!isTagModalOpen) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#F7F6F3] border-2 border-slate-200 rounded-[20px] md:rounded-3xl shadow-xl p-4 md:p-6 space-y-3 md:space-y-4">
        <div className="flex items-center justify-between sticky top-0 bg-[#F7F6F3] z-10 pb-1">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Tag size={22} weight="duotone" /> Edit Tags
          </h2>
          <button
            type="button"
            onClick={closeTagModal}
            className="p-1.5 md:p-2 rounded-xl text-slate-500 hover:bg-slate-200/70 transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <label className="text-xs md:text-sm font-bold text-slate-700">
            Create tag
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="e.g. work"
              className="flex-1 h-10 md:h-11 px-3 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-700 text-sm outline-none"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={isLoading || !newTag.trim()}
              className="px-3 md:px-4 h-10 md:h-11 rounded-xl bg-slate-800 text-white text-sm font-bold disabled:opacity-50 transition-opacity"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <label className="text-xs md:text-sm font-bold text-slate-700">
            Available tags
          </label>
          <div className="min-h-12 md:min-h-14 p-2.5 md:p-3 bg-white border-2 border-slate-200 rounded-xl flex flex-wrap gap-2">
            {availableTags.length > 0 ? (
              availableTags.map((tagName) => (
                <span
                  key={tagName}
                  className="px-2 md:px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] md:text-xs font-semibold text-slate-700"
                >
                  #{tagName}
                </span>
              ))
            ) : (
              <span className="text-xs md:text-sm font-semibold text-slate-400">
                No tags yet.
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 md:space-y-2 pb-2">
          <label className="text-xs md:text-sm font-bold text-slate-700">
            Assign tags to note (optional)
          </label>
          <p className="text-[11px] md:text-xs font-semibold text-slate-500 leading-tight">
            Use Add to link a tag. Use Remove to detach it from the selected
            note.
          </p>
          {availableNotes.length > 0 ? (
            <>
              <select
                value={activeNoteId}
                onChange={(e) => setSelectedNoteId(e.target.value)}
                className="w-full h-10 md:h-11 px-3 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-700 text-sm outline-none truncate"
              >
                {availableNotes.map((note) => (
                  <option key={note.id} value={note.id}>
                    {note.title || "Untitled note"}
                  </option>
                ))}
              </select>

              {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1">
                  {availableTags.map((tagName) => (
                    <button
                      key={`assign-${tagName}`}
                      type="button"
                      onClick={() => handleAssignExistingTag(tagName)}
                      className="px-2 md:px-2.5 py-1 rounded-lg bg-bento-sky border border-[#A2CBE8] text-[11px] md:text-xs font-semibold text-slate-800 hover:brightness-95 transition-all"
                    >
                      Add #{tagName}
                    </button>
                  ))}
                </div>
              )}

              <div className="min-h-12 md:min-h-14 p-2.5 md:p-3 bg-white border-2 border-slate-200 rounded-xl flex flex-wrap gap-1.5 md:gap-2">
                {Array.isArray(selectedNote?.tags) &&
                selectedNote.tags.length > 0 ? (
                  selectedNote.tags.map((tagItem) => (
                    <div
                      key={tagItem.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] md:text-xs font-semibold text-slate-700"
                    >
                      <span>#{tagItem.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(tagItem.id)}
                        className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors"
                        title="Remove tag from note"
                        aria-label={`Remove ${tagItem.name} from note`}
                        disabled={isLoading}
                      >
                        <X size={10} weight="bold" />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs md:text-sm font-semibold text-slate-400">
                    No tags in selected note.
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="p-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-xs md:text-sm font-semibold text-center">
              No notes available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
