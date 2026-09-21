'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { KeyRound, ExternalLink, X, Zap, ShieldAlert } from 'lucide-react';

interface DefaultLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DefaultLimitModal({
  isOpen,
  onClose,
}: DefaultLimitModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle Ambient Accent Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl"
        />

        {/* Header with Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-foreground leading-snug">
                Default API Endpoint Limit Reached
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Shared community token capacity exhausted
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Explanation */}
        <div className="space-y-3 rounded-xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed">
          <p className="text-foreground font-medium">
            The shared community OpenRouter API endpoint has temporarily reached its credit or rate limit.
          </p>
          <p>
            To continue generating production-grade blueprints right now with <strong>zero wait times</strong> and <strong>no blueprint limitations</strong>, please connect your personal OpenRouter API key.
          </p>
          <ul className="space-y-1.5 pt-1 text-foreground/90 font-medium">
            <li className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>Unlimited generations — bypasses standard plan caps</span>
            </li>
            <li className="flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span>Works with free OpenRouter models or prepaid credits</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <Link
            href="/add-apikey"
            onClick={onClose}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity text-center cursor-pointer"
          >
            <KeyRound className="h-4 w-4" />
            <span>Connect Your API Key</span>
          </Link>

          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors text-center cursor-pointer"
          >
            <span>Get Free Key</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  );
}
