import React from "react";
import { useNoteStore } from "../store/useNoteStore";

const themeDictionary = {
  cream: "bg-bento-cream text-slate-800 border-[#EADDCE]",
  yellow: "bg-bento-yellow text-yellow-900 border-[#E8D174]",
  mint: "bg-bento-mint text-emerald-900 border-[#AEDBBA]",
  lavender: "bg-bento-lavender text-violet-900 border-[#C4B2E0]",
  peach: "bg-bento-peach text-rose-900 border-[#ECAFC0]",
  sky: "bg-bento-sky text-sky-900 border-[#A2CBE8]",
};

const sizeDictionary = {
  TEXT: "col-span-1 row-span-1",
  TODO: "col-span-1 row-span-2",
  JOURNAL: "col-span-1 lg:col-span-2 row-span-2",
  MEDIA: "col-span-1 lg:col-span-2 row-span-1",
};

const extractNodeText = (node) => {
  if (!node || typeof node !== "object") return "";

  if (typeof node.text === "string") {
    return `${node.text} `;
  }

  if (!Array.isArray(node.content)) return "";
  return node.content.map(extractNodeText).join(" ");
};

const extractTextFromContent = (content) => {
  if (!content) return "";

  if (content?.body) return content.body;
  if (Array.isArray(content?.tasks)) {
    return content.tasks.map((task) => task?.text || "").join(" ");
  }

  if (!Array.isArray(content?.content)) return "";
  return content.content.map(extractNodeText).join(" ").trim();
};

const extractTodoItems = (content) => {
  const items = [];

  const walk = (node) => {
    if (!node || typeof node !== "object") return;

    if (node.type === "taskItem") {
      const text = extractNodeText(node).trim();
      items.push({
        text,
        done: Boolean(node.attrs?.checked),
      });
      return;
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  };

  walk(content);
  return items;
};

// I added the isTrash prop to handle conditional interactivity
export const NoteCard = ({ note, isTrash = false }) => {
  const { openEditModal } = useNoteStore();

  const colorThemeClasses =
    themeDictionary[note.colorTheme] || themeDictionary.cream;
  const sizeClass = sizeDictionary[note.type] || sizeDictionary.TEXT;

  let parsedContent = {};
  try {
    parsedContent =
      typeof note.content === "string"
        ? JSON.parse(note.content)
        : note.content;
  } catch {
    console.error("Failed to parse note content");
  }

  const textPreview = extractTextFromContent(parsedContent);
  const todoItems = extractTodoItems(parsedContent);

  // If the note is in the trash, I strip away the hover effects and dull the colors slightly
  const interactiveClasses = isTrash
    ? "opacity-75 grayscale-[20%] cursor-default"
    : "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_12px_24px_-8px_rgba(0,0,0,0.15)]";

  return (
    <div
      onClick={() => {
        // I only trigger the edit modal if this card is NOT in the trash
        if (!isTrash) openEditModal(note);
      }}
      className={`
        p-5 flex flex-col gap-2 relative overflow-hidden group
        rounded-tl-3xl rounded-bl-3xl rounded-tr-[40px] rounded-br-3xl
        border-2 border-r-4 border-b-[6px]
        ${interactiveClasses}
        ${colorThemeClasses} ${sizeClass}
      `}
    >
      <h3 className="font-display font-bold text-lg leading-[1.2] pr-4 tracking-wide opacity-90 wrap-break-word text-slate-900">
        {note.title}
      </h3>

      <div className="flex-1 overflow-hidden mt-1 text-slate-800 relative z-10">
        {note.type === "TEXT" && (
          <p className="text-[14px] font-semibold opacity-80 line-clamp-8 leading-snug">
            {textPreview || "Empty note..."}
          </p>
        )}

        {note.type === "TODO" && (
          <ul className="text-[14px] font-semibold opacity-80 flex flex-col gap-2">
            {(todoItems.length > 0
              ? todoItems
              : parsedContent.tasks || []
            )
              .slice(0, 7)
              .map((task, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(task.done)}
                  readOnly
                  className="mt-1 w-4 h-4 rounded-full accent-slate-800 opacity-60 cursor-pointer shrink-0"
                />
                <span
                  className={
                    task.done
                      ? "line-through opacity-50"
                      : "leading-tight wrap-break-word"
                  }
                >
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        {note.type === "JOURNAL" && (
          <div className="h-full flex flex-col justify-between gap-3 pb-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
                ✨
              </span>
              <span className="font-display text-[12px] font-bold tracking-widest uppercase text-slate-700/60 text-right">
                {parsedContent.date || "Journal entry"}
              </span>
            </div>

            <p className="text-[14px] font-semibold opacity-80 line-clamp-5 leading-snug">
              {textPreview || "A quiet journal entry..."}
            </p>
          </div>
        )}

        {note.type === "MEDIA" && (
          <div className="flex flex-col gap-3 opacity-80 text-[14px] font-semibold h-full leading-snug justify-between">
            <p
              className={`${parsedContent.imageUrl ? "line-clamp-4" : "line-clamp-6"} leading-snug`}
            >
              {textPreview || "Media note..."}
            </p>
            {parsedContent.imageUrl && (
              <div className="w-full bg-black/5 rounded-xl flex items-center justify-center h-12 border border-black/5 shrink-0 mt-auto group-hover:bg-black/10 transition-colors">
                <span className="font-display text-[10px] tracking-widest uppercase opacity-60 flex items-center gap-2">
                  🖼️ Media
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {Array.isArray(note.tags) && note.tags.length > 0 && (
        <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={`${note.id}-${tag.id || tag.name}`}
              className="px-2 py-0.5 rounded-md bg-white/60 border border-black/10 text-[11px] font-semibold"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
