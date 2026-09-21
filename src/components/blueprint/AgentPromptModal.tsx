'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Terminal, Sparkles } from 'lucide-react';
import { RECOMMENDED_AGENT_PROMPT } from '@/lib/constants/agentPrompt';

interface AgentPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  customPrompt?: string;
}

export default function AgentPromptModal({
  isOpen,
  onClose,
  customPrompt,
}: AgentPromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const promptText = customPrompt || RECOMMENDED_AGENT_PROMPT;

  // Mount/unmount lifecycle for smooth enter & exit animations
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setMounted(true);
      // Double rAF ensures DOM is painted before transition kicks off
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      timer = setTimeout(() => {
        setMounted(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key and scroll lock
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mounted]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  if (!mounted) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with smooth opacity transition */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container with smooth scale & translation transition */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 overflow-hidden transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] dark:border-white/15 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ${
          visible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-3 pointer-events-none'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 text-left pr-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground font-display">
                Recommended Agent Prompt
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="h-3 w-3" />
                1-Click Run
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              After downloading your blueprint, copy this prompt and paste it
              directly into your AI coding agent (Cursor, Claude Code,
              Antigravity, Windsurf) to execute automatically.
            </p>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="relative flex-1 min-h-0">
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-all cursor-pointer backdrop-blur-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          <pre className="h-full max-h-[380px] overflow-y-auto rounded-xl border border-border/80 bg-muted/40 p-4 text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
            {promptText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground">
            Zero configuration required • Compatible with all Agentic IDEs
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
