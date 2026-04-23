import React from "react";
import { useNavigate } from "react-router-dom";
import { LockKey, KeyReturn } from "@phosphor-icons/react";

export const Error403 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F6F3] p-6">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        {/* I chose the Lavender theme for security/auth states */}
        <div className="w-32 h-32 bg-bento-lavender border-2 border-[#C4B2E0] border-b-8 rounded-4xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <LockKey size={64} weight="duotone" className="text-violet-900" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-7xl font-bold text-slate-800 tracking-tighter">
            401
          </h1>
          <h2 className="font-display text-2xl font-bold text-slate-700">
            Access Restricted
          </h2>
          <p className="font-body text-slate-500 font-semibold px-4">
            You don't have the required permissions to view this sector. Please
            provide valid credentials to proceed.
          </p>
        </div>

        {/* This will route to the login page we build next */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-8 py-3 bg-violet-600 text-white font-bold rounded-xl flex items-center gap-2 border-2 border-violet-800 border-b-4 hover:-translate-y-1 active:translate-y-0 active:border-b-2 transition-all"
        >
          <KeyReturn size={20} weight="bold" />
          Go to Login
        </button>
      </div>
    </div>
  );
};
