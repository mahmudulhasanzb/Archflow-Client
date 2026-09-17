'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Home, BookOpen, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 relative overflow-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"
      />

      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-primary/10 blur-3xl"
      />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-lg w-full relative z-10 flex flex-col items-center"
      >
        {/* Animated Icon Badge */}
        <div className="relative mb-6">
          <div className="p-4 bg-card border border-border rounded-2xl text-foreground shadow-sm">
            <Layers className="w-10 h-10 text-primary" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-muted border border-border font-mono text-[10px] font-bold text-muted-foreground uppercase">
            ERR_404
          </span>
        </div>

        {/* 404 Heading */}
        <h1 className="text-7xl sm:text-8xl font-extrabold text-foreground tracking-tight font-display leading-none mb-3">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display tracking-tight mb-3">
          Blueprint Not Found
        </h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm">
          The architectural specification, page, or resource you are looking for has been moved, deleted, or does not exist.
        </p>

        {/* Actions Grid */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
          <Link
            href="/blueprints"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Blueprints</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-card hover:bg-muted text-foreground border border-border font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-muted-foreground" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Quick Links Footer */}
        <div className="pt-6 border-t border-border w-full flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <Link href="/docs" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Documentation</span>
          </Link>
          <span>•</span>
          <Link href="/workspace" className="hover:text-foreground transition-colors">
            Workspace
          </Link>
          <span>•</span>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About Archflow
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
