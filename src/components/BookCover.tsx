import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, MapPin } from 'lucide-react';
import { NOSTALGIC_QUOTES } from '../data';

interface BookCoverProps {
  onOpen: () => void;
}

export default function BookCover({ onOpen }: BookCoverProps) {
  // Let's pick a random quote for a subtle touch at the bottom
  const quote = NOSTALGIC_QUOTES[1]; // "What is not written is forgotten."

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center bg-[#f7f4ef] text-[#2d2d2d] overflow-hidden px-6 py-12 md:py-16 select-none">
      
      {/* Background elegant pattern or subtle texture */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(181,131,141,0.06)_0%,transparent_80%]" />
      
      {/* Fine elegant border decoration around the page using Natural Tones rose and sage */}
      <div className="absolute inset-4 md:inset-8 border border-[#6b705c]/10 pointer-events-none rounded-[32px]" />
      <div className="absolute inset-5 md:inset-9 border border-dashed border-[#b5838d]/20 pointer-events-none rounded-[28px]" />
      
      {/* Top Header - Institutional Details */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 text-center flex flex-col items-center gap-2 mt-6"
      >
        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#6b705c] font-bold">
          Indian Institute of Technology (BHU) · Varanasi
        </span>
        <span className="text-[9px] md:text-[10px] font-sans uppercase tracking-[0.2em] text-[#6d6875] font-semibold">
          Department of Ceramic Engineering
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[#6d6875] mt-1 font-mono">
          <MapPin className="w-3.5 h-3.5 text-[#b5838d]" />
          <span>Varanasi, India</span>
        </div>
      </motion.div>

      {/* Center - Book Title */}
      <div className="z-10 text-center flex flex-col items-center max-w-xl my-auto">
        {/* Subtle decorative dashed line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 140 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#b5838d]/40 to-transparent mb-8"
        />

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-serif italic text-[#4a4e40] tracking-wide select-none"
        >
          Lab Memories
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-xs md:text-sm font-semibold italic text-[#6d6875] font-serif tracking-[0.15em] mt-3"
        >
          A Collective Record
        </motion.p>

        {/* Decorative Sparkles using Natural Tones palette */}
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex gap-2 my-6 text-[#cb997e]"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>

        {/* The Interns Constellation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="flex flex-col gap-2.5 text-[#6d6875] text-sm md:text-base font-serif max-w-md font-medium"
        >
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span className="hover:text-[#4a4e40] transition-colors duration-200">Varun</span>
            <span className="text-[#b5838d]/50 select-none">•</span>
            <span className="hover:text-[#4a4e40] transition-colors duration-200">Aditi</span>
            <span className="text-[#b5838d]/50 select-none">•</span>
            <span className="hover:text-[#4a4e40] transition-colors duration-200">Ayushi</span>
            <span className="text-[#b5838d]/50 select-none">•</span>
            <span className="hover:text-[#4a4e40] transition-colors duration-200">Isha</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span className="hover:text-[#4a4e40] transition-colors duration-200">Rimzim</span>
            <span className="text-[#b5838d]/50 select-none">•</span>
            <span className="hover:text-[#4a4e40] transition-colors duration-200">Harshit</span>
            <span className="text-[#b5838d]/50 select-none">•</span>
            <span className="hover:text-[#4a4e40] transition-colors duration-200">Mrigank</span>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-10"
        >
          <button
            id="btn-open-record"
            onClick={onOpen}
            className="group relative px-8 py-3.5 bg-[#6b705c] hover:bg-[#4a4e40] text-[#f7f4ef] rounded-[32px] text-xs font-mono uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2.5 overflow-hidden font-bold"
          >
            <BookOpen className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
            <span>Open Collective Record</span>
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Footer - Year & Quote */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1.2 }}
        className="z-10 text-center flex flex-col items-center gap-4 mb-6"
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 140 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#6b705c]/30 to-transparent"
        />
        
        <p className="text-[11px] md:text-xs text-[#6d6875] max-w-sm italic tracking-wide font-serif">
          {quote}
        </p>
        
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#6b705c] font-bold">
          2024 — 2025
        </span>
      </motion.div>
      
    </div>
  );
}
