'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Lock,
  Star,
  ExternalLink,
  Trash2,
  Layers,
  Eye,
  Download,
} from 'lucide-react';
import { AdminBlueprint } from '@/lib/api/admin/data';

interface AdminBlueprintTableProps {
  blueprints: AdminBlueprint[];
  loading?: boolean;
  onToggleVisibility: (blueprint: AdminBlueprint) => void;
  onDelete: (blueprint: AdminBlueprint) => void;
  actionLoadingId: string | null;
}

export default function AdminBlueprintTable({
  blueprints,
  loading = false,
  onToggleVisibility,
  onDelete,
  actionLoadingId,
}: AdminBlueprintTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3 px-4">Blueprint</th>
              <th className="py-3 px-4">Author / Creator</th>
              <th className="py-3 px-4">Visibility</th>
              <th className="py-3 px-4">Engagement</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading blueprints...</span>
                  </div>
                </td>
              </tr>
            ) : blueprints.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  No blueprints found matching current criteria.
                </td>
              </tr>
            ) : (
              blueprints.map(bp => {
                const isTargetLoading = actionLoadingId === bp._id;
                const isPublic = bp.visibility === 'public';

                return (
                  <tr key={bp._id} className="hover:bg-muted/20 transition-colors">
                    {/* Blueprint Title & Stack */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold border border-primary/20 mt-0.5">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">
                            {bp.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate line-clamp-1 mt-0.5">
                            {bp.description || 'No description provided'}
                          </div>
                          {bp.teckStack && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(Array.isArray(bp.teckStack)
                                ? bp.teckStack
                                : typeof bp.teckStack === 'string'
                                  ? bp.teckStack.split(',')
                                  : []
                              )
                                .slice(0, 3)
                                .map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              {(Array.isArray(bp.teckStack)
                                ? bp.teckStack.length
                                : typeof bp.teckStack === 'string'
                                  ? bp.teckStack.split(',').length
                                  : 0) > 3 && (
                                <span className="text-[9px] font-mono text-muted-foreground self-center">
                                  +
                                  {(Array.isArray(bp.teckStack)
                                    ? bp.teckStack.length
                                    : typeof bp.teckStack === 'string'
                                      ? bp.teckStack.split(',').length
                                      : 0) - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Author / Creator */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-foreground">
                      <div className="truncate max-w-[160px]" title={bp.email || bp.author}>
                        {bp.email || bp.author}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-sans mt-0.5">
                        {bp.createdAt
                          ? new Date(bp.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </div>
                    </td>

                    {/* Visibility Moderation Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleVisibility(bp)}
                        disabled={isTargetLoading}
                        title={`Click to switch to ${isPublic ? 'Private' : 'Public'}`}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-all border ${
                          isPublic
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {isPublic ? (
                          <>
                            <Globe className="h-3 w-3" />
                            <span>PUBLIC</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3" />
                            <span>PRIVATE</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Engagement / Metrics */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1" title="Rating">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-foreground">
                            {bp.rating > 0 ? bp.rating.toFixed(1) : '—'}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1" title="Views">
                          <Eye className="h-3 w-3" />
                          <span>{bp.views}</span>
                        </span>
                        <span className="inline-flex items-center gap-1" title="Downloads">
                          <Download className="h-3 w-3" />
                          <span>{bp.downloads}</span>
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Direct Link to blueprint detail */}
                        <Link
                          href={`/blueprints/${bp._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="View Blueprint Public Page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        {/* Purge / Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDelete(bp)}
                          disabled={isTargetLoading}
                          className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Purge / Delete Blueprint"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
