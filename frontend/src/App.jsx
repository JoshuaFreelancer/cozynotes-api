import React from "react";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    /* I'm using a strictly full-width wrapper to ensure my layout hits the screen edges */
    <div className="w-full min-h-screen">
      <Dashboard />
    </div>
  );
}

export default App;