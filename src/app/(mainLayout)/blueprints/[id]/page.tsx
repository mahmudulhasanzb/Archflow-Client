import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { serverFetch } from '@/lib/api/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlueprintDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const blueprint = await serverFetch(`/api/blueprints/${resolvedParams.id}`);

  if (!blueprint) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-red-600 font-display">Blueprint not found</h2>
        <Link href="/blueprints" className="mt-4 inline-block text-indigo-600 hover:underline text-sm font-semibold">
          Back to Explore
        </Link>
      </div>
    );
  }

  const stackString = Array.isArray(blueprint.teckStack) 
    ? blueprint.teckStack.join(' + ') 
    : blueprint.teckStack || '';

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
              {blueprint.title}
            </h1>
            <p className="text-sm text-[#6B7280] mt-2 max-w-3xl">
              {blueprint.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              {stackString}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F5F3] px-3 py-1 text-xs font-semibold text-[#0D9488]">
              {blueprint.complexcity}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-[#6B7280] font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Created: {blueprint.createdAt ? new Date(blueprint.createdAt).toLocaleDateString() : 'N/A'}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-[#D97706] fill-[#D97706]" />
            Rating: {blueprint.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
            Status: {blueprint.status}
          </span>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-xl border border-[#E1E4EA] p-8 shadow-sm min-h-[300px] space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#181B20] font-display">
            Architecture Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-[#181B20] font-display text-sm">
                {blueprint.architectureFlow?.architecture?.title || 'Architecture'}
              </h3>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                {blueprint.architectureFlow?.architecture?.description || 'N/A'}
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-[#181B20] font-display text-sm">
                {blueprint.architectureFlow?.features?.title || 'Features'}
              </h3>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                {blueprint.architectureFlow?.features?.description || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-[#181B20] font-display text-sm">
                {blueprint.architectureFlow?.plan?.title || 'Implementation Plan'}
              </h3>
              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                {blueprint.architectureFlow?.plan?.description || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E1E4EA] grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-bold text-[#181B20] font-display">
              Target Stack
            </h3>
            <p className="text-[#6B7280] mt-1">{stackString}</p>
          </div>
          <div>
            <h3 className="font-bold text-[#181B20] font-display">
              Complexity Reference
            </h3>
            <p className="text-[#6B7280] mt-1">
              {blueprint.complexcity} Level
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
