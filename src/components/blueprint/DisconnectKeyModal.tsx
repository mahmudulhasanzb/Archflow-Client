'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X, Loader2, KeyRound } from 'lucide-react';

interface DisconnectKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  keyLabel?: string;
}

export default function DisconnectKeyModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  keyLabel,
}: DisconnectKeyModalProps) {
  // Lock body scroll when modal is open
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Alert Icon */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/15 border border-destructive/25 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold font-display text-foreground leading-snug">
              Disconnect OpenRouter Key
            </h2>
            <p className="text-xs text-muted-foreground">
              {keyLabel ? `Key: ${keyLabel}` : 'Custom API Key'}
            </p>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-muted-foreground leading-relaxed">
          <p className="text-foreground font-medium mb-1">
            Are you sure you want to disconnect this key?
          </p>
          <p>
            Your account will immediately return to the standard shared tier limits. You can reconnect a key at any time.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Disconnecting...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-3.5 w-3.5" />
                <span>Disconnect Key</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
