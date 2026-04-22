import React from 'react';
import { Toaster } from 'sileo';
import { BentoGrid } from './components/BentoGrid';

function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 font-sans selection:bg-rose-200">
      <Toaster position="bottom-right" />
      
      <main className="py-4 md:py-8">
        <BentoGrid />
      </main>
    </div>
  );
}

export default App;