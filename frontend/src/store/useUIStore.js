import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarOpen: false,
  // I toggle the state for the hamburger button
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  // I force close it for when the user clicks the overlay
  closeSidebar: () => set({ isSidebarOpen: false }),
}));