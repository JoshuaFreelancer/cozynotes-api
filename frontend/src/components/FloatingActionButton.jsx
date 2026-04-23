import React, { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Plus,
  X,
  TextAlignLeft,
  CheckSquare,
  Calendar,
  Image,
} from "@phosphor-icons/react";
import { useNoteStore } from "../store/useNoteStore";

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [parent] = useAutoAnimate();

  // I'm pulling the action to open the modal from my global store
  const { openCreateModal } = useNoteStore();

  const actions = [
    {
      id: "text",
      label: "Text Note",
      icon: (
        <TextAlignLeft size={20} weight="duotone" className="md:w-6 md:h-6" />
      ),
      color: "bg-bento-sky border-[#9ABED7]",
    },
    {
      id: "todo",
      label: "Task List",
      icon: (
        <CheckSquare size={20} weight="duotone" className="md:w-6 md:h-6" />
      ),
      color: "bg-bento-mint border-[#8DCAC0]",
    },
    {
      id: "journal",
      label: "Journal Entry",
      icon: <Calendar size={20} weight="duotone" className="md:w-6 md:h-6" />,
      color: "bg-bento-lavender border-[#B89CC4]",
    },
    {
      id: "media",
      label: "Media Note",
      icon: <Image size={20} weight="duotone" className="md:w-6 md:h-6" />,
      color: "bg-bento-peach border-[#DBA19C]",
    },
  ];

  const handleActionClick = (type) => {
    // I trigger the global modal with the selected type, then close the FAB menu
    openCreateModal(type);
    setIsOpen(false);
  };

  return (
    <div
      ref={parent}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col-reverse items-end gap-3 md:gap-4 z-50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full shadow-lg bg-slate-800 text-white border-2 border-slate-800 border-b-[6px] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:border-b-2 ${isOpen ? "bg-rose-500 border-rose-600" : ""}`}
      >
        {isOpen ? (
          <X
            size={24}
            weight="bold"
            className="animate-in fade-in zoom-in duration-200"
          />
        ) : (
          <Plus
            size={24}
            weight="bold"
            className="animate-in fade-in zoom-in duration-300"
          />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col-reverse gap-3 items-end mb-2">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center gap-3 group animate-in slide-in-from-bottom-4 duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="hidden sm:block bg-white px-3 py-1.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-xs md:text-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-default">
                {action.label}
              </span>

              <button
                // Connecting the click handler here
                onClick={() => handleActionClick(action.id)}
                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-[14px] md:rounded-2xl border-2 border-b-4 shadow-sm transition-all hover:-translate-x-1 hover:scale-110 active:translate-y-0 active:border-b-2 ${action.color}`}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
