import React from "react";
// Importing the Toaster container and the sileo trigger function
import { Toaster, sileo } from "sileo";

function App() {
  // A quick test function to see Sileo in action
  const triggerTestToast = () => {
    sileo.success("Note saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] text-slate-800 flex flex-col items-center justify-center gap-6">
      {/* Sileo Toaster placed at the top level of the app */}
      <Toaster position="bottom-right" />

      <h1 className="text-3xl font-bold tracking-tight">
        Cozy Notes Frontend is alive
      </h1>

      <button
        onClick={triggerTestToast}
        className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-md active:scale-95"
      >
        Test Sileo Toast
      </button>
    </div>
  );
}

export default App;
