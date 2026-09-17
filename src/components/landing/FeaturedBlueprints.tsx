'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import BlueprintCard, { Blueprint } from '@/components/blueprint/BlueprintCard';
import { getAllBlueprints } from '@/lib/api/server';

export default function FeaturedBlueprints() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        setLoading(true);
        // Fetch top 3 most downloaded blueprints directly from database
        const res = await getAllBlueprints({ limit: 3, sort: 'downloads' });
        const list = res?.blueprints || (Array.isArray(res) ? res : []);
        if (isMounted && Array.isArray(list)) {
          setBlueprints(list.slice(0, 3));
        }
      } catch (error) {
        console.error(
          'Failed to load featured blueprints from database:',
          error,
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="featured"
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-border"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border px-3.5 py-1 text-xs font-mono font-medium text-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Community Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
            Featured Blueprints
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            Explore highest-ranked and most-downloaded production architectures
            from the database.
          </p>
        </div>
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline shrink-0"
        >
          View All Blueprints
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid: 3 Most Downloaded Blueprints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(idx => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs animate-pulse flex flex-col justify-between h-[300px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="space-y-1">
                      <div className="h-3 w-20 rounded bg-muted" />
                      <div className="h-2 w-12 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-muted" />
                </div>
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </div>
                <div className="flex gap-1.5 pt-2">
                  <div className="h-5 w-14 rounded-md bg-muted" />
                  <div className="h-5 w-16 rounded-md bg-muted" />
                </div>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            </div>
          ))
        ) : blueprints.length > 0 ? (
          blueprints.map(bp => <BlueprintCard key={bp._id} blueprint={bp} />)
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
            No blueprints found in the database.
          </div>
        )}
      </div>
    </section>
  );
}
