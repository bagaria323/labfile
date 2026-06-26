import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Camera, Image as ImageIcon, Plus, X, Calendar, 
  User, MessageSquare, ChevronLeft, ChevronRight, Award, Trash2, Maximize2
} from 'lucide-react';
import { Chapter, MemoryNote, UserPhoto } from '../types';
import { CHAPTERS, DEFAULT_MEMORIES, NOSTALGIC_QUOTES } from '../data';

interface ChapterViewProps {
  activeChapter: Chapter;
  onSelectChapter: (chapterId: string) => void;
}

export default function ChapterView({ activeChapter, onSelectChapter }: ChapterViewProps) {
  const [photos, setPhotos] = useState<{ [id: string]: string }>({});
  const [memories, setMemories] = useState<MemoryNote[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string; url: string; index: number } | null>(null);
  
  // Note formulation states
  const [authorName, setAuthorName] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteColor, setNoteColor] = useState<'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple'>('yellow');
  const [failedDefaultPhotos, setFailedDefaultPhotos] = useState<{ [id: string]: boolean }>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  // Load photos and memories from localStorage or default
  useEffect(() => {
    const savedPhotos = localStorage.getItem('lab_memories_photos_v1');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }

    const savedMemories = localStorage.getItem('lab_memories_user_notes_v1');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    } else {
      setMemories(DEFAULT_MEMORIES);
    }
  }, []);

  const savePhotosToStorage = (updatedPhotos: { [id: string]: string }) => {
    localStorage.setItem('lab_memories_photos_v1', JSON.stringify(updatedPhotos));
    setPhotos(updatedPhotos);
  };

  const saveMemoriesToStorage = (updatedMemories: MemoryNote[]) => {
    localStorage.setItem('lab_memories_user_notes_v1', JSON.stringify(updatedMemories));
    setMemories(updatedMemories);
  };

  // Compress and save uploaded photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to downscale and compress photo to 500px width max
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // High compression ratio for small footprint in localStorage (30-50KB)
          const base64Data = canvas.toDataURL('image/jpeg', 0.65);
          const updated = { ...photos, [slotId]: base64Data };
          savePhotosToStorage(updated);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    setUploadTargetId(null);
  };

  const triggerUpload = (slotId: string) => {
    setUploadTargetId(slotId);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const removePhoto = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...photos };
    delete updated[slotId];
    savePhotosToStorage(updated);
  };

  // Submit dynamic message note
  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !noteText.trim()) return;

    const newNote: MemoryNote = {
      id: `user-note-${Date.now()}`,
      chapterId: activeChapter.id,
      author: authorName.trim(),
      text: noteText.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      color: noteColor,
      rotation: Math.floor(Math.random() * 7) - 3, // random rotation from -3deg to 3deg
    };

    const updated = [newNote, ...memories];
    saveMemoriesToStorage(updated);
    setNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = memories.filter(m => m.id !== noteId);
    saveMemoriesToStorage(updated);
  };

  // Helper for rendering custom beautifully styled schematic art based on the person
  const renderVectorPlaceholder = (chapterId: string, index: number) => {
    // Generate distinct laboratory theme colors based on index/chapter
    const themes: { [key: string]: { stroke: string; fill: string; title: string } } = {
      varun: { stroke: 'stroke-blue-400', fill: 'fill-blue-500/10', title: 'Tube Furnace' },
      aditi: { stroke: 'stroke-rose-400', fill: 'fill-rose-500/10', title: 'DSC Thermogram' },
      ayushi: { stroke: 'stroke-teal-400', fill: 'fill-teal-500/10', title: 'XRD Diffractogram' },
      isha: { stroke: 'stroke-purple-400', fill: 'fill-purple-500/10', title: 'Lab Supplies' },
      rimzim: { stroke: 'stroke-orange-400', fill: 'fill-orange-500/10', title: 'Sol-Gel Colloids' },
      harshit: { stroke: 'stroke-amber-400', fill: 'fill-amber-500/10', title: 'Chamber Heating' },
      mrigank: { stroke: 'stroke-emerald-400', fill: 'fill-emerald-500/10', title: 'SEM Micro-grains' },
      together: { stroke: 'stroke-indigo-400', fill: 'fill-indigo-500/10', title: 'Chai & Ghats' }
    };

    const currentTheme = themes[chapterId] || themes.together;

    // We can show beautiful minimalist lab drawings
    return (
      <svg className="w-full h-full p-6 text-slate-500 opacity-60 hover:opacity-95 transition-opacity duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {chapterId === 'varun' && (
          <>
            {/* Tube Furnace Schematic */}
            <rect x="15" y="35" width="70" height="30" rx="4" className={`${currentTheme.stroke} ${currentTheme.fill}`} strokeWidth="2" />
            <line x1="10" y1="50" x2="15" y2="50" className={currentTheme.stroke} strokeWidth="2" />
            <line x1="85" y1="50" x2="90" y2="50" className={currentTheme.stroke} strokeWidth="2" />
            {/* Glowing heating element lines inside */}
            <path d="M 25 45 Q 35 40 45 45 T 65 45 T 75 45" className="stroke-red-400/80 animate-pulse" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 25 55 Q 35 50 45 55 T 65 55 T 75 55" className="stroke-red-400/80 animate-pulse" strokeWidth="1.5" strokeLinecap="round" />
            {/* Alumina boat sample */}
            <path d="M 40 50 L 60 50 L 58 53 L 42 53 Z" className="stroke-slate-300 fill-slate-300/30" />
            <circle cx="50" cy="48" r="1.5" className="fill-amber-400" />
            <text x="50" y="80" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">TUBE SINTERING</text>
          </>
        )}
        {chapterId === 'aditi' && (
          <>
            {/* DSC Thermal Peak Graph */}
            <line x1="15" y1="80" x2="85" y2="80" className={currentTheme.stroke} strokeWidth="1.5" />
            <line x1="15" y1="15" x2="15" y2="80" className={currentTheme.stroke} strokeWidth="1.5" />
            {/* Smooth transition curve */}
            <path d="M 15 50 L 35 50 Q 45 50 50 25 T 55 75 Q 60 50 85 50" className="stroke-rose-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Reference dashed line */}
            <line x1="15" y1="50" x2="85" y2="50" className="stroke-slate-600 stroke-dasharray-[3,3]" strokeWidth="1" />
            <circle cx="50" cy="25" r="2.5" className="fill-rose-500 animate-ping" />
            <text x="50" y="90" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">THERMOGRAM EXOTHERM</text>
          </>
        )}
        {chapterId === 'ayushi' && (
          <>
            {/* XRD Lattice Peak Diffractogram */}
            <line x1="10" y1="80" x2="90" y2="80" className={currentTheme.stroke} strokeWidth="1.5" />
            <line x1="10" y1="20" x2="10" y2="80" className={currentTheme.stroke} strokeWidth="1.5" />
            {/* Sharp Crystallographic Peaks */}
            <path d="M 15 80 L 25 80 L 28 35 L 31 80 L 45 80 L 48 15 L 51 80 L 55 80 L 58 60 L 61 80 L 70 80 L 73 40 L 76 80 L 85 80" 
                  className="stroke-teal-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="50" y="90" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">XRD PHASE HIGHLIGHT</text>
          </>
        )}
        {chapterId === 'isha' && (
          <>
            {/* Organizational Chemical Shelf layout */}
            <rect x="20" y="20" width="60" height="60" className={`${currentTheme.stroke}`} strokeWidth="2" />
            <line x1="20" y1="40" x2="80" y2="40" className={currentTheme.stroke} strokeWidth="1.5" />
            <line x1="20" y1="60" x2="80" y2="60" className={currentTheme.stroke} strokeWidth="1.5" />
            {/* Beakers, chemicals */}
            <rect x="25" y="28" width="10" height="12" rx="1" className="stroke-purple-300 fill-purple-300/20" strokeWidth="1" />
            <circle cx="30" cy="34" r="2" className="fill-amber-400/80" />
            <path d="M 45 25 L 55 25 L 52 38 L 48 38 Z" className="stroke-purple-300 fill-purple-300/20" strokeWidth="1" />
            <rect x="62" y="48" width="12" height="12" className="stroke-slate-300 fill-emerald-500/20" strokeWidth="1" />
            <text x="50" y="90" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">LAB PROTOCOL DEPT</text>
          </>
        )}
        {chapterId === 'rimzim' && (
          <>
            {/* Sol-Gel beaker and pipette */}
            <rect x="30" y="35" width="40" height="45" rx="3" className={`${currentTheme.stroke} ${currentTheme.fill}`} strokeWidth="2" />
            {/* Liquid mesh inside beaker */}
            <path d="M 31 55 Q 40 58 50 55 T 69 55 L 69 77 Q 50 79 31 77 Z" className="fill-orange-500/20 stroke-orange-400/40" strokeWidth="1" />
            {/* Dropper pipetting liquid */}
            <line x1="50" y1="15" x2="50" y2="45" className="stroke-slate-400" strokeWidth="2" />
            <path d="M 48 45 L 52 45 L 50 49 Z" className="fill-orange-400" />
            {/* Small bubbles floating up */}
            <circle cx="42" cy="62" r="1.5" className="stroke-orange-300 fill-none" strokeWidth="0.8" />
            <circle cx="58" cy="68" r="2" className="stroke-orange-300 fill-none animate-ping" strokeWidth="0.8" />
            <circle cx="48" cy="72" r="1" className="stroke-orange-300 fill-none" strokeWidth="0.8" />
            <text x="50" y="92" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">SOL-GEL PRECISION</text>
          </>
        )}
        {chapterId === 'harshit' && (
          <>
            {/* Furnace chamber & digital terminal controller showing 1400C */}
            <rect x="15" y="20" width="70" height="60" rx="3" className={`${currentTheme.stroke} ${currentTheme.fill}`} strokeWidth="2" />
            {/* Inner chamber */}
            <rect x="25" y="28" width="50" height="28" className="stroke-amber-500/50" strokeWidth="1" />
            {/* Digital Display showing 1400 */}
            <rect x="25" y="62" width="22" height="12" rx="1" className="fill-slate-950 stroke-slate-800" />
            <text x="36" y="70" className="fill-amber-400 text-[6px] font-mono text-center font-bold" textAnchor="middle">1400C</text>
            {/* Dial controls */}
            <circle cx="58" cy="68" r="2.5" className="stroke-slate-400 fill-none" strokeWidth="1" />
            <circle cx="68" cy="68" r="2.5" className="stroke-slate-400 fill-none" strokeWidth="1" />
            <line x1="58" y1="68" x2="60" y2="66" className="stroke-slate-400" strokeWidth="1" />
            {/* Heat radiation waving */}
            <path d="M 35 42 Q 40 38 45 42 T 55 42 T 65 42" className="stroke-orange-500/80 animate-pulse" strokeWidth="1" />
            <text x="50" y="91" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">CHAMBER HARDENING</text>
          </>
        )}
        {chapterId === 'mrigank' && (
          <>
            {/* SEM Imaging Grains Micro-structure */}
            <circle cx="50" cy="50" r="30" className={`${currentTheme.stroke} ${currentTheme.fill}`} strokeWidth="2" />
            {/* Hexagonal ceramic grain boundaries */}
            <path d="M 40 30 L 50 25 L 60 30 L 60 40 L 50 45 L 40 40 Z" className="stroke-emerald-400/40" strokeWidth="1" />
            <path d="M 50 45 L 60 40 L 70 45 L 70 55 L 60 60 L 50 55 Z" className="stroke-emerald-400/40" strokeWidth="1" />
            <path d="M 30 45 L 40 40 L 50 45 L 50 55 L 40 60 L 30 55 Z" className="stroke-emerald-400/40" strokeWidth="1" />
            <path d="M 40 60 L 50 55 L 60 60 L 60 70 L 50 75 L 40 70 Z" className="stroke-emerald-400/40" strokeWidth="1" />
            {/* Zoom lens indicator overlay */}
            <line x1="50" y1="50" x2="75" y2="75" className="stroke-amber-400/60" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="12" className="stroke-amber-400/60 fill-amber-400/5" strokeWidth="1" />
            <text x="50" y="90" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">SEM POLISHED GRAINS</text>
          </>
        )}
        {chapterId === 'together' && (
          <>
            {/* Steaming Chai Cup + Varanasi Ganga Waves */}
            <path d="M 15 75 Q 35 68 50 75 T 85 75" className="stroke-blue-400/70" strokeWidth="1.5" />
            <path d="M 15 82 Q 35 77 50 82 T 85 82" className="stroke-blue-400/50" strokeWidth="1" />
            {/* Steaming tea cup */}
            <path d="M 35 40 L 65 40 L 60 60 rx=2 Q 50 65 40 60 Z" className={`${currentTheme.stroke} ${currentTheme.fill}`} strokeWidth="2" />
            {/* Cup handle */}
            <path d="M 65 45 Q 73 48 71 55 Q 69 60 62 58" className={currentTheme.stroke} strokeWidth="1.5" />
            {/* Hot tea steam coils */}
            <path d="M 43 32 Q 45 23 42 16" className="stroke-amber-300/70 animate-bounce" strokeWidth="1" strokeLinecap="round" />
            <path d="M 50 32 Q 52 20 48 14" className="stroke-amber-300/70 animate-bounce" strokeWidth="1" strokeLinecap="round" style={{ animationDelay: '0.2s' }} />
            <path d="M 57 32 Q 59 24 56 18" className="stroke-amber-300/70 animate-bounce" strokeWidth="1" strokeLinecap="round" style={{ animationDelay: '0.4s' }} />
            <text x="50" y="92" textAnchor="middle" className="fill-slate-400 text-[6px] font-mono tracking-wider">LANKA CHAI MEMORY</text>
          </>
        )}
      </svg>
    );
  };

  // Filter notes belonging to current active chapter
  const activeNotes = memories.filter(note => note.chapterId === activeChapter.id);

  // Simple clean theme-builder object
  const themeColors: { [key: string]: { text: string; bg: string; button: string; pill: string; shadow: string } } = {
    blue: {
      text: 'text-[#6d6875]',
      bg: 'bg-[#6d6875]/10',
      button: 'bg-[#6d6875] text-[#f7f4ef] hover:bg-[#5a5661]',
      pill: 'bg-[#6d6875]/10 text-[#6d6875] border-[#6d6875]/20',
      shadow: 'shadow-sm'
    },
    rose: {
      text: 'text-[#b5838d]',
      bg: 'bg-[#b5838d]/10',
      button: 'bg-[#b5838d] text-[#f7f4ef] hover:bg-[#9f6d77]',
      pill: 'bg-[#b5838d]/10 text-[#b5838d] border-[#b5838d]/20',
      shadow: 'shadow-sm'
    },
    teal: {
      text: 'text-[#6b705c]',
      bg: 'bg-[#6b705c]/10',
      button: 'bg-[#6b705c] text-[#f7f4ef] hover:bg-[#555949]',
      pill: 'bg-[#6b705c]/10 text-[#6b705c] border-[#6b705c]/20',
      shadow: 'shadow-sm'
    },
    purple: {
      text: 'text-[#6d6875]',
      bg: 'bg-[#6d6875]/10',
      button: 'bg-[#6d6875] text-[#f7f4ef] hover:bg-[#5a5661]',
      pill: 'bg-[#6d6875]/10 text-[#6d6875] border-[#6d6875]/20',
      shadow: 'shadow-sm'
    },
    orange: {
      text: 'text-[#cb997e]',
      bg: 'bg-[#cb997e]/10',
      button: 'bg-[#cb997e] text-[#f7f4ef] hover:bg-[#b5856b]',
      pill: 'bg-[#cb997e]/10 text-[#cb997e] border-[#cb997e]/20',
      shadow: 'shadow-sm'
    },
    amber: {
      text: 'text-[#b5838d]',
      bg: 'bg-[#b5838d]/10',
      button: 'bg-[#b5838d] text-[#f7f4ef] hover:bg-[#9f6d77]',
      pill: 'bg-[#b5838d]/10 text-[#b5838d] border-[#b5838d]/20',
      shadow: 'shadow-sm'
    },
    emerald: {
      text: 'text-[#4a4e40]',
      bg: 'bg-[#4a4e40]/10',
      button: 'bg-[#4a4e40] text-[#f7f4ef] hover:bg-[#393c31]',
      pill: 'bg-[#4a4e40]/10 text-[#4a4e40] border-[#4a4e40]/20',
      shadow: 'shadow-sm'
    },
    indigo: {
      text: 'text-[#e5989b]',
      bg: 'bg-[#e5989b]/10',
      button: 'bg-[#e5989b] text-[#f7f4ef] hover:bg-[#d4878a]',
      pill: 'bg-[#e5989b]/10 text-[#e5989b] border-[#e5989b]/20',
      shadow: 'shadow-sm'
    }
  };

  const currentColors = themeColors[activeChapter.colorTheme] || themeColors.blue;

  // Render navigation bar
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#2d2d2d] flex flex-col lg:flex-row pb-24 lg:pb-0">
      
      {/* Hidden file uploader input */}
      <input 
        id="hidden-file-input"
        type="file" 
        ref={fileInputRef}
        onChange={(e) => {
          if (uploadTargetId) {
            handlePhotoUpload(e, uploadTargetId);
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {/* LEFT PANEL: Table of Contents / Sidebar navigation */}
      <div id="sidebar-navigation" className="w-full lg:w-80 bg-[#f0ede4] border-b lg:border-b-0 lg:border-r border-[#e5e5e0] flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#e5e5e0] flex items-center justify-between">
            <div>
              <h2 className="font-serif italic text-xl text-[#4a4e40]">Lab Memories</h2>
              <span className="text-[9px] font-mono text-[#6b705c] tracking-wider font-bold">IIT (BHU) VARANASI · 24-25</span>
            </div>
          </div>

          {/* Chapters Navigation */}
          <div className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar">
            {CHAPTERS.map((chap) => {
              const isActive = chap.id === activeChapter.id;
              return (
                <button
                  key={chap.id}
                  id={`nav-chapter-${chap.id}`}
                  onClick={() => onSelectChapter(chap.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer shrink-0 lg:shrink ${
                    isActive 
                      ? 'bg-white text-[#2d2d2d] border border-[#e5e5e0] shadow-sm' 
                      : 'hover:bg-[#e5e5e0]/50 text-[#6d6875] border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    isActive ? 'bg-[#6b705c] text-[#f7f4ef]' : 'bg-[#e5e5e0]/60 text-[#6d6875]'
                  }`}>
                    {chap.number}
                  </div>
                  <div>
                    <div className={`font-serif text-sm font-bold ${isActive ? 'text-[#4a4e40]' : 'text-[#6d6875]'}`}>
                      {chap.title}
                    </div>
                    <div className="text-[10px] text-[#6b705c] font-mono hidden lg:block truncate max-w-[160px] font-semibold">
                      {chap.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer/Credit Block */}
        <div className="p-6 border-t border-[#e5e5e0] hidden lg:block text-center">
          <p className="text-[11px] text-[#6d6875] font-serif italic tracking-wide">
            “What is not written is forgotten.”
          </p>
          <span className="text-[9px] text-[#6b705c] mt-1 block font-mono font-bold uppercase tracking-wider">Ceramic Engg. Department</span>
        </div>
      </div>

      {/* CORE CONTENT: Gallery and Memories */}
      <div id="main-content-area" className="flex-1 overflow-y-auto px-6 py-8 md:p-12 lg:h-screen">
        
        {/* CHAPTER HEADING HEADER */}
        <motion.div 
          key={activeChapter.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative p-8 rounded-[40px] border border-[#e5e5e0] bg-white mb-10 overflow-hidden shadow-sm"
        >
          {/* Faint ambient light decorative shape */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb4a2] opacity-15 rounded-bl-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#b5838d] uppercase tracking-[0.2em] mb-1 block">
                Chapter {activeChapter.number === 8 ? 'VIII' : activeChapter.number === 7 ? 'VII' : activeChapter.number === 6 ? 'VI' : activeChapter.number === 5 ? 'V' : activeChapter.number === 4 ? 'IV' : activeChapter.number === 3 ? 'III' : activeChapter.number === 2 ? 'II' : 'I'}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4a4e40] tracking-tight mt-1">
                {activeChapter.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${currentColors.pill}`}>
                  {activeChapter.role}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#f0ede4] text-[#6d6875] border border-[#e5e5e0] font-semibold">
                  {activeChapter.imagesCount} Memories
                </span>
              </div>
            </div>

            <p className="text-[#6d6875] text-sm md:text-base italic max-w-md leading-relaxed border-l-2 border-[#b5838d]/40 pl-4 font-serif">
              “{activeChapter.description}”
            </p>
          </div>
        </motion.div>

        {/* PHOTO GALLERY SECTION */}
        <div id="gallery-grid-title" className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-serif italic text-lg text-[#4a4e40] font-bold">Chapter Slideshow & Photo Album</h3>
            <p className="text-xs text-[#6d6875] font-semibold">Click a card to zoom. Press the uploader icon to insert your actual photos!</p>
          </div>
          <div className="flex gap-2">
            {Object.keys(photos).some(k => k.startsWith(activeChapter.id)) && (
              <button
                id="btn-reset-photos"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your uploaded images for this chapter?')) {
                    const updated = { ...photos };
                    Object.keys(updated).forEach(k => {
                      if (k.startsWith(activeChapter.id)) delete updated[k];
                    });
                    savePhotosToStorage(updated);
                  }
                }}
                className="text-xs text-[#b5838d]/90 hover:text-[#b5838d] bg-[#b5838d]/10 border border-[#b5838d]/20 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Chapter Photos</span>
              </button>
            )}
          </div>
        </div>

        {/* 7/9 Photo Grid mimicking PDF layout */}
        <div id="gallery-photo-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: activeChapter.imagesCount }).map((_, index) => {
            const slotId = `${activeChapter.id}-${index}`;
            const userPhoto = photos[slotId];
            
            const hasDefaultPhoto = !failedDefaultPhotos[slotId];
            const defaultPhotoUrl = `/photos/${activeChapter.id}/${index + 1}.jpg`;
            const hasAnyPhoto = !!userPhoto || hasDefaultPhoto;

            // Make the bottom item wide to match pdf layout (index 6 for 7 total, or index 8 for 9 total)
            const isWideRow = (activeChapter.imagesCount === 7 && index === 6) || (activeChapter.imagesCount === 9 && index === 8);

            return (
              <motion.div
                key={slotId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`relative group bg-white border border-[#e5e5e0] rounded-[32px] overflow-hidden aspect-video md:aspect-square flex flex-col justify-between p-4 cursor-pointer shadow-sm hover:shadow-md hover:border-[#b5838d]/40 transition-all duration-300 ${
                  isWideRow ? 'md:col-span-3 !aspect-[3/1]' : ''
                }`}
                onClick={() => {
                  if (userPhoto) {
                    setSelectedPhoto({ id: slotId, url: userPhoto, index });
                  } else if (hasDefaultPhoto) {
                    setSelectedPhoto({ id: slotId, url: defaultPhotoUrl, index });
                  } else {
                    triggerUpload(slotId);
                  }
                }}
              >
                {/* Background Representation */}
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#f0ede4]">
                  {userPhoto ? (
                    <img 
                      src={userPhoto} 
                      alt={`Memory ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : hasDefaultPhoto ? (
                    <img 
                      src={defaultPhotoUrl} 
                      alt={`Memory ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setFailedDefaultPhotos(prev => ({ ...prev, [slotId]: true }));
                      }}
                    />
                  ) : (
                    renderVectorPlaceholder(activeChapter.id, index)
                  )}
                </div>

                {/* Card Header Tag */}
                <div className="relative z-10 flex justify-between items-center w-full">
                  <span className="text-[10px] font-mono bg-[#6b705c]/10 text-[#6b705c] px-2.5 py-0.5 rounded-full border border-[#6b705c]/20 font-bold">
                    MEM_0{index + 1}
                  </span>
                  {userPhoto ? (
                    <button
                      id={`btn-remove-photo-${slotId}`}
                      onClick={(e) => removePhoto(slotId, e)}
                      className="p-1.5 rounded-full bg-white/95 text-[#b5838d] hover:bg-white cursor-pointer border border-[#b5838d]/30 shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : hasDefaultPhoto ? (
                    <button
                      id={`btn-override-photo-${slotId}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerUpload(slotId);
                      }}
                      className="p-1.5 rounded-full bg-white/95 text-[#6b705c] hover:bg-white hover:text-[#4a4e40] cursor-pointer border border-[#e5e5e0] shadow-sm hover:border-[#b5838d]/40 transition-colors"
                      title="Upload custom photo"
                    >
                      <Upload className="w-3 h-3 text-[#b5838d]" />
                    </button>
                  ) : null}
                </div>

                {/* Card Action Layer */}
                <div className="relative z-10 flex justify-between items-end w-full">
                  {!hasAnyPhoto ? (
                    <button
                      id={`btn-upload-photo-${slotId}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerUpload(slotId);
                      }}
                      className="text-[10px] font-mono bg-white/95 text-[#6d6875] hover:text-[#4a4e40] px-3 py-1.5 rounded-xl border border-[#e5e5e0] hover:border-[#b5838d]/40 flex items-center gap-1.5 cursor-pointer transition-all font-bold shadow-sm"
                    >
                      <Upload className="w-3 h-3 text-[#b5838d]" />
                      <span>Upload Photo</span>
                    </button>
                  ) : (
                    <div className="text-[10px] font-mono bg-white/95 text-[#6b705c] px-3 py-1.5 rounded-xl border border-[#e5e5e0] flex items-center gap-1.5 font-bold shadow-sm">
                      <Maximize2 className="w-3 h-3 text-[#6b705c]" />
                      <span>Zoom View</span>
                    </div>
                  )}
                  <span className="text-[10px] text-[#6d6875] font-mono font-medium">2024-2025</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* DOUBLE DIVIDER */}
        <div className="h-[1px] bg-[#e5e5e0] my-10" />

        {/* INTERACTIVE MEMORY NOTE WALL (GUESTBOOK) */}
        <div id="sticky-notes-board" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Note leaving form */}
          <div className="lg:col-span-1 bg-white border border-[#e5e5e0] rounded-[32px] p-6 h-fit shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-[#b5838d]" />
              <h4 className="font-serif italic text-lg text-[#4a4e40] font-bold">Leave a Memory</h4>
            </div>
            <p className="text-xs text-[#6d6875] mb-6 leading-relaxed">
              Have an inside joke, a nostalgic recall, or a heartfelt thanks for <strong className="text-[#b5838d]">{activeChapter.title}</strong>? Write it down so it stays pinned forever on their memory board!
            </p>

            <form onSubmit={handleSubmitNote} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#6b705c] uppercase mb-1.5 font-bold" htmlFor="input-author-name">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#6b705c]" />
                  <input
                    id="input-author-name"
                    type="text"
                    required
                    placeholder="e.g. Harshit, Aditi, etc."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-[#f0ede4]/40 border border-[#e5e5e0] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2d2d2d] placeholder-[#a5a5a5] focus:outline-none focus:border-[#b5838d]/50 focus:ring-1 focus:ring-[#b5838d]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#6b705c] uppercase mb-1.5 font-bold" htmlFor="input-note-text">
                  Memory or Inside Joke
                </label>
                <textarea
                  id="input-note-text"
                  required
                  rows={4}
                  maxLength={180}
                  placeholder="Type your memory here... Keep it nostalgic and heartfelt."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-[#f0ede4]/40 border border-[#e5e5e0] rounded-xl p-3.5 text-sm text-[#2d2d2d] placeholder-[#a5a5a5] focus:outline-none focus:border-[#b5838d]/50 focus:ring-1 focus:ring-[#b5838d]/20 resize-none"
                />
                <span className="text-[10px] text-[#6d6875] font-mono text-right block mt-1">
                  {180 - noteText.length} characters remaining
                </span>
              </div>

              {/* Note color choice */}
              <div>
                <span className="block text-xs font-mono text-[#6b705c] uppercase mb-2 font-bold">Note Color Theme</span>
                <div className="flex gap-2.5">
                  {(['yellow', 'pink', 'blue', 'green', 'orange', 'purple'] as const).map((color) => {
                    const colorMap: { [key: string]: string } = {
                      yellow: 'bg-[#fffae0] border-[#f5ebae]',
                      pink: 'bg-[#ffeaeb] border-[#f0c8ca]',
                      blue: 'bg-[#e2f0f9] border-[#b8daee]',
                      green: 'bg-[#ebf5df] border-[#cbdcb0]',
                      orange: 'bg-[#fff0e6] border-[#f3d1ba]',
                      purple: 'bg-[#f4eefc] border-[#dfcef3]'
                    };
                    return (
                      <button
                        key={color}
                        type="button"
                        id={`btn-color-${color}`}
                        onClick={() => setNoteColor(color)}
                        className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-150 border-2 ${colorMap[color]} ${
                          noteColor === color ? 'scale-110 ring-2 ring-[#b5838d]' : 'opacity-75 hover:opacity-100'
                        }`}
                        title={`${color} note`}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-note"
                className="w-full mt-4 bg-[#6b705c] hover:bg-[#4a4e40] text-[#f7f4ef] py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Pin to Memory Wall</span>
              </button>
            </form>
          </div>

          {/* Notes display wall */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#b5838d]" />
                <h4 className="font-serif italic text-lg text-[#4a4e40] font-bold font-serif">
                  {activeChapter.title}’s Memory Wall
                </h4>
              </div>
              <span className="text-xs text-[#6d6875] font-mono font-bold">
                {activeNotes.length} pinned notes
              </span>
            </div>

            {activeNotes.length === 0 ? (
              <div className="bg-[#f0ede4]/50 border border-dashed border-[#b5838d]/30 rounded-[32px] p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <MessageSquare className="w-8 h-8 text-[#6d6875]/40 mb-3" />
                <p className="text-[#6d6875] text-sm font-serif italic max-w-xs leading-relaxed">
                  “No stories written down yet... Be the first to capture an unforgettable memory!”
                </p>
              </div>
            ) : (
              // Messy polaroid wall
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                <AnimatePresence mode="popLayout">
                  {activeNotes.map((note) => {
                    // Map local colors to sticky classes using Natural Tones pastel selection
                    const colorStyles: { [key: string]: { bg: string; text: string; tape: string; border: string } } = {
                      yellow: { bg: 'bg-[#fffae0]', text: 'text-[#5d4615]', tape: 'bg-[#f5ebae]/45', border: 'border-[#f5ebae]' },
                      pink: { bg: 'bg-[#ffeaeb]', text: 'text-[#612c2e]', tape: 'bg-[#f0c8ca]/45', border: 'border-[#f0c8ca]' },
                      blue: { bg: 'bg-[#e2f0f9]', text: 'text-[#184561]', tape: 'bg-[#b8daee]/45', border: 'border-[#b8daee]' },
                      green: { bg: 'bg-[#ebf5df]', text: 'text-[#364b18]', tape: 'bg-[#cbdcb0]/45', border: 'border-[#cbdcb0]' },
                      orange: { bg: 'bg-[#fff0e6]', text: 'text-[#633a1f]', tape: 'bg-[#f3d1ba]/45', border: 'border-[#f3d1ba]' },
                      purple: { bg: 'bg-[#f4eefc]', text: 'text-[#422264]', tape: 'bg-[#dfcef3]/45', border: 'border-[#dfcef3]' }
                    };

                    const style = colorStyles[note.color] || colorStyles.yellow;

                    return (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                        animate={{ opacity: 1, scale: 1, rotate: note.rotation }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className={`relative ${style.bg} ${style.border} ${style.text} p-5 rounded-sm shadow-sm border flex flex-col justify-between min-h-[160px] max-h-[220px] overflow-hidden group select-none`}
                        style={{ transform: `rotate(${note.rotation}deg)` }}
                      >
                        {/* Decorative Scotch Tape effect on top */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-3.5 w-14 ${style.tape} backdrop-blur-[1px] rotate-1`} />
                        
                        {/* Delete button (only visible on hover to keep polaroid look tidy) */}
                        <button
                          id={`btn-delete-note-${note.id}`}
                          onClick={() => handleDeleteNote(note.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full text-slate-500/50 hover:text-rose-600 hover:bg-white/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-150"
                          title="Delete note"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Content text */}
                        <p className="font-serif italic text-[13px] leading-relaxed pr-3 pt-1 overflow-y-auto no-scrollbar font-medium">
                          {note.text}
                        </p>

                        {/* Note Metadata / Author signature */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-900/5">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                            — {note.author}
                          </span>
                          <span className="font-mono text-[9px] opacity-65 font-semibold">
                            {note.createdAt}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>

        {/* BOOK FOOTER EXCERPT */}
        <div id="footer-quote-section" className="mt-16 text-center max-w-xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-300">
          <div className="h-[1px] bg-[#e5e5e0] mb-6" />
          <p className="text-xs text-[#6d6875] font-serif italic mb-2 leading-relaxed">
            “{activeChapter.defaultFooter}”
          </p>
          <span className="text-[10px] text-[#6b705c] font-mono tracking-widest uppercase font-bold">Ceramic Engineering Lab</span>
        </div>

      </div>

      {/* LIGHTBOX SLIDESHOW MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d2d2d]/90 backdrop-blur-sm p-4 cursor-zoom-out"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Top Close indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-4 text-white z-50">
              <span className="text-xs font-mono text-slate-300 font-bold">Photo {selectedPhoto.index + 1} of {activeChapter.imagesCount}</span>
              <button
                id="btn-close-lightbox"
                onClick={() => setSelectedPhoto(null)}
                className="p-2 bg-[#2d2d2d]/80 border border-transparent rounded-full text-[#f7f4ef] hover:bg-[#4a4e40] cursor-pointer shadow-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main content image */}
            <motion.div
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-[32px] border border-[#e5e5e0] bg-white shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.url} 
                alt="Memory Expanded" 
                className="w-full h-full object-contain max-h-[75vh]"
                referrerPolicy="no-referrer"
              />
              {/* Overlay subtitle bar */}
              <div className="p-6 bg-[#f7f4ef] border-t border-[#e5e5e0] flex justify-between items-center text-[#2d2d2d]">
                <div>
                  <h4 className="font-serif italic text-sm text-[#4a4e40] font-bold">{activeChapter.title} — Memory Photo</h4>
                  <p className="text-[10px] text-[#6d6875] font-mono font-semibold mt-0.5">Part of the 2024-2025 Collective Record</p>
                </div>
                <div className="flex gap-2">
                  <button
                    id="btn-replace-lightbox-photo"
                    onClick={() => {
                      triggerUpload(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="text-xs bg-[#6b705c] text-white hover:bg-[#4a4e40] px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all font-mono uppercase tracking-wider font-bold shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
