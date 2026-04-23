import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  TextAlignLeft, 
  CheckSquare, 
  Calendar, 
  Image, 
  Tag,
  X 
} from '@phosphor-icons/react';
import { useNoteStore } from '../store/useNoteStore';

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const {
    filters,
    availableTags,
    setSearchQuery,
    setTypeFilter,
    setTagFilter,
    clearFilters,
  } = useNoteStore();

  // I mapped out the note types using our exact Bento color dictionary for visual consistency
  const noteTypes = [
    { id: 'text', label: 'Text', icon: <TextAlignLeft size={28} weight="duotone" />, theme: 'bg-bento-sky border-[#9ABED7] text-sky-900' },
    { id: 'todo', label: 'Tasks', icon: <CheckSquare size={28} weight="duotone" />, theme: 'bg-bento-mint border-[#8DCAC0] text-emerald-900' },
    { id: 'journal', label: 'Journal', icon: <Calendar size={28} weight="duotone" />, theme: 'bg-bento-lavender border-[#C4B2E0] text-violet-900' },
    { id: 'media', label: 'Media', icon: <Image size={28} weight="duotone" />, theme: 'bg-bento-peach border-[#DBA19C] text-rose-900' },
  ];

  // This effect listens for clicks outside the search component to close the dropdown cleanly
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    /* I wrap the entire component in a relative div so the absolute dropdown positions correctly below it */
    <div className="relative w-full z-50" ref={searchRef}>
      
      {/* Search Input Container 
          I removed overflow-hidden from the parent and handled the focus state dynamically 
      */}
      <div 
        className={`
          relative flex items-center w-full h-12 rounded-[20px] bg-white overflow-hidden transition-all
          border-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]
          ${isOpen ? 'border-bento-sky ring-4 ring-bento-sky/20' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <MagnifyingGlass size={20} weight="bold" className="text-slate-400 absolute left-4" />
        <input
          type="text"
          placeholder="Search notes, tags, or tasks..."
          value={filters.query}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full h-full pl-12 pr-4 bg-transparent outline-none font-body text-[15px] font-semibold text-slate-700 placeholder:text-slate-400"
        />
        {(filters.query || filters.type !== 'all' || filters.tag) && (
          <button
            type="button"
            onClick={clearFilters}
            className="absolute right-3 p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/60"
            title="Clear filters"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>

      {/* Advanced Filter Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute top-[calc(100%+12px)] left-0 w-full bg-[#F7F6F3] border-2 border-slate-200 rounded-3xl shadow-2xl p-5 flex flex-col gap-6 animate-in slide-in-from-top-2 fade-in duration-200"
        >
          
          {/* SECTION: Note Types */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">
              Filter by Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {noteTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setTypeFilter(filters.type === type.id ? 'all' : type.id)
                  }
                  className={`
                    flex flex-col items-center justify-center gap-2 h-24 rounded-2xl
                    border-2 border-b-4 transition-all focus:outline-none
                    hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:border-b-2
                    ${filters.type === type.id ? 'ring-4 ring-slate-800/15' : ''}
                    ${type.theme}
                  `}
                >
                  {type.icon}
                  <span className="font-bold text-[13px]">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION: Tags */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">
              Filter by Tag
            </h3>
            
            {availableTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTagFilter(filters.tag === tag ? '' : tag)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-slate-200 border-b-[3px] rounded-xl text-sm font-bold hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 transition-all ${filters.tag === tag ? 'text-slate-900 bg-bento-sky border-[#9ABED7]' : 'text-slate-600'}`}
                  >
                    <Tag size={16} weight="bold" />
                    {tag}
                  </button>
                ))}
              </div>
            ) : (
              /* Empty State Layout */
              <div className="w-full p-6 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                <Tag size={28} weight="duotone" className="text-slate-400" />
                <p className="font-semibold text-sm text-slate-500">
                  No tags created yet.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};