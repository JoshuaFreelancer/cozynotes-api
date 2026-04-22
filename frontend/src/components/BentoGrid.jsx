import React, { useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PushPin, NoteBlank } from '@phosphor-icons/react';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from './NoteCard';

export const BentoGrid = () => {
  const [pinnedRef] = useAutoAnimate();
  const [othersRef] = useAutoAnimate();
  const { notes, setNotes } = useNoteStore();

  useEffect(() => {
    // I'm injecting mock data here to stress-test my layout.
    const mockNotes = [
      
      // My pinned notes
      // I must put my largest note (2x2) first to structure the grid correctly.
      { id: 3, title: 'Daily Journal Entry 📖', content: { date: '2026-04-22', mood: 'Very Productive' }, type: 'JOURNAL', colorTheme: 'lavender', isPinned: true },
      { id: 1, title: 'Project Roadmap 🚀', content: { body: 'Finish the Ensolvers challenge by Thursday. We must implement a robust backend with MariaDB, ensuring correct Sequelize model associations (Users <-> Notes), and then build a pixel-perfect React frontend following strict Bento UI principles with responsivity. Do not forget to integrate Zustan for global state, Axios for API calls, and auto-animate for smooth transitions. If time allows, we should add category filtering and an editing modal. Performance testing is crucial before final submission.' }, type: 'TEXT', colorTheme: 'sky', isPinned: true },
      
      // My unpinned notes
      { id: 2, title: 'Grocery List 🛒 (Weekend BBQ!)', content: { tasks: [
        { text: 'Oat milk (unsweetened)', done: false }, 
        { text: 'Avocados (ripe!)', done: true }, 
        { text: 'Coffee beans (medium roast)', done: false },
        { text: 'Burgers (wagyu if possible)', done: false },
        { text: 'Brioche buns', done: false },
        { text: 'Cheddar cheese slices', done: true },
        { text: 'Lettuce & Tomatoes', done: false },
        { text: 'Red Onion', done: false },
        { text: 'BBQ Sauce & Mustard', done: false },
        { text: 'Charcoal for grill', done: false },
        { text: 'Craft beers (pale ale)', done: false },
        { text: 'Limes for mezcal', done: true },
        { text: 'Paper plates & napkins', done: false },
        { text: 'Trash bags (heavy duty)', done: false },
        { text: 'Ice (2 bags)', done: false }
      ] }, type: 'TODO', colorTheme: 'mint', isPinned: false },
      
      { id: 4, title: 'Study: Human Heart ❤️ Anatomy & Function', content: { body: 'The heart is a complex, four-chambered muscular organ that pumps blood throughout the vascular system. The right side handles deoxygenated blood, sending it to the lungs via the pulmonary artery, while the left side receives oxygenated blood and pumps it out through the massive aorta. Its rhythmic contractions are governed by an intrinsic electrical system (SA node). If this fails, we can see arrhythmias or complete heart failure. The blood vessels itself are also crucial for maintaining correct blood pressure using the sympathetic and parasympathetic nervous systems.', imageUrl: 'true' }, type: 'MEDIA', colorTheme: 'peach', isPinned: false },
      
      { id: 5, title: 'Quick Idea: Mobile-First Dashboard Design 💡', content: { body: 'We need to build a UI centered around a strong Bento Grid architecture. This should replace traditional vertical feeds. Each piece of information acts as a discrete, actionable widget. It should feel like a hybrid between a physical inventory in an RPG and an iOS dashboard. Colors must remain Baby Pastels to maintain the cozy, hand-drawn vibe, perhaps with rough border effects to enhance the rustic feel. The layout should adapt intelligently from 1 column on mobile to 4 on desktop.' }, type: 'TEXT', colorTheme: 'yellow', isPinned: false },
      
      { id: 6, title: 'Aggressive Lorem Ipsum for Stress 💀', content: { body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }, type: 'TEXT', colorTheme: 'cream', isPinned: false },
    ];
    setNotes(mockNotes);
  }, [setNotes]);

  const pinnedNotes = notes.filter(note => note.isPinned);
  const otherNotes = notes.filter(note => !note.isPinned);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-10">
      
      {/* Pinned section */}
      {pinnedNotes.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 pl-2">
            {/* I'm using "duotone" here for a cute, two-tone sticker effect. */}
            <PushPin size={28} weight="duotone" className="text-slate-600" />
            <h2 className="font-display text-xl font-bold text-slate-700 tracking-wide">
              Pinned
            </h2>
          </div>
          <div 
            ref={pinnedRef} 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)] grid-flow-dense"
          >
            {pinnedNotes.map((note) => (
              <NoteCard key={`pinned-${note.id}`} note={note} />
            ))}
          </div>
        </section>
      )}

      {/* Others section */}
      {otherNotes.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 pl-2">
            <NoteBlank size={28} weight="duotone" className="text-slate-600" />
            <h2 className="font-display text-xl font-bold text-slate-700 tracking-wide">
              Others
            </h2>
          </div>
          <div 
            ref={othersRef} 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)] grid-flow-dense"
          >
            {otherNotes.map((note) => (
              <NoteCard key={`others-${note.id}`} note={note} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};