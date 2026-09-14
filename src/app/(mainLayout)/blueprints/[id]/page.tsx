import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { serverFetch } from '@/lib/api/server';
import BlueprintViewer from '@/components/blueprint/BlueprintViewer';
import RatingWidget from '@/components/blueprint/RatingWidget';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlueprintDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;

  // Enforce authentication for blueprint details
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect(`/signin?callbackUrl=/blueprints/${resolvedParams.id}`);
  }

  // Forward user session headers to backend so owner can view their private blueprints
  const blueprint = await serverFetch(`/api/blueprints/${resolvedParams.id}`, {
    headers: {
      'x-user-email': session.user.email || '',
      'x-user-id': session.user.id || '',
    },
  });

  if (!blueprint || blueprint.error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4 flex-grow">
        <h2 className="text-2xl font-bold text-rose-600 font-display">
          {blueprint?.error || 'Blueprint not found'}
        </h2>
        <p className="text-xs text-[#6B7280]">
          The requested blueprint may be private to another account or deleted.
        </p>
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
        </Link>
      </div>
    );
  }

  const stackString = Array.isArray(blueprint.teckStack)
    ? blueprint.teckStack.join(' + ')
    : blueprint.teckStack || 'Full-Stack';

  // Mask or clean author display
  const authorName = blueprint.author
    ? blueprint.author.includes('@')
      ? blueprint.author.split('@')[0]
      : blueprint.author
    : 'Verified Architect';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#181B20] dark:text-[#9CA3AF] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
        </Link>
      </div>

      {/* Main Title Header Section */}
      <div className="border-b border-[#E1E4EA] dark:border-[#222C43] pb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#181B20] dark:text-[#F3F4F6] font-display">
              {blueprint.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              {blueprint.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {stackString}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              {blueprint.complexcity || 'Medium'}
            </span>
          </div>
        </div>

        {/* Metadata & Interactive Rating Bar */}
        <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            Created:{' '}
            {blueprint.createdAt
              ? new Date(blueprint.createdAt).toLocaleDateString()
              : 'N/A'}
          </span>

          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Status: {blueprint.status || 'ready'}
          </span>

          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-400" />
            Architect: <strong className="text-[#181B20] dark:text-white capitalize">{authorName}</strong>
          </span>

          {/* Dynamic Interactive Rating */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">Rating:</span>
            <RatingWidget
              blueprintId={String(blueprint._id)}
              initialRating={typeof blueprint.rating === 'number' ? blueprint.rating : 5}
              initialCount={blueprint.ratingsCount || (blueprint.ratings?.length) || 1}
            />
          </div>
        </div>
      </div>

      {/* 5-File Blueprint Suite & Export Viewer */}
      <BlueprintViewer blueprint={blueprint} />
    </div>
  );
}
