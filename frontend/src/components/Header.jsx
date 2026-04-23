import React from "react";
import { List } from "@phosphor-icons/react";
import { SearchBar } from "./SearchBar";
import { useUIStore } from "../store/useUIStore";
import UserMenu from "./UserMenu";

export const Header = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="w-full flex items-center justify-between px-3 py-2.5 md:py-3 md:px-6 sticky top-0 z-50 bg-[#F7F6F3]/80 backdrop-blur-md border-b-2 border-slate-200">
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Sidebar Trigger */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-white border-2 border-slate-200 border-b-4 hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 transition-all text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          <List size={24} weight="bold" />
        </button>

        {/* Branding Responsive */}
        <div className="hidden sm:flex items-center gap-2">
          <img
            src="/Cozy_Notes_Logo.webp"
            alt="Cozy Notes Logo"
            className="w-9 h-9 md:w-10 md:h-10 shrink-0"
          />
          <h1 className="hidden md:block font-display text-xl md:text-2xl font-bold text-slate-800 tracking-wide">
            Cozy<span className="text-slate-500">Notes</span>
          </h1>
        </div>
      </div>

      {/* The Search Bar: adjusted margins to prevent squeezing on mobile */}
      <div className="flex-1 max-w-2xl mx-2 sm:mx-4 md:mx-6 lg:mx-12">
        <SearchBar />
      </div>

      <div className="flex items-center shrink-0">
        <UserMenu />
      </div>
    </header>
  );
};
