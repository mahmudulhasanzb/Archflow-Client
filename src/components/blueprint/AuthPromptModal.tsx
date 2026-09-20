'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, LogIn } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actionText?: string;
  icon?: React.ReactNode;
  iconBadgeClassName?: string;
  redirectPath?: string;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  title,
  description,
  actionText = 'Sign In / Register',
  icon,
  iconBadgeClassName = 'bg-primary/10 text-primary border-primary/20',
  redirectPath,
}: AuthPromptModalProps) {
  const router = useRouter();

  // Prevent background scrolling and handle escape key when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const target = redirectPath || currentPath;
    router.push(`/signin?callbackUrl=${encodeURIComponent(target)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${iconBadgeClassName}`}
        >
          {icon || <LogIn className="h-6 w-6" />}
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 text-left">
          <h3 className="text-base font-bold text-foreground font-display">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={handleNavigate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>{actionText}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
