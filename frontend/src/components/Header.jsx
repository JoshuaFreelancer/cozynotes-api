import React from "react";
import { List, GridFour, ListDashes, Book } from "@phosphor-icons/react";
import { SearchBar } from "./SearchBar";
import { useUIStore } from "../store/useUIStore";

export const Header = () => {
  const { toggleSidebar } = useUIStore();

  return (
    /* I made the header narrower by reducing the vertical padding (py-2.5 on mobile, py-3 on desktop) */
    <header className="w-full flex items-center justify-between px-4 py-2.5 md:py-3 md:px-6 sticky top-0 z-50 bg-[#F7F6F3]/80 backdrop-blur-md border-b-2 border-slate-200">
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Sidebar Trigger */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-white border-2 border-slate-200 border-b-4 hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 transition-all text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          <List size={24} weight="bold" />
        </button>

        {/* I completely hide the branding on mobile (hidden md:flex) to maximize space for the search bar */}
        <div className="hidden md:flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-bento-peach border-2 border-[#DBA19C] border-b-4 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
            <Book size={24} weight="duotone" className="text-rose-900" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-slate-800 tracking-wide">
            CozyNotes
          </h1>
        </div>
      </div>

      {/* The Search Bar is now always visible. I removed the 'hidden' class and adjusted margins for mobile. */}
      <div className="flex-1 max-w-2xl mx-3 md:mx-6 lg:mx-12">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* I removed the mobile magnifying glass button since the actual search bar is permanent now. */}

        <div className="flex bg-slate-200/60 rounded-2xl p-1 border-2 border-slate-200/50 shadow-inner">
          <button className="p-1.5 md:p-2 rounded-xl bg-white shadow-sm border-2 border-slate-200 text-slate-800 cursor-default focus:outline-none">
            <GridFour size={20} weight="fill" />
          </button>

          <button className="p-1.5 md:p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-colors focus:outline-none">
            <ListDashes size={20} weight="bold" />
          </button>
        </div>
      </div>
    </header>
  );
};
