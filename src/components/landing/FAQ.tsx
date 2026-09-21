'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Code2, Shield, Layers, Download } from 'lucide-react';

const FAQS = [
  {
    q: 'What is an Archflow technical blueprint suite?',
    a: 'An Archflow blueprint is a deterministic 6-file architecture contract synthesized from your project concept. It outputs projectOverview.md, PRD.md, architecture.md, design.md, rules.md, and executionPlan.md for Cursor, Claude Code, Antigravity, and Windsurf.',
    icon: Code2,
  },
  {
    q: 'How does the multi-stage AI generation pipeline work?',
    a: 'Archflow executes a sequential 6-stage synthesis pipeline. Each stage builds on the previous output to prevent architectural drift—generating the overview first, deriving exact PRD requirements, structuring schemas and APIs, defining UI tokens, enforcing strict guardrails (rules.md), and formulating the execution plan.',
    icon: Layers,
  },
  {
    q: 'How do I use generated blueprints in Cursor or Claude Code?',
    a: 'Download the entire blueprint suite as an organized .zip archive with 1-click. Extract the markdown files into your local project root or .planning directory, and your AI coding assistant can follow the explicit specs without hallucinating.',
    icon: Download,
  },
  {
    q: 'What is the difference between Free Starter and Pro plans?',
    a: 'Free Starter allows generating up to 3 community blueprints with public gallery access. Pro ($29/mo or $24/mo billed annually) unlocks 10 daily blueprints, private blueprints, custom LLM API keys (OpenAI, Claude, Gemini), and priority queues.',
    icon: Shield,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border px-3.5 py-1 text-xs font-mono font-medium text-foreground uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          Got Questions?
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-muted-foreground">
          Everything you need to know about Archflow and multi-agent blueprint
          generation.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = faq.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl border border-border transition-all duration-500 overflow-hidden ${
                isOpen
                  ? 'bg-card border-foreground shadow-sm'
                  : 'bg-card/60 border-border hover:border-foreground/30'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-6 text-left font-bold text-foreground font-display gap-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-foreground shrink-0" />
                  <span className="text-base">{faq.q}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-foreground' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
                  <div className="pt-4">{faq.a}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
