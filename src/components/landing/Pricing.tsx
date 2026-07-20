import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA] bg-white">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">
          Simple Pricing
        </h2>
        <p className="mt-4 text-[#6B7280]">
          Start building for free, or unlock advanced features with Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="p-8 rounded-xl border border-[#E1E4EA] flex flex-col justify-between space-y-6 bg-white hover:border-[#6B7280] transition-colors">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#181B20] font-display">
              Free Starter
            </h3>
            <div className="text-4xl font-extrabold text-[#181B20] font-display">
              $0
            </div>
            <p className="text-xs text-[#6B7280]">
              Perfect for exploring AI architecture concepts.
            </p>
            <ul className="space-y-2 text-sm text-[#6B7280] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A] flex-shrink-0" />{' '}
                Generate up to 3 blueprints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A] flex-shrink-0" />{' '}
                Standard 4-agent simulation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A] flex-shrink-0" />{' '}
                Public gallery listing
              </li>
            </ul>
          </div>
          <Link
            href="/signup"
            className="block text-center rounded-lg bg-[#F1F3F6] border border-[#E1E4EA] py-2.5 text-sm font-semibold text-[#181B20] hover:bg-[#e4e7eb] transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="p-8 rounded-xl border border-[#4F46E5] bg-[#4F46E5]/[0.02] flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#4F46E5] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg font-display">
            Popular
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#181B20] font-display">
              Developer Pro
            </h3>
            <div className="text-4xl font-extrabold text-[#181B20] font-display">
              $29<span className="text-sm font-normal text-[#6B7280]">/mo</span>
            </div>
            <p className="text-xs text-[#6B7280]">
              For professional builders and engineering teams.
            </p>
            <ul className="space-y-2 text-sm text-[#6B7280] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] flex-shrink-0" />{' '}
                Unlimited blueprint generations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] flex-shrink-0" />{' '}
                Pluggable LLM provider credentials
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] flex-shrink-0" />{' '}
                Custom private blueprints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] flex-shrink-0" />{' '}
                Interactive code stubs download
              </li>
            </ul>
          </div>
          <Link
            href="/signup"
            className="block text-center rounded-lg bg-[#4F46E5] py-2.5 text-sm font-semibold text-white hover:bg-[#3f37c9] transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </section>
  );
}
