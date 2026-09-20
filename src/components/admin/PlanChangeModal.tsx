'use client';

import React, { useEffect } from 'react';
import { ArrowUpDown, Sparkles, User, X, Loader2 } from 'lucide-react';
import { AdminUser } from '@/lib/api/admin/data';

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: AdminUser | null;
  targetPlan: 'free' | 'pro';
  loading: boolean;
}

export default function PlanChangeModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  targetPlan,
  loading,
}: PlanChangeModalProps) {
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

  if (!isOpen || !user) return null;

  const isUpgrading = targetPlan === 'pro';

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
              isUpgrading
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                : 'bg-primary/10 text-primary border-primary/20'
            }`}
          >
            {isUpgrading ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 pr-6">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Change User Plan
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to switch{' '}
              <span className="font-semibold text-foreground">
                {user.name || user.email}
              </span>{' '}
              to the <span className="font-semibold text-foreground uppercase">{targetPlan}</span> plan?
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">User:</span>
            <span className="font-mono font-medium text-foreground truncate max-w-[200px]">
              {user.email}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current Plan:</span>
            <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              {user.plan || user.role}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">New Plan:</span>
            <span
              className={`font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${
                isUpgrading
                  ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                  : 'bg-muted text-foreground border-border'
              }`}
            >
              {targetPlan}
            </span>
          </div>
        </div>

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
              isUpgrading
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Confirm Plan Change</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
