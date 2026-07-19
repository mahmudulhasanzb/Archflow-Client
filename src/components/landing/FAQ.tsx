'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is a blueprint?",
      a: "A blueprint is a comprehensive technical plan generated for a software idea. It contains detailed database schema definitions, an implementation task roadmap, API stubs/documentation, and an architectural review."
    },
    {
      q: "How do the 4 agents collaborate?",
      a: "Each agent reads from and writes to a shared session object in MongoDB. The Architect sets the database schemas. The Planner reads the schema and writes the tasks. The Documenter reads both to generate setup guides. Finally, the Reviewer performs QA and audits for contradictions."
    },
    {
      q: "Can I use my own LLM keys?",
      a: "Yes, Developer Pro accounts allow configuring custom API keys for OpenAI, Gemini, or Claude to run the pipeline using specific model sizes."
    }
  ];

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight text-[#181B20] text-center mb-12 font-display">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-[#E1E4EA] overflow-hidden">
            <button
              onClick={() => toggleFaq(idx)}
              className="w-full flex justify-between items-center p-5 text-left font-semibold text-[#181B20] hover:bg-[#F1F3F6]/50 transition-colors font-display"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`h-4 w-4 text-[#6B7280] transition-transform ${faqOpen === idx ? 'rotate-180' : ''}`} />
            </button>
            {faqOpen === idx && (
              <div className="p-5 pt-0 text-sm text-[#6B7280] border-t border-[#E1E4EA] bg-[#FAFBFC]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
