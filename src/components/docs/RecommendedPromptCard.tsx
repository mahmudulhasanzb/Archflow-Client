'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { RECOMMENDED_AGENT_PROMPT } from '@/lib/constants/agentPrompt';

export default function RecommendedPromptCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(RECOMMENDED_AGENT_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6 space-y-3 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">
              Recommended Prompt
            </h3>
            <span className="text-[11px] text-muted-foreground">
              Works across Cursor, Claude Code, Antigravity, and Windsurf
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-xs shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        After downloading your blueprint, copy this prompt and paste it into your coding agent to start building automatically.
      </p>

      <div className="rounded-xl bg-muted/40 border border-border/80 p-4 font-mono text-xs text-foreground max-h-[300px] overflow-y-auto">
        <pre className="whitespace-pre-wrap leading-relaxed">
          {RECOMMENDED_AGENT_PROMPT}
        </pre>
      </div>
    </div>
  );
}
