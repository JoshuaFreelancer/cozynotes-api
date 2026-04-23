import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { SignOut } from "@phosphor-icons/react";

const UserMenu = () => {
  const navigate = useNavigate();
  // Grabbing the user state to display the email and the logout function to clear the session
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    // First, I clean up the global state and local storage
    logout();

    // Then I bounce the user back to the login page
    navigate("/login");
  };

  // If there's no active session, I just don't render the menu at all
  if (!user) return null;

  // I'm pulling the first letter of the email to create a simple placeholder avatar
  const initial = user.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l-2 border-slate-200">
      {/* User badge - I'm hiding this on mobile so it doesn't clutter the header */}
      <div className="hidden sm:flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border-2 border-slate-200 shadow-sm cursor-default">
        <div className="w-6 h-6 rounded-md bg-[#F7F6F3] border-2 border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
          {initial}
        </div>
        <span className="text-sm text-slate-700 font-medium truncate max-w-37.5">
          {user.email}
        </span>
      </div>

      {/* Logout button using the same tactile 'cozy' styling I used for the sidebar trigger */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="p-1.5 md:p-2 rounded-xl bg-red-50 border-2 border-red-200 border-b-4 hover:-translate-y-0.5 hover:bg-red-100 hover:text-red-700 active:translate-y-0 active:border-b-2 transition-all text-red-500 focus:outline-none"
      >
        <SignOut size={20} weight="bold" />
      </button>
    </div>
  );
};

export default UserMenu;