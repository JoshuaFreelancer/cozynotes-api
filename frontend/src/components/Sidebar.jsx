import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Folders, Tag, Archive, Trash } from "@phosphor-icons/react";
import { useUIStore } from "../store/useUIStore";
import { useNoteStore } from "../store/useNoteStore";

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { openTagModal } = useUIStore();
  const { clearFilters, fetchNotes } = useNoteStore();
  // I pull the current URL path to dynamically highlight the active menu item
  const location = useLocation();

  const navItems = [
    {
      id: "all",
      label: "All Notes",
      icon: <Folders size={20} weight="duotone" className="text-slate-600" />,
      theme: "bg-bento-lavender border-[#C4B2E0]",
      path: "/", // Matches the Dashboard route
    },
    {
      id: "tags",
      label: "Edit Tags",
      icon: <Tag size={20} weight="duotone" className="text-slate-600" />,
      theme: "bg-bento-sky border-[#A2CBE8]",
      action: "open-tags-modal",
    },
    {
      id: "archived",
      label: "Archived Notes",
      icon: <Archive size={20} weight="duotone" className="text-slate-600" />,
      theme: "bg-bento-yellow border-[#E8D174]",
      path: "/archived",
    },
  ];

  const isTrashActive = location.pathname === "/trash";

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
      <div className="hidden md:block shrink-0 transition-[width] duration-300 ease-out" />

      <aside
        className={`
          group fixed md:sticky top-0 md:top-20 z-60 md:z-40 flex flex-col gap-2
          h-full md:h-[calc(100vh-80px)] 
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
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            if (item.action === "open-tags-modal") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    openTagModal();
                    onClose();
                  }}
                  className={`
                    relative flex items-center h-14 w-full transition-all duration-200 ease-out focus:outline-none
                    rounded-r-[20px] cursor-pointer group/btn
                    justify-center
                    md:group-hover:justify-start md:group-hover:pl-5 md:group-hover:pr-4
                    ${isOpen ? "justify-start pl-5 pr-4" : ""}
                    hover:bg-slate-200/50
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
                    {React.cloneElement(item.icon, {
                      className: "text-slate-600",
                    })}
                  </div>

                  <span
                    className={`
                    whitespace-nowrap font-bold text-[14px]
                    transition-all duration-200 ease-out
                    text-slate-700
                    w-0 opacity-0 md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-4
                    ${isOpen ? "w-auto opacity-100 ml-4" : ""}
                  `}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            if (item.id === "all") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={async () => {
                    clearFilters();
                    if (window.location.pathname !== "/") {
                      navigate("/");
                    }
                    await fetchNotes();
                    onClose();
                  }}
                  className={`
                    relative flex items-center h-14 w-full transition-all duration-200 ease-out focus:outline-none
                    rounded-r-[20px] cursor-pointer group/btn
                    justify-center
                    md:group-hover:justify-start md:group-hover:pl-5 md:group-hover:pr-4
                    ${isOpen ? "justify-start pl-5 pr-4" : ""}
                    ${isActive ? "md:group-hover:bg-white md:group-hover:shadow-sm" : "hover:bg-slate-200/50"}
                    ${isOpen && isActive ? "bg-white shadow-sm" : ""}
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
                    {React.cloneElement(item.icon, {
                      weight: isActive ? "fill" : "duotone",
                      className: isActive ? "text-slate-800" : "text-slate-600",
                    })}
                  </div>

                  <span
                    className={`
                    whitespace-nowrap font-bold text-[14px]
                    transition-all duration-200 ease-out
                    ${isActive ? "text-slate-900" : "text-slate-700"}
                    w-0 opacity-0 md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-4
                    ${isOpen ? "w-auto opacity-100 ml-4" : ""}
                  `}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose} // I close the mobile menu automatically upon navigation
                className={`
                  relative flex items-center h-14 w-full transition-all duration-200 ease-out focus:outline-none
                  rounded-r-[20px] cursor-pointer group/btn
                  
                  justify-center
                  md:group-hover:justify-start md:group-hover:pl-5 md:group-hover:pr-4
                  ${isOpen ? "justify-start pl-5 pr-4" : ""}
                  
                  ${
                    isActive
                      ? "md:group-hover:bg-white md:group-hover:shadow-sm"
                      : "hover:bg-slate-200/50"
                  }
                  ${isOpen && isActive ? "bg-white shadow-sm" : ""}
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
                  {/* I clone the icon to force a style change when active */}
                  {React.cloneElement(item.icon, {
                    weight: isActive ? "fill" : "duotone",
                    className: isActive ? "text-slate-800" : "text-slate-600",
                  })}
                </div>

                <span
                  className={`
                  whitespace-nowrap font-bold text-[14px]
                  transition-all duration-200 ease-out
                  
                  ${isActive ? "text-slate-900" : "text-slate-700"}
                  w-0 opacity-0 md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-4
                  ${isOpen ? "w-auto opacity-100 ml-4" : ""}
                `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Trash Section */}
        <div className="mt-auto pt-2 mb-4 border-t-2 border-slate-200/60">
          <Link
            to="/trash"
            onClick={onClose}
            className={`
              relative flex items-center h-14 w-full transition-all duration-200 ease-out focus:outline-none
              rounded-r-[20px] cursor-pointer group/trash
              
              justify-center
              md:group-hover:justify-start md:group-hover:pl-5 md:group-hover:pr-4
              ${isOpen ? "justify-start pl-5 pr-4" : ""}
              
              ${isTrashActive ? "bg-rose-50/80 shadow-sm" : "hover:bg-rose-50"}
           `}
          >
            <div
              className={`
              shrink-0 flex items-center justify-center w-10 h-10 rounded-[14px] shadow-sm transition-all duration-200 border-2 border-b-4
              group-hover/trash:scale-105 group-active/trash:border-b-2 group-active/trash:translate-y-0.5
              ${
                isTrashActive
                  ? "bg-rose-100 border-rose-300 border-b-rose-400"
                  : "bg-rose-50 border-rose-200 border-b-rose-300"
              }
            `}
            >
              <Trash
                size={20}
                weight={isTrashActive ? "fill" : "duotone"}
                className={`${isTrashActive ? "text-rose-600" : "text-rose-500"} transition-colors`}
              />
            </div>

            <span
              className={`
                whitespace-nowrap font-bold text-[14px] 
                transition-all duration-200 ease-out
                
                ${isTrashActive ? "text-rose-600" : "text-slate-500 group-hover/trash:text-rose-600"}
                w-0 opacity-0 md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-4
                ${isOpen ? "w-auto opacity-100 ml-4" : ""}
              `}
            >
              Trash
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
};
