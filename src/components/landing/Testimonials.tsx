import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "Archflow saves me hours of boilerplate planning. Within seconds I get a solid data model and roadmap that actually makes sense.",
      author: "Sarah Jenkins",
      role: "Lead Engineer at TechCorp"
    },
    {
      quote: "The 4-agent review loop found a major schema design flaw before we started coding. This tool is a permanent addition to our workflow.",
      author: "David Miller",
      role: "Solutions Architect"
    },
    {
      quote: "Simple, intuitive, and visually clean. The custom stubs generated compile instantly without typing errors.",
      author: "Kenji Sato",
      role: "Full Stack Developer"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">What Developers Say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <div key={idx} className="p-6 bg-white rounded-xl border border-[#E1E4EA] space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-[#6B7280] italic">
              "{rev.quote}"
            </p>
            <div>
              <h4 className="text-sm font-bold text-[#181B20] font-display">{rev.author}</h4>
              <p className="text-xs text-[#6B7280]">{rev.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
