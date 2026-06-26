import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import BookCover from './components/BookCover';
import ChapterView from './components/ChapterView';
import AmbientSound from './components/AmbientSound';
import { CHAPTERS } from './data';
import { Chapter } from './types';

export default function App() {
  const [isBookOpened, setIsBookOpened] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState('varun');

  // Find the active chapter object
  const activeChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];

  // Try to preserve book open state and active chapter during refreshes
  useEffect(() => {
    const savedOpened = sessionStorage.getItem('lab_memories_book_opened');
    if (savedOpened === 'true') {
      setIsBookOpened(true);
    }
    const savedChapter = sessionStorage.getItem('lab_memories_active_chapter');
    if (savedChapter) {
      setActiveChapterId(savedChapter);
    }
  }, []);

  const handleOpenBook = () => {
    setIsBookOpened(true);
    sessionStorage.setItem('lab_memories_book_opened', 'true');
  };

  const handleCloseBook = () => {
    setIsBookOpened(false);
    sessionStorage.setItem('lab_memories_book_opened', 'false');
  };

  const handleSelectChapter = (id: string) => {
    setActiveChapterId(id);
    sessionStorage.setItem('lab_memories_active_chapter', id);
  };

  // Provide an intuitive master reset button for presentation
  const handleResetApp = () => {
    if (confirm('Would you like to reset all of your uploaded photos and memory notes? This will restore the default template.')) {
      localStorage.removeItem('lab_memories_photos_v1');
      localStorage.removeItem('lab_memories_user_notes_v1');
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7f4ef] select-none text-[#2d2d2d] font-sans overflow-x-hidden antialiased selection:bg-[#ffeaeb] selection:text-[#b5838d]">
      
      {/* Dynamic Background Noise Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[radial-gradient(#2d2d2d_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Main Container */}
      <main className="relative min-h-screen z-20">
        <AnimatePresence mode="wait">
          {!isBookOpened ? (
            <motion.div
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <BookCover onOpen={handleOpenBook} />
            </motion.div>
          ) : (
            <motion.div
              key="book"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Back to cover Floating Button */}
              <div id="top-floating-actions" className="fixed top-4 right-4 z-40 flex items-center gap-2">
                <button
                  id="btn-back-to-cover"
                  onClick={handleCloseBook}
                  className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md border border-[#e5e5e0] rounded-full text-xs font-mono text-[#6d6875] hover:text-[#4a4e40] hover:border-[#b5838d]/40 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer uppercase tracking-wider font-bold"
                  title="Return to Cover Page"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cover Page</span>
                </button>

                <button
                  id="btn-app-reset"
                  onClick={handleResetApp}
                  className="p-1.5 bg-white/95 backdrop-blur-md border border-[#e5e5e0] rounded-full text-xs font-mono text-[#6d6875] hover:text-[#b5838d] hover:border-[#b5838d]/30 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Reset Digital Album (Restore defaults)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Chapter Viewer */}
              <ChapterView 
                activeChapter={activeChapter} 
                onSelectChapter={handleSelectChapter}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Nostalgic Ambient Audio Synthesizer */}
      <AmbientSound />
    </div>
  );
}
