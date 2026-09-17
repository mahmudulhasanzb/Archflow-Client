'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Code2, Shield, Bot } from 'lucide-react';

const FAQS = [
  {
    q: 'What is an Archflow technical blueprint?',
    a: 'An Archflow blueprint is an end-to-end technical architectural plan synthesized from a plain-text prompt. It includes Mongoose/Postgres database schema definitions, an implementation task checklist, OpenAPI 3.0 specs, code boilerplate stubs, and a security compliance audit.',
    icon: Code2,
  },
  {
    q: 'How do the 4 autonomous agents collaborate?',
    a: 'The 4 agents (Architect, Planner, Documenter, Reviewer) execute over a shared session object. The Architect defines data models; the Planner reads the schemas to create implementation tasks; the Documenter builds setup stubs; and the Reviewer verifies schema integrity and security rules.',
    icon: Bot,
  },
  {
    q: 'Can I bring my own LLM API keys?',
    a: 'Yes! Pro users can connect custom API keys for OpenAI, Anthropic Claude, or Google Gemini to tune agent model sizes and token limits.',
    icon: Shield,
  },
  {
    q: 'Can I export blueprints to my local codebase?',
    a: 'Absolutely. You can copy generated schema code directly, export OpenAPI JSON definitions, or download complete project folder templates to jumpstart your build.',
    icon: Code2,
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
