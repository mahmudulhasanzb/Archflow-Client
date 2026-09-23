'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, X } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  email: string;
  onClose?: () => void;
}

export default function VerificationModal({
  isOpen,
  email,
  onClose,
}: VerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative text-center space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {/* Glow Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-[0_0_24px_rgba(37,99,235,0.25)]">
          <Mail className="h-7 w-7" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground font-display">
            Check your inbox
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Verification link sent to{' '}
            <span className="font-semibold text-foreground underline decoration-primary/40 underline-offset-2">
              {email}
            </span>
            . Click link inside to activate account.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-2.5">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <span>Open Gmail</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          <Link
            href="/signin"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
          >
            Back to Sign in
          </Link>
        </div>

        <p className="text-[11px] text-muted-foreground/80 pt-1">
          Didn’t receive it? Check spam folder.
        </p>
      </div>
    </div>
  );
}
