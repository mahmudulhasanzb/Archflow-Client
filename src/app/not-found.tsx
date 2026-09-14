'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#FAFBFC] dark:bg-[#090C15] flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden z-10">
      {/* Background ambient glow */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full bg-gradient-to-tr from-[#4F46E5]/12 via-[#0D9488]/10 to-transparent blur-3xl z-0" 
      />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        className="max-w-md w-full relative z-10 flex flex-col items-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="p-4 bg-white dark:bg-[#0E1321] border border-[#E1E4EA] dark:border-[#222C43] rounded-2xl text-[#4F46E5] dark:text-[#818CF8] mb-8 shadow-md"
        >
          <Layers className="w-12 h-12" />
        </motion.div>

        {/* 404 Heading */}
        <h1 className="text-8xl font-black text-[#4F46E5] dark:text-[#818CF8] tracking-tight leading-none mb-4 select-none font-display">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold uppercase text-[#181B20] dark:text-[#F3F4F6] tracking-wide mb-3 font-display">
          Blueprint Not Found
        </h2>

        {/* Description */}
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-8 leading-relaxed max-w-sm">
          The architectural specification or page you are searching for has been moved, deleted, or does not exist.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#4F46E5]/20 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}
