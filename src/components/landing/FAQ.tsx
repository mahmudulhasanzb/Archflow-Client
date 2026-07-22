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
    a: 'Yes! Developer Pro users can connect custom API keys for OpenAI, Anthropic Claude, or Google Gemini to tune agent model sizes and token limits.',
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

  return (
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] dark:bg-[#4F46E5]/15 border border-[#4F46E5]/30 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          Got Questions?
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#181B20] dark:text-[#F3F4F6] font-display">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
          Everything you need to know about Archflow and multi-agent blueprint generation.
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
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white dark:bg-[#0E1321] border-[#4F46E5] shadow-md'
                  : 'bg-white/70 dark:bg-[#0E1321]/60 border-[#E1E4EA] dark:border-[#222C43] hover:border-[#4F46E5]/40'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-6 text-left font-bold text-[#181B20] dark:text-[#F3F4F6] font-display gap-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-[#4F46E5] shrink-0" />
                  <span className="text-base">{faq.q}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-[#6B7280] dark:text-[#9CA3AF] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#4F46E5]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0 text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed border-t border-[#E1E4EA]/60 dark:border-[#222C43]/60 bg-[#FAFBFC]/50 dark:bg-[#090C15]/50">
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
