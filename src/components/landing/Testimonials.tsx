import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    quote:
      'Archflow saves our engineering team days of manual setup. In seconds, we get valid database schemas and an actionable task roadmap.',
    author: 'Sarah Jenkins',
    role: 'Staff Solutions Architect',
    company: 'TechScale Inc.',
    rating: 5,
    stack: 'Next.js & PostgreSQL',
  },
  {
    quote:
      'The Reviewer agent caught a critical indexing oversight and missing foreign keys before we even started writing code. Essential tool for modern teams.',
    author: 'David Miller',
    role: 'Principal Engineer',
    company: 'DevFlow Systems',
    rating: 5,
    stack: 'Node.js & MongoDB',
  },
  {
    quote:
      'Clean interface, instant code stubs, and perfect OpenAPI specifications. It has completely transformed our sprint estimation workflow.',
    author: 'Kenji Sato',
    role: 'Full Stack Tech Lead',
    company: 'CloudMatrix Studio',
    rating: 5,
    stack: 'Docker & Redis',
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-[#E1E4EA] dark:border-[#222C43]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] dark:bg-[#4F46E5]/15 border border-[#4F46E5]/30 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
          Developer Testimonials
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#181B20] dark:text-[#F3F4F6] font-display">
          Loved by Architects & Lead Engineers
        </h2>
        <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
          See how engineering leaders use Archflow to standardise specs and accelerate project launches.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {REVIEWS.map((rev, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0E1321] border border-[#E1E4EA] dark:border-[#222C43] shadow-sm hover:shadow-xl transition-all duration-300 relative"
          >
            <div className="space-y-4">
              {/* Star Rating & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-[#4F46E5]/20" />
              </div>

              {/* Quote text */}
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed italic">
                "{rev.quote}"
              </p>
            </div>

            {/* Author info & stack pill */}
            <div className="mt-6 pt-4 border-t border-[#E1E4EA]/80 dark:border-[#222C43]/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#181B20] dark:text-[#F3F4F6] font-display flex items-center gap-1.5">
                  {rev.author}
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4F46E5]" />
                </h4>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  {rev.role} • {rev.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
