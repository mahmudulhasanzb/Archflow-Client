'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface PromptCardProps {
  ide: string;
  command: string;
  description: string;
}

export default function PromptCard({ ide, command, description }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3 transition-all hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center border border-border">
            <Terminal className="h-3.5 w-3.5 text-foreground" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">{ide}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-muted-foreground" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="rounded-xl bg-background p-3.5 font-mono text-xs text-foreground overflow-x-auto border border-border">
        <code>{command}</code>
      </div>
    </div>
  );
}
