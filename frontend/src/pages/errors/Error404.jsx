import React from "react";
import { useNavigate } from "react-router-dom";
import { Ghost, ArrowLeft } from "@phosphor-icons/react";

export const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F6F3] p-6">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        {/* I'm using the Bento Yellow theme to signify a warning/empty state */}
        <div className="w-32 h-32 bg-bento-yellow border-2 border-[#E8D174] border-b-8 rounded-4xl flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
          <Ghost size={64} weight="duotone" className="text-yellow-900" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-7xl font-bold text-slate-800 tracking-tighter">
            404
          </h1>
          <h2 className="font-display text-2xl font-bold text-slate-700">
            Lost in the Void
          </h2>
          <p className="font-body text-slate-500 font-semibold px-4">
            The page or note you are looking for doesn't exist in this timeline.
            It might have been deleted, or the URL is incorrect.
          </p>
        </div>

        {/* Primary action to escape the error state */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 border-2 border-slate-800 border-b-4 hover:-translate-y-1 active:translate-y-0 active:border-b-2 transition-all"
        >
          <ArrowLeft size={20} weight="bold" />
          Return to Workspace
        </button>
      </div>
    </div>
  );
};
