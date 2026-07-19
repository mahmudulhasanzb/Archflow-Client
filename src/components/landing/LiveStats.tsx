import React from 'react';

export default function LiveStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA] bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-extrabold text-[#4F46E5] font-display">12,500+</div>
          <div className="text-sm text-[#6B7280] mt-2">Blueprints Generated</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-[#0D9488] font-display">50,000+</div>
          <div className="text-sm text-[#6B7280] mt-2">Developer Hours Saved</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-[#EA5C34] font-display">99.8%</div>
          <div className="text-sm text-[#6B7280] mt-2">Valid Schemas Created</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-[#181B20] font-display">4 Agent</div>
          <div className="text-sm text-[#6B7280] mt-2">Collab Pipeline</div>
        </div>
      </div>
    </section>
  );
}
