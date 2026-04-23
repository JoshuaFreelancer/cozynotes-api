import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import {
  ArrowLeft,
  PushPin,
  FloppyDisk,
  TextAa,
  Palette,
  Image as ImageIcon,
  Archive,
  DotsThreeVertical,
  ArrowUUpLeft,
  ArrowUUpRight,
  TextHOne,
  TextHTwo,
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  Trash,
  Tag,
  PencilLine,
  Copy,
} from "@phosphor-icons/react";
import { useNoteStore } from "../store/useNoteStore";

const ToolButton = ({ icon, title, onClick, disabled, isActive }) => {
  const IconComponent = icon;
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      disabled={disabled}
      className={`p-2 rounded-full transition-colors focus:outline-none shrink-0 
        ${disabled ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}
        ${isActive ? "bg-slate-200 text-slate-800" : ""}
      `}
    >
      <IconComponent size={20} weight={isActive ? "fill" : "bold"} />
    </button>
  );
};

const BENTO_COLORS = [
  { id: "cream", var: "var(--color-bento-cream)" },
  { id: "yellow", var: "var(--color-bento-yellow)" },
  { id: "mint", var: "var(--color-bento-mint)" },
  { id: "lavender", var: "var(--color-bento-lavender)" },
  { id: "peach", var: "var(--color-bento-peach)" },
  { id: "sky", var: "var(--color-bento-sky)" },
];

// Tiptap configuration
const TIPTAP_EXTENSIONS = [
  StarterKit,
  Underline,
  TaskList,
  TaskItem.configure({ nested: true }),
  Placeholder.configure({
    placeholder: "What’s on your mind?...",
  }),
];

// --- TRADUCTOR LEGACY ---
// This function reads the old JSON from the database and converts it into a format that Tiptap can understand
const normalizeContentForTiptap = (rawContent) => {
  if (!rawContent) return "";

  let parsed = rawContent;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return parsed;
    }
  }

  // If it is already a valid Tiptap document, we return it as is
  if (parsed?.type === "doc") return parsed;

  // If it's the old format {“body”: “...”} or {“test”}
  if (parsed?.body) return `<p>${parsed.body}</p>`;

  // Support for old journal or media entries saved as flat objects
  if (parsed?.date || parsed?.mood || parsed?.imageUrl) {
    const parts = [];

    if (parsed?.date) {
      parts.push(`<p><strong>Date:</strong> ${parsed.date}</p>`);
    }

    if (parsed?.mood) {
      parts.push(`<p><strong>Mood:</strong> ${parsed.mood}</p>`);
    }

    if (parsed?.body) {
      parts.push(`<p>${parsed.body}</p>`);
    }

    if (parsed?.imageUrl) {
      parts.push(`<p>${parsed.imageUrl}</p>`);
    }

    return parts.join("") || "<p></p>";
  }

  // If it's the old list format {“tasks”: [...]}, we'll convert it to Tiptap HTML
  if (parsed?.tasks && Array.isArray(parsed.tasks)) {
    let html = '<ul data-type="taskList">';
    parsed.tasks.forEach((t) => {
      html += `<li data-type="taskItem" data-checked="${t.done}"><p>${t.text}</p></li>`;
    });
    html += "</ul>";
    return html;
  }

  // Security Fallback
  return typeof parsed === "object" ? JSON.stringify(parsed) : String(parsed);
};

const EditorInner = () => {
  const {
    closeModal,
    selectedNoteType,
    isLoading,
    modalMode,
    currentNoteToEdit,
    createNote,
    updateNote,
    deleteNote,
  } = useNoteStore();

  const [title, setTitle] = useState(currentNoteToEdit?.title || "");
  const [isPinned, setIsPinned] = useState(
    currentNoteToEdit?.isPinned || false,
  );
  const [colorTheme, setColorTheme] = useState(
    currentNoteToEdit?.colorTheme || "cream",
  );
  const [isArchived] = useState(currentNoteToEdit?.isArchived || false);
  const [tags, setTags] = useState(
    Array.isArray(currentNoteToEdit?.tags)
      ? currentNoteToEdit.tags.map((tag) => tag.name)
      : [],
  );
  const [tagInput, setTagInput] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const editor = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    // We run the content through our translator before passing it to Tiptap
    content: normalizeContentForTiptap(currentNoteToEdit?.content),
    editorProps: {
      attributes: {
        class:
          "w-full flex-1 md:flex-none md:min-h-[250px] bg-transparent text-base md:text-lg text-slate-800 focus:outline-none px-0 prose max-w-none whitespace-pre-wrap outline-none",
      },
    },
  });

  const hasContent = title.trim().length > 0 || (editor && !editor.isEmpty);

  const persistNote = async (overrides = {}) => {
    if (!hasContent) return false;

    const payload = {
      title,
      content: editor.getJSON(),
      type: selectedNoteType.toUpperCase(),
      isPinned,
      isArchived,
      colorTheme,
      tags,
      ...overrides,
    };

    let success = false;
    if (modalMode === "create") {
      success = await createNote(payload);
    } else if (modalMode === "edit") {
      success = await updateNote(currentNoteToEdit.id, payload);
    }

    if (success) closeModal();
    return success;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const success = await persistNote();
    if (success) closeModal();
  };

  const handleArchiveNow = async () => {
    const nextArchivedState = !isArchived;
    const success = await persistNote({ isArchived: nextArchivedState });
    if (success) closeModal();
  };

  // --- ELIMINATION LOGIC ---
  const handleDelete = async () => {
    if (!currentNoteToEdit?.id) return; // Just in case you click it when creating a new one

    await deleteNote(currentNoteToEdit.id);
    // closeModal is already executed in the store if the delete operation is successful
  };

  const handleSmartClose = async () => {
    if (hasContent) {
      await handleSave();
    } else {
      closeModal();
    }
  };

  const toggleMenu = (menuName) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleAddTag = () => {
    const cleanTag = tagInput.trim().toLowerCase();
    if (!cleanTag || tags.includes(cleanTag)) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, cleanTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagName) => {
    setTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center md:p-4 bg-slate-900/40 animate-in fade-in duration-200">
      <div
        className="w-full h-full md:h-auto md:max-w-2xl md:rounded-3xl border-0 md:border-2 border-slate-200 md:shadow-xl flex flex-col animate-in md:zoom-in-95 slide-in-from-bottom-4 md:slide-in-from-bottom-0 duration-200 transition-colors"
        style={{
          backgroundColor:
            BENTO_COLORS.find((c) => c.id === colorTheme)?.var ||
            "var(--color-bento-cream)",
        }}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b-2 border-slate-200/50">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSmartClose}
              className="md:hidden p-1.5 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/50 transition-colors focus:outline-none"
            >
              <ArrowLeft size={24} weight="bold" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 capitalize hidden md:block">
              {modalMode === "create"
                ? `New ${selectedNoteType} Note`
                : "Edit Note"}
            </h2>
          </div>

          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-2 rounded-xl transition-colors focus:outline-none ${isPinned ? "text-slate-800 bg-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
          >
            <PushPin size={24} weight={isPinned ? "fill" : "bold"} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex flex-col flex-1 p-4 md:p-6 overflow-hidden relative">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-xl md:text-2xl font-bold text-slate-800 placeholder-slate-500/70 border-none focus:outline-none focus:ring-0 px-0 mb-4"
            autoFocus={modalMode === "create"}
          />

          <div
            className="flex-1 overflow-y-auto cursor-text ProseMirror-editor-parent"
            onClick={() => editor?.chain().focus().run()}
          >
            <EditorContent editor={editor} />
          </div>

          {/* Format Popover */}
          {activeMenu === "format" && editor && (
            <div className="absolute bottom-17.5 left-4 bg-slate-800 text-white p-2 rounded-2xl shadow-xl flex items-center gap-1 animate-in slide-in-from-bottom-2 duration-200 z-10">
              <ToolButton
                icon={TextHOne}
                title="Heading 1"
                isActive={editor.isActive("heading", { level: 1 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              />
              <ToolButton
                icon={TextHTwo}
                title="Heading 2"
                isActive={editor.isActive("heading", { level: 2 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              />
              <ToolButton
                icon={TextAa}
                title="Normal text"
                isActive={editor.isActive("paragraph")}
                onClick={() => editor.chain().focus().setParagraph().run()}
              />
              <div className="w-px h-5 bg-slate-600 mx-1"></div>
              <ToolButton
                icon={TextB}
                title="Bold"
                isActive={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
              <ToolButton
                icon={TextItalic}
                title="Italic"
                isActive={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
              <ToolButton
                icon={TextUnderline}
                title="Underline"
                isActive={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
              <ToolButton
                icon={TextStrikethrough}
                title="Clear format"
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
              />
            </div>
          )}

          {/* Color Popover */}
          {activeMenu === "color" && (
            <div className="absolute bottom-17.5 left-12 bg-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200 z-10">
              {BENTO_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setColorTheme(color.id)}
                  style={{ backgroundColor: color.var }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${colorTheme === color.id ? "border-white scale-110 shadow-sm" : "border-slate-600"}`}
                />
              ))}
            </div>
          )}

          {/* More Options Popover */}
          {activeMenu === "more" && (
            <div className="absolute bottom-17.5 left-32.5 md:left-40 w-56 bg-slate-800 text-slate-200 py-2 rounded-2xl shadow-xl flex flex-col animate-in slide-in-from-bottom-2 duration-200 z-10 overflow-hidden">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-3 px-4 py-3 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors text-left w-full text-sm font-semibold border-b border-slate-700"
              >
                <Trash size={18} /> Eliminar la nota
              </button>

              {/* The other options remain visible but are currently inactive */}
              <button
                type="button"
                onClick={() => toggleMenu("tags")}
                className="flex items-center gap-3 px-4 py-2 mt-1 hover:bg-slate-700 transition-colors text-left w-full text-sm"
              >
                <Tag size={18} /> Añadir etiqueta
              </button>
              <button
                type="button"
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 transition-colors text-left w-full text-sm"
              >
                <PencilLine size={18} /> Añadir dibujo
              </button>
              <button
                type="button"
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 transition-colors text-left w-full text-sm"
              >
                <Copy size={18} /> Crear una copia
              </button>
            </div>
          )}

          {activeMenu === "tags" && (
            <div className="absolute bottom-17.5 left-32.5 md:left-40 w-72 bg-slate-800 text-slate-100 p-3 rounded-2xl shadow-xl flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-200 z-10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Etiqueta..."
                  className="flex-1 h-9 px-3 rounded-xl bg-slate-700 text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 h-9 rounded-xl bg-bento-sky text-slate-900 font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                {tags.length > 0 ? (
                  tags.map((tagName) => (
                    <button
                      key={tagName}
                      type="button"
                      onClick={() => handleRemoveTag(tagName)}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 text-xs font-semibold hover:bg-rose-500 hover:text-white"
                      title="Eliminar etiqueta"
                    >
                      #{tagName}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Sin etiquetas.</p>
                )}
              </div>
            </div>
          )}

          {/* TOOLBAR FOOTER */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t-2 border-slate-200/50 z-0">
            <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto no-scrollbar scroll-smooth">
              <ToolButton
                icon={TextAa}
                title="Formatting options"
                isActive={activeMenu === "format"}
                onClick={() => toggleMenu("format")}
              />
              <ToolButton
                icon={Palette}
                title="Background color"
                isActive={activeMenu === "color"}
                onClick={() => toggleMenu("color")}
              />
              <ToolButton icon={ImageIcon} title="Add image" disabled={true} />
              <ToolButton
                icon={Archive}
                title={isArchived ? "Unarchive" : "Archive"}
                isActive={isArchived}
                onClick={handleArchiveNow}
              />
              <ToolButton
                icon={DotsThreeVertical}
                title="More options"
                isActive={activeMenu === "more"}
                onClick={() => toggleMenu("more")}
              />

              <div className="hidden sm:block w-px h-5 bg-slate-300 mx-1"></div>

              <ToolButton
                icon={ArrowUUpLeft}
                title="Undo"
                disabled={!editor?.can().undo()}
                onClick={() => editor?.chain().focus().undo().run()}
              />
              <ToolButton
                icon={ArrowUUpRight}
                title="Redo"
                disabled={!editor?.can().redo()}
                onClick={() => editor?.chain().focus().redo().run()}
              />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading || !hasContent}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 text-white text-sm font-bold border-2 border-slate-800 border-b-4 hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FloppyDisk size={18} weight="bold" />
                {isLoading
                  ? "Saving..."
                  : modalMode === "create"
                    ? "Save"
                    : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NoteEditorModal = () => {
  const { isModalOpen, currentNoteToEdit } = useNoteStore();
  if (!isModalOpen) return null;
  return <EditorInner key={currentNoteToEdit?.id || "new-note"} />;
};
