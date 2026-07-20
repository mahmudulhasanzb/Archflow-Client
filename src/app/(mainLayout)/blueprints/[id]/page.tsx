'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Cpu,
  Layers,
  Layout,
  ShieldAlert,
  Calendar,
  Star,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function BlueprintDetailsPage() {
  const params = useParams();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] hover:text-[#181B20] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
        </Link>
      </div>

      {/* Main Title Section */}
      <div className="border-b border-[#E1E4EA] pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#181B20] font-display">
             title
            </h1>
            <p className="text-sm text-[#6B7280] mt-2 max-w-3xl">
             description
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#4F46E5]">
             stack
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F5F3] px-3 py-1 text-xs font-semibold text-[#0D9488]">
             complexity
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-[#6B7280] font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Created: 2026-07-21
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-[#D97706] fill-[#D97706]" />
            Rating: 4.8
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
            Status: completed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E1E4EA] mb-8">
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-xl border border-[#E1E4EA] p-8 shadow-sm min-h-[300px]">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#181B20] font-display">
              Project Description
            </h2>
            <p className="text-[#6B7280] leading-relaxed text-sm whitespace-pre-line">
              
            </p>

            <div className="pt-6 border-t border-[#E1E4EA] grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-bold text-[#181B20] font-display">
                  Target Stack
                </h3>
                <p className="text-[#6B7280] mt-1">stack</p>
              </div>
              <div>
                <h3 className="font-bold text-[#181B20] font-display">
                  Complexity Reference
                </h3>
                <p className="text-[#6B7280] mt-1">
                  Level
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
