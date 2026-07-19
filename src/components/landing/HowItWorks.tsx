import React from 'react';

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">How It Works</h2>
        <p className="mt-4 text-[#6B7280]">
          Translate your rough ideas into robust, professional development plans in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4 p-6 bg-white rounded-xl border border-[#E1E4EA]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF0EA] text-[#EA5C34]">
            <span className="font-bold text-lg font-display">1</span>
          </div>
          <h3 className="text-lg font-bold text-[#181B20] font-display">Submit Your Idea</h3>
          <p className="text-sm text-[#6B7280]">
            Input a simple paragraph describing your application needs, stack preferences, and core specifications.
          </p>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-xl border border-[#E1E4EA]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#4F46E5]">
            <span className="font-bold text-lg font-display">2</span>
          </div>
          <h3 className="text-lg font-bold text-[#181B20] font-display">Orchestrate Team</h3>
          <p className="text-sm text-[#6B7280]">
            Our specialized AI agents sequentially design structures, outline timelines, write code stubs, and review details.
          </p>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-xl border border-[#E1E4EA]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F5F3] text-[#0D9488]">
            <span className="font-bold text-lg font-display">3</span>
          </div>
          <h3 className="text-lg font-bold text-[#181B20] font-display">Export Blueprint</h3>
          <p className="text-sm text-[#6B7280]">
            Download or view complete database schemas, API specs, interactive task checklists, and security audit reports.
          </p>
        </div>
      </div>
    </section>
  );
}
