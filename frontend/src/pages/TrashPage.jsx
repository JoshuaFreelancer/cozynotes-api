import React, { useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Trash as TrashIcon, WarningCircle } from '@phosphor-icons/react';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from '../components/NoteCard';

export const TrashPage = () => {
  const [gridRef] = useAutoAnimate();
  
  // FIX: I added a fallback `= []` to trashedNotes.
  // This guarantees that even on the very first millisecond of render, 
  // or if the backend returns undefined, it will always be a valid array.
  const { trashedNotes = [], fetchTrashedNotes, emptyTrash, isLoading, error } = useNoteStore();

  useEffect(() => {
    fetchTrashedNotes();
  }, [fetchTrashedNotes]);

  const handleEmptyTrash = async () => {
    if (window.confirm("Are you sure you want to permanently delete all notes in the trash?")) {
      await emptyTrash();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
        
      {/* Top action bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-500 italic text-sm md:text-base font-medium">
        <p>Notes in the trash are deleted after 7 days.</p>
        
        {/* Safe check using the fallback */}
        {trashedNotes.length > 0 && (
          <button 
            onClick={handleEmptyTrash}
            disabled={isLoading}
            className="not-italic text-slate-700 font-bold hover:text-rose-500 transition-colors focus:outline-none disabled:opacity-50"
          >
            Empty trash
          </button>
        )}
      </div>

      {error && (
        <div className="w-full max-w-3xl mx-auto p-4 bg-bento-peach border-2 border-[#DBA19C] rounded-[20px] flex items-center gap-3 text-rose-900 shadow-sm mt-8">
          <WarningCircle size={24} weight="duotone" className="shrink-0" />
          <p className="font-semibold font-body">{error}</p>
        </div>
      )}

      {/* Note Grid for Trashed Notes */}
      {!isLoading && trashedNotes.length > 0 && (
        <div 
          ref={gridRef} 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)] grid-flow-dense mt-4"
        >
          {trashedNotes.map((note) => (
            <NoteCard key={`trash-${note.id}`} note={note} isTrash={true} />
          ))}
        </div>
      )}

      {/* Empty State when the trash is completely clean */}
      {!isLoading && trashedNotes.length === 0 && !error && (
        <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-300 rounded-3xl bg-white/50 mt-8">
          <TrashIcon size={48} weight="duotone" />
          <p className="font-semibold font-body text-[15px]">
            Trash is empty
          </p>
        </div>
      )}

    </div>
  );
};