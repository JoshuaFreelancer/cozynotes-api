import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { NoteEditorModal } from "../components/NoteEditorModal";
import { useUIStore } from "../store/useUIStore";

export const MainLayout = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <div className="flex flex-1 w-full">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {/* Outlet automatically injects the Dashboard or TrashPage here based on the URL */}
          <Outlet />
        </main>
      </div>

      {/* Global tools that should be accessible from any layout-wrapped page */}
      <FloatingActionButton />
      <NoteEditorModal />
    </div>
  );
};
