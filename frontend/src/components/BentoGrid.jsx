import React, { useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PushPin, NoteBlank, CircleNotch, WarningCircle } from '@phosphor-icons/react';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from './NoteCard';
import { filterNotes } from '../utils/noteFilters';

export const BentoGrid = () => {
  const [pinnedRef] = useAutoAnimate();
  const [othersRef] = useAutoAnimate();
  
  // I'm extracting the fetch action and the network states from my Zustand store
  const { notes, filters, fetchNotes, isLoading, error } = useNoteStore();

  useEffect(() => {
    // I trigger the API call as soon as the grid mounts to retrieve the real database seeds
    fetchNotes();
  }, [fetchNotes]);

  // While waiting for the backend, I render a clean loading state to prevent layout jumps
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
        <CircleNotch size={40} weight="bold" className="animate-spin" />
        <p className="font-semibold font-display tracking-wide">Loading workspace...</p>
      </div>
    );
  }

  // If the Axios request fails, I gracefully display this error banner
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-rose-50 border-2 border-rose-200 rounded-[20px] flex items-center gap-3 text-rose-700 shadow-sm mt-8">
        <WarningCircle size={28} weight="duotone" className="shrink-0" />
        <p className="font-semibold font-body">Oops! Could not load notes: {error}</p>
      </div>
    );
  }

  const visibleNotes = filterNotes(notes, filters);
  const pinnedNotes = visibleNotes.filter(note => note.isPinned);
  const otherNotes = visibleNotes.filter(note => !note.isPinned);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-10">
      
      {/* Pinned Section */}
      {pinnedNotes.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 pl-2">
            <PushPin size={28} weight="duotone" className="text-slate-600" />
            <h2 className="font-display text-xl font-bold text-slate-700 tracking-wide">
              Pinned
            </h2>
          </div>
          <div 
            ref={pinnedRef} 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)] grid-flow-dense"
          >
            {pinnedNotes.map((note) => (
              <NoteCard key={`pinned-${note.id}`} note={note} />
            ))}
          </div>
        </section>
      )}

      {/* Others Section */}
      {otherNotes.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 pl-2">
            <NoteBlank size={28} weight="duotone" className="text-slate-600" />
            <h2 className="font-display text-xl font-bold text-slate-700 tracking-wide">
              Others
            </h2>
          </div>
          <div 
            ref={othersRef} 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)] grid-flow-dense"
          >
            {otherNotes.map((note) => (
              <NoteCard key={`others-${note.id}`} note={note} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State: I render this if the database connection succeeds but returns 0 notes */}
      {!isLoading && !error && visibleNotes.length === 0 && (
        <div className="w-full h-64 mt-8 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-300 rounded-3xl bg-white/50">
          <NoteBlank size={48} weight="duotone" />
          <p className="font-semibold font-body text-[15px]">
            No notes match your current filters.
          </p>
        </div>
      )}

    </div>
  );
};