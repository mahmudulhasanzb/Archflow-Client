'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-[80vh] bg-background text-foreground flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"
      />

      {/* Ambient Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-primary/10 blur-3xl" 
      />

      {/* Loading Widget */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Concentric Pulse Rings */}
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          {/* Primary outer pulse ring */}
          <motion.div
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.35, 0, 0.35],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 border-2 border-primary rounded-full"
          />

          {/* Secondary delayed pulse ring */}
          <motion.div
            animate={{
              scale: [1, 1.65, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute inset-0 border border-muted-foreground/40 rounded-full"
          />

          {/* Centered Pulse Icon */}
          <motion.div
            animate={{ scale: [0.96, 1.05, 0.96] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm"
          >
            <Layers className="w-6 h-6 animate-pulse" />
          </motion.div>
        </div>

        {/* Telemetry Status Line */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="tracking-wide"
          >
            Compiling specifications...
          </motion.span>
        </div>
      </div>
    </div>
  );
}
