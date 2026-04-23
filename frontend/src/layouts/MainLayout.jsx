import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { useUIStore } from "../store/useUIStore";

export const MainLayout = ({ children }) => {
  // I subscribe to the UI store to get the sidebar's current state and close action
  const { isSidebarOpen, closeSidebar } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <div className="flex flex-1 w-full">
        
        {/* I pass the global state and the close function down to the Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
        
      </div>
      
      <FloatingActionButton />
    </div>
  );
};