import { sileo } from "sileo";

const baseStyles = {
  title: "font-semibold text-slate-900",
  description: "text-slate-600",
  badge: "text-slate-900",
  button: "text-slate-900 font-semibold",
};

const toastPresets = {
  create: {
    title: "Note created",
    type: "success",
    styles: {
      ...baseStyles,
      title: "font-semibold text-emerald-950",
      description: "text-emerald-900/80",
    },
  },
  update: {
    title: "Note updated",
    type: "info",
    styles: {
      ...baseStyles,
      title: "font-semibold text-sky-950",
      description: "text-sky-900/80",
    },
  },
  archive: {
    title: "Note archived",
    type: "warning",
    styles: {
      ...baseStyles,
      title: "font-semibold text-violet-950",
      description: "text-violet-900/80",
    },
  },
  unarchive: {
    title: "Note restored to active",
    type: "success",
    styles: {
      ...baseStyles,
      title: "font-semibold text-emerald-950",
      description: "text-emerald-900/80",
    },
  },
  trashMove: {
    title: "Note moved to trash",
    type: "warning",
    styles: {
      ...baseStyles,
      title: "font-semibold text-amber-950",
      description: "text-amber-900/80",
    },
  },
  restore: {
    title: "Note restored",
    type: "success",
    styles: {
      ...baseStyles,
      title: "font-semibold text-emerald-950",
      description: "text-emerald-900/80",
    },
  },
  destroy: {
    title: "Note permanently deleted",
    type: "error",
    styles: {
      ...baseStyles,
      title: "font-semibold text-rose-950",
      description: "text-rose-900/80",
    },
  },
  trash: {
    title: "Trash emptied",
    type: "warning",
    styles: {
      ...baseStyles,
      title: "font-semibold text-amber-950",
      description: "text-amber-900/80",
    },
  },
  login: {
    title: "Welcome back",
    type: "success",
    styles: {
      ...baseStyles,
      title: "font-semibold text-emerald-950",
      description: "text-emerald-900/80",
    },
  },
  register: {
    title: "Account created",
    type: "success",
    styles: {
      ...baseStyles,
      title: "font-semibold text-violet-950",
      description: "text-violet-900/80",
    },
  },
  logout: {
    title: "Signed out",
    type: "info",
    styles: {
      ...baseStyles,
      title: "font-semibold text-slate-950",
      description: "text-slate-800/80",
    },
  },
  tagCreate: {
    title: "Tag created",
    type: "action",
    styles: {
      ...baseStyles,
      title: "font-semibold text-sky-950",
      description: "text-sky-900/80",
    },
  },
  tagAdd: {
    title: "Tag added",
    type: "action",
    styles: {
      ...baseStyles,
      title: "font-semibold text-sky-950",
      description: "text-sky-900/80",
    },
  },
  tagRemove: {
    title: "Tag removed",
    type: "info",
    styles: {
      ...baseStyles,
      title: "font-semibold text-slate-950",
      description: "text-slate-800/80",
    },
  },
  error: {
    title: "Something went wrong",
    type: "error",
    styles: {
      ...baseStyles,
      title: "font-semibold text-rose-950",
      description: "text-rose-900/80",
    },
  },
};

const defaultDescription = {
  create: (payload) => payload?.title || "Your note was saved successfully.",
  update: (payload) => {
    if (payload?.isPinned && payload?.isArchived)
      return "Pinned note saved and archived.";
    if (payload?.isPinned) return "Your pinned note was updated successfully.";
    if (payload?.isArchived) return "Your note was archived.";
    return "Your note was updated successfully.";
  },
  archive: () => "You can unarchive it later from Archived Notes.",
  unarchive: () => "It returned to your active notes.",
  trashMove: () => "You can restore it later from Trash.",
  restore: () => "It is back in All Notes.",
  destroy: () => "This action cannot be undone.",
  trash: () => "All trashed notes were removed permanently.",
  login: () => "Session ready.",
  register: () => "You are now signed in.",
  logout: () => "Session cleared.",
  tagCreate: (payload) => `#${payload?.name}`,
  tagAdd: (payload) => `#${payload?.name} linked to note.`,
  tagRemove: (payload) => `#${payload?.name} removed from note.`,
  error: (payload) => payload?.message || "Please try again.",
};

export const showActionToast = (key, payload = {}, overrides = {}) => {
  const preset = toastPresets[key] || toastPresets.error;
  const description =
    overrides.description ??
    (typeof defaultDescription[key] === "function"
      ? defaultDescription[key](payload)
      : defaultDescription.error(payload));

  return sileo[preset.type]({
    title: overrides.title ?? preset.title,
    description,
    position: overrides.position ?? "bottom-center",
    duration: overrides.duration ?? 4200,
    roundness: overrides.roundness ?? 18,
    styles: {
      ...baseStyles,
      ...preset.styles,
      ...(overrides.styles || {}),
    },
    button: overrides.button,
  });
};

export const showErrorToast = (message, title = "Something went wrong") => {
  return sileo.error({
    title,
    description: message,
    position: "bottom-center",
    duration: 4000,
    roundness: 18,
    styles: {
      ...baseStyles,
      ...toastPresets.error.styles,
    },
  });
};
