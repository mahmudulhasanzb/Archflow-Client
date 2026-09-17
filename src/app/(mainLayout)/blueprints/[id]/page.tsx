import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { serverFetch } from '@/lib/api/server';
import BlueprintViewer from '@/components/blueprint/BlueprintViewer';
import BlueprintHeader from '@/components/blueprint/BlueprintHeader';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlueprintDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;

  // Check optional session for private blueprint ownership
  const headersList = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: headersList,
    });
  } catch (err) {
    // Guest visitor
  }

  // Forward user session headers to backend so owner can view their private blueprints
  const blueprint = await serverFetch(`/api/blueprints/${resolvedParams.id}`, {
    headers: {
      'x-user-email': session?.user?.email || '',
      'x-user-id': session?.user?.id || '',
    },
  });

  if (!blueprint || blueprint.error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4 flex-grow">
        <h2 className="text-2xl font-bold text-destructive font-display">
          {blueprint?.error || 'Blueprint not found'}
        </h2>
        <p className="text-xs text-muted-foreground">
          The requested blueprint may be private to another account or deleted.
        </p>
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8 flex-grow space-y-4 w-full min-w-0">
      {/* Dynamic Header with Actions, Author & Telemetry */}
      <BlueprintHeader blueprint={blueprint} />

      {/* 5-File Blueprint Suite & Export Viewer */}
      <BlueprintViewer blueprint={blueprint} />
    </div>
  );
}
