import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center border-b border-[#E1E4EA] bg-gradient-to-b from-[#EEF0FF]/30 to-[#FAFBFC] px-4 py-16 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3.5 py-1 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Driven Architecture
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#181B20] sm:text-6xl font-display">
          From Idea to Technical{' '}
          <span className="text-[#4F46E5]">Blueprint</span> in Seconds
        </h1>
        <p className="mx-auto max-w-2xl text-base text-[#6B7280]">
          An AI Software Architect: a team of specialized agents turn your
          one-paragraph project description into schemas, roadmaps, setup
          scripts, and reviews.
        </p>
      </div>
    </section>
  );
}
