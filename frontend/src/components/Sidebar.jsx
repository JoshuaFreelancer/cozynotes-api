import React from "react";
import { Folders, Tag, Archive, Trash } from "@phosphor-icons/react";

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      id: "all",
      label: "All Notes",
      icon: <Folders size={20} weight="duotone" className="text-slate-600" />,
      theme: "bg-bento-lavender border-[#C4B2E0]",
      active: true,
    },
    {
      id: "tags",
      label: "Edit Tags",
      icon: <Tag size={20} weight="duotone" className="text-slate-600" />,
      theme: "bg-bento-sky border-[#A2CBE8]",
      active: false,
    },
    {
      id: "archived",
      label: "Archived Notes",
      icon: <Archive size={20} weight="duotone" className="text-slate-600" />,
      theme: "bg-bento-yellow border-[#E8D174]",
      active: false,
    },
  ];

  return (
    <>
      {/* Mobile Overlay: I bumped the z-index to 55 so it covers the z-50 Header entirely */}
      {isOpen && (
        <div
          className="fixed inset-0 z-55 bg-slate-900/5 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* The Ghost Spacer: Keeps the desktop layout from shifting abruptly */}
      <div 
        className={`
          hidden md:block shrink-0 transition-[width] duration-300 ease-out 
        `} 
      />

      <aside
        className={`
          /* I set mobile z-index to 60 (above the header) and desktop to 40 (below the header) */
          group fixed md:sticky top-0 md:top-20 z-60 md:z-40 flex flex-col gap-2
          h-full md:h-[calc(100vh-80px)] 
          
          /* I added extra top padding (pt-8) on mobile so the first item doesn't touch the screen edge */
          pt-8 md:pt-4 pb-4 
          
          transition-[width,transform,box-shadow] duration-300 ease-out overflow-hidden
          bg-[#F7F6F3]
          
          /* Mobile Logic */
          ${isOpen ? "translate-x-0 w-70 shadow-2xl" : "-translate-x-full md:translate-x-0"}
          
          /* Desktop Logic */
          md:w-22
          ${isOpen ? "md:w-70 md:shadow-none" : "md:hover:w-70 md:hover:shadow-2xl md:shadow-none"}
        `}
      >
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`
                relative flex items-center h-14 w-full transition-all duration-200 ease-out focus:outline-none
                rounded-r-[20px] cursor-pointer group/btn
                
                justify-center
                md:group-hover:justify-start md:group-hover:pl-5 md:group-hover:pr-4
                ${isOpen ? "justify-start pl-5 pr-4" : ""}
                
                ${
                  item.active
                    ? "md:group-hover:bg-white md:group-hover:shadow-sm"
                    : "hover:bg-slate-200/50"
                }
                ${isOpen && item.active ? "bg-white shadow-sm" : ""}
              `}
            >
              <div
                className={`
                shrink-0 flex items-center justify-center w-10 h-10 rounded-[14px]
                transition-all duration-200 shadow-sm border-2 border-b-4
                md:group-hover:scale-105 group-active/btn:border-b-2 group-active/btn:translate-y-0.5
                ${item.theme}
              `}
              >
                {item.icon}
              </div>

              <span
                className={`
                whitespace-nowrap font-bold text-[14px] text-slate-700
                transition-all duration-200 ease-out
                
                w-0 opacity-0 md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-4
                ${isOpen ? "w-auto opacity-100 ml-4" : ""}
              `}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Trash Section */}
        <div className="mt-auto pt-2 mb-4 border-t-2 border-slate-200/60">
          <button
            className={`
              relative flex items-center h-14 w-full transition-all duration-200 ease-out focus:outline-none
              rounded-r-[20px] cursor-pointer hover:bg-rose-50 group/trash
              
              justify-center
              md:group-hover:justify-start md:group-hover:pl-5 md:group-hover:pr-4
              ${isOpen ? "justify-start pl-5 pr-4" : ""}
           `}
          >
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-[14px] bg-rose-100 border-2 border-rose-200 border-b-4 border-b-rose-300 shadow-sm transition-all duration-200 group-hover/trash:scale-105 group-active/trash:border-b-2 group-active/trash:translate-y-0.5">
              <Trash
                size={20}
                weight="duotone"
                className="text-rose-500 transition-colors"
              />
            </div>

            <span
              className={`
                whitespace-nowrap font-bold text-[14px] text-slate-500 group-hover/trash:text-rose-600
                transition-all duration-200 ease-out
                w-0 opacity-0 md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-4
                ${isOpen ? "w-auto opacity-100 ml-4" : ""}
              `}
            >
              Trash
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};