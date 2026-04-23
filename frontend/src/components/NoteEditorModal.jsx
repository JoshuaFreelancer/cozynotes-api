import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
// 1. Importamos las extensiones para las casillas de verificación
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

// Añadimos las listas de tareas a la configuración de Tiptap
const TIPTAP_EXTENSIONS = [
  StarterKit,
  Underline,
  TaskList,
  TaskItem.configure({ nested: true }),
  Placeholder.configure({
    placeholder: "What’s on your mind?...",
  }),
];

// --- EL TRADUCTOR DE DATOS LEGACY ---
// Esta función lee el JSON viejo de la base de datos y lo convierte en algo que Tiptap entienda
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

  // Si ya es un documento válido de Tiptap, lo devolvemos tal cual
  if (parsed?.type === "doc") return parsed;

  // Si es el formato viejo {"body": "..."} o {"prueba"}
  if (parsed?.body) return `<p>${parsed.body}</p>`;

  // Si es el formato viejo de listas {"tasks": [...]} lo convertimos a HTML de Tiptap
  if (parsed?.tasks && Array.isArray(parsed.tasks)) {
    let html = '<ul data-type="taskList">';
    parsed.tasks.forEach((t) => {
      html += `<li data-type="taskItem" data-checked="${t.done}"><p>${t.text}</p></li>`;
    });
    html += "</ul>";
    return html;
  }

  // Fallback de seguridad
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
  const [activeMenu, setActiveMenu] = useState(null);

  const editor = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    // Pasamos el contenido por nuestro traductor antes de dárselo a Tiptap
    content: normalizeContentForTiptap(currentNoteToEdit?.content),
    editorProps: {
      attributes: {
        class:
          "w-full flex-1 md:flex-none md:min-h-[250px] bg-transparent text-base md:text-lg text-slate-800 focus:outline-none px-0 prose max-w-none whitespace-pre-wrap outline-none",
      },
    },
  });

  const hasContent = title.trim().length > 0 || (editor && !editor.isEmpty);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!hasContent) return;

    const payload = {
      title,
      content: editor.getJSON(),
      type: selectedNoteType.toUpperCase(),
      isPinned,
      colorTheme,
    };

    let success = false;
    if (modalMode === "create") {
      success = await createNote(payload);
    } else if (modalMode === "edit") {
      success = await updateNote(currentNoteToEdit.id, payload);
    }

    if (success) closeModal();
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDelete = async () => {
    if (!currentNoteToEdit?.id) return; // Por si acaso le dan click al crear una nueva

    // Podrías añadir un window.confirm("¿Seguro?") aquí si lo deseas en el futuro
    await deleteNote(currentNoteToEdit.id);
    // El closeModal ya se ejecuta en el store si el delete es exitoso
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
              {/* Conectamos el botón de eliminar al handler de borrado */}
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-3 px-4 py-3 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors text-left w-full text-sm font-semibold border-b border-slate-700"
              >
                <Trash size={18} /> Eliminar la nota
              </button>

              {/* Las otras opciones se mantienen visualmente pero inactivas por ahora */}
              <button
                type="button"
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
              <ToolButton icon={Archive} title="Archive" onClick={() => {}} />
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
