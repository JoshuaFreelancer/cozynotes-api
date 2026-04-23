import { create } from "zustand";
import { api } from "../services/axios";
import { showActionToast, showErrorToast } from "../utils/sileoToasts";

export const useAuthStore = create((set) => ({
  // I also pull the user from localStorage so the UI (like the Header menu)
  // doesn't break or disappear after a page reload.
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Saving both the token and the user footprint to survive page reloads
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoading: false });
      showActionToast("login", { name: data.user?.email });
      return true;
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Login failed",
        "Login failed",
      );
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/register", { name, email, password });
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoading: false });
      showActionToast("register", { name: data.user?.email });
      return true;
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Registration failed",
        "Registration failed",
      );
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    // A complete clean-up of local storage and state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
    showActionToast("logout");
  },
}));
