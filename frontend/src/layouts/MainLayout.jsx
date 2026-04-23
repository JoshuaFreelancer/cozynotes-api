import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { NoteEditorModal } from "../components/NoteEditorModal";
import { EditTagsModal } from "../components/EditTagsModal";
import { useUIStore } from "../store/useUIStore";

export const MainLayout = () => {
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const isTrashView = location.pathname === "/trash";

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
      {!isTrashView && <FloatingActionButton />}
      <NoteEditorModal />
      <EditTagsModal />
    </div>
  );
};
