import React, { useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Archive,
  CircleNotch,
  WarningCircle,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import { useNoteStore } from "../store/useNoteStore";
import { NoteCard } from "../components/NoteCard";
import { filterNotes } from "../utils/noteFilters";

export const ArchivedPage = () => {
  const [gridRef] = useAutoAnimate();
  const {
    archivedNotes,
    filters,
    fetchArchivedNotes,
    updateNote,
    isLoading,
    error,
  } = useNoteStore();

  useEffect(() => {
    fetchArchivedNotes();
  }, [fetchArchivedNotes]);

  const visibleArchivedNotes = filterNotes(archivedNotes, filters);

  const handleUnarchive = async (note) => {
    await updateNote(note.id, { isArchived: false });
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
        <CircleNotch size={40} weight="bold" className="animate-spin" />
        <p className="font-semibold font-display tracking-wide">
          Loading archived notes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-rose-50 border-2 border-rose-200 rounded-[20px] flex items-center gap-3 text-rose-700 shadow-sm mt-8">
        <WarningCircle size={28} weight="duotone" className="shrink-0" />
        <p className="font-semibold font-body">
          Oops! Could not load archived notes: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      {visibleArchivedNotes.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)] grid-flow-dense"
        >
          {visibleArchivedNotes.map((note) => (
            <div key={`archived-${note.id}`} className="flex flex-col gap-2">
              <NoteCard note={note} />
              <button
                type="button"
                onClick={() => handleUnarchive(note)}
                disabled={isLoading}
                className="h-9 rounded-xl bg-bento-sky border-2 border-[#A2CBE8] text-sky-950 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                title="Move this note back to active notes"
              >
                <ArrowUUpLeft size={14} weight="bold" /> Unarchive
              </button>
            </div>
          ))}
        </div>
      )}

      {visibleArchivedNotes.length === 0 && (
        <div className="w-full h-64 mt-8 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-300 rounded-3xl bg-white/50">
          <Archive size={48} weight="duotone" />
          <p className="font-semibold font-body text-[15px]">
            No archived notes match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};
