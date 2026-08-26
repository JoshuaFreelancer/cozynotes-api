import React from "react";
import { useNavigate } from "react-router-dom";
import { WarningOctagon, ArrowsClockwise } from "@phosphor-icons/react";

export const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F6F3] p-6">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        {/* I use a harsh Peach/Rose theme to indicate a critical system failure */}
        <div className="w-32 h-32 bg-bento-peach border-2 border-[#DBA19C] border-b-8 rounded-4xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          <WarningOctagon
            size={64}
            weight="duotone"
            className="text-rose-900"
          />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-7xl font-bold text-slate-800 tracking-tighter">
            500
          </h1>
          <h2 className="font-display text-2xl font-bold text-slate-700">
            System Overload
          </h2>
          <p className="font-body text-slate-500 font-semibold px-4">
            Our backend servers are currently experiencing a critical failure.
            The engineering team has been notified.
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl flex items-center gap-2 border-2 border-slate-200 border-b-4 hover:-translate-y-1 active:translate-y-0 active:border-b-2 transition-all"
          >
            <ArrowsClockwise size={20} weight="bold" />
            Retry
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 border-2 border-slate-800 border-b-4 hover:-translate-y-1 active:translate-y-0 active:border-b-2 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};
