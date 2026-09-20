'use client';

import React, { useEffect } from 'react';
import { Globe, Lock, X, Loader2 } from 'lucide-react';
import { AdminBlueprint } from '@/lib/api/admin/data';

interface VisibilityChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blueprint: AdminBlueprint | null;
  targetVisibility: 'public' | 'private';
  loading: boolean;
}

export default function VisibilityChangeModal({
  isOpen,
  onClose,
  onConfirm,
  blueprint,
  targetVisibility,
  loading,
}: VisibilityChangeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !blueprint) return null;

  const isGoingPublic = targetVisibility === 'public';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              isGoingPublic
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {isGoingPublic ? (
              <Globe className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 pr-6">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Change Blueprint Visibility
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to change the visibility of{' '}
              <span className="font-semibold text-foreground">
                "{blueprint.title}"
              </span>{' '}
              to <span className="font-semibold text-foreground uppercase">{targetVisibility}</span>?
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Blueprint:</span>
            <span className="font-medium text-foreground truncate max-w-[220px]">
              {blueprint.title}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current Status:</span>
            <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              {blueprint.visibility}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">New Status:</span>
            <span
              className={`font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${
                isGoingPublic
                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                  : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              {targetVisibility}
            </span>
          </div>
        </div>

        {/* Info Note */}
        <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
          {isGoingPublic
            ? 'This blueprint will be publicly visible to everyone in the Explore Gallery.'
            : 'This blueprint will be hidden from the public gallery and accessible only to its owner and administrators.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-2.5 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
              isGoingPublic
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : isGoingPublic ? (
              <>
                <Globe className="h-3.5 w-3.5" />
                <span>Make Public</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>Make Private</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
