'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-[85vh] bg-[#FAFBFC] dark:bg-[#090C15] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden z-10">
      {/* Background ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full bg-gradient-to-tr from-[#4F46E5]/12 via-[#0D9488]/10 to-transparent blur-3xl z-0" 
      />

      {/* Loading Widget */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Pulse Animation Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          {/* Beating outer halo */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 border-2 border-[#4F46E5] rounded-full"
          />
          {/* Second offset beating halo */}
          <motion.div
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute inset-0 border border-[#0D9488] rounded-full"
          />

          {/* Centered pulse icon */}
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-12 h-12 rounded-full bg-[#EEF0FF] dark:bg-[#4F46E5]/15 border border-[#4F46E5]/30 flex items-center justify-center text-[#4F46E5] dark:text-[#818CF8]"
          >
            <Cpu className="w-6 h-6 animate-pulse" />
          </motion.div>
        </div>

        {/* Text indicators */}
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-[#4F46E5] dark:text-[#818CF8] select-none font-mono"
        >
          Architecting Specifications...
        </motion.span>
      </div>
    </div>
  );
}
