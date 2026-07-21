import React from 'react';
import { FileCode2, Clock3, CheckCircle2, Bot } from 'lucide-react';

const stats = [
  {
    icon: FileCode2,
    value: '12,500+',
    label: 'Blueprints Generated',
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
  },
  {
    icon: Clock3,
    value: '50,000+',
    label: 'Developer Hours Saved',
    accent: '#0D9488',
    accentSoft: '#E6F5F3',
  },
  {
    icon: CheckCircle2,
    value: '99.8%',
    label: 'Valid Schemas Created',
    accent: '#EA5C34',
    accentSoft: '#FFF0EA',
  },
  {
    icon: Bot,
    value: '4 Agents',
    label: 'Collaboration Pipeline',
    accent: '#16A34A',
    accentSoft: '#E7F7EC',
  },
];

export default function LiveStats() {
  return (
    <section className="border-b border-[#E1E4EA] relative overflow-hidden">
      {/* Gradient strip background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#EEF0FF]/60 via-white to-[#E6F5F3]/40 pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
            Platform Impact
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#181B20] font-display">
            Trusted by Builders Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, accent, accentSoft }, i) => (
            <div
              key={label}
              className={`card-hover flex flex-col items-center gap-4 rounded-xl border border-[#E1E4EA] bg-white p-6 text-center shadow-sm animate-slide-up-${Math.min(i + 1, 4)}`}
            >
              {/* Icon */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: accentSoft }}
              >
                <Icon className="h-6 w-6" style={{ color: accent }} />
              </div>

              {/* Value */}
              <div
                className="text-3xl font-extrabold font-display leading-none"
                style={{ color: accent }}
              >
                {value}
              </div>

              {/* Label */}
              <div className="text-xs font-semibold text-[#6B7280] leading-snug">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
