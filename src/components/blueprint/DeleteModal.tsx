'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blueprintTitle: string;
  loading: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  blueprintTitle,
  loading,
}: DeleteModalProps) {
  const [confirmText, setConfirmText] = useState('');

  // Lock body scroll when modal is open & reset confirm input
  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          disabled={loading}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground font-display">
              Delete Blueprint
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                "{blueprintTitle}"
              </span>
              ? This action cannot be undone and all associated architecture
              flow details, roadmaps, and audit logs will be permanently
              deleted.
            </p>
          </div>
        </div>

        {/* Safety Confirmation Input */}
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 space-y-2">
          <label className="block text-[11px] text-muted-foreground">
            To confirm deletion, type{' '}
            <span className="font-mono font-bold text-destructive">DELETE</span>{' '}
            below:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="DELETE"
            disabled={loading}
            className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isConfirmed || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-0.5 mr-1 h-3 w-3 text-destructive-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Permanently Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
