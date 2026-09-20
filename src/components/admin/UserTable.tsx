'use client';

import React from 'react';
import { Layers, ArrowUpDown, Ban, CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { AdminUser } from '@/lib/api/admin/data';

interface UserTableProps {
  users: AdminUser[];
  loading?: boolean;
  onToggleBlock: (user: AdminUser) => void;
  onToggleRole: (user: AdminUser) => void;
  onOpenRoleChangeModal: (user: AdminUser, targetRole: 'admin' | 'user') => void;
  actionLoadingId: string | null;
  currentUserEmail?: string;
}

export default function UserTable({
  users,
  loading = false,
  onToggleBlock,
  onToggleRole,
  onOpenRoleChangeModal,
  actionLoadingId,
  currentUserEmail,
}: UserTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role / Plan</th>
              <th className="py-3 px-4">Blueprints</th>
              <th className="py-3 px-4">Generation Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  No users match current criteria.
                </td>
              </tr>
            ) : (
              users.map(u => {
                const isTargetLoading = actionLoadingId === u._id;
                const isUserAdmin = u.role === 'admin';
                const isSelf = currentUserEmail
                  ? u.email.toLowerCase() === currentUserEmail.toLowerCase()
                  : false;

                return (
                  <tr
                    key={u._id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* User Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs uppercase border border-primary/20">
                          {u.name ? u.name.slice(0, 2) : u.email.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate flex items-center gap-1.5">
                            <span>{u.name || 'Anonymous User'}</span>
                            {isUserAdmin && (
                              <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[9px] font-mono text-primary font-bold">
                                ADMIN
                              </span>
                            )}
                            {isSelf && (
                              <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground font-medium border border-border">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate font-mono">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role / Plan Column */}
                    <td className="py-3.5 px-4">
                      {isUserAdmin ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/30">
                          Admin (Unlimited)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onToggleRole(u)}
                          disabled={isTargetLoading}
                          title="Click to toggle between Free and Pro"
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition-all border ${
                            u.role === 'pro'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          <span>{u.role.toUpperCase()}</span>
                          <ArrowUpDown className="h-2.5 w-2.5 opacity-60" />
                        </button>
                      )}
                    </td>

                    {/* Blueprint Count */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 text-xs font-mono text-foreground font-semibold">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{u.blueprintCount}</span>
                      </div>
                    </td>

                    {/* Generation Status */}
                    <td className="py-3.5 px-4">
                      {isUserAdmin ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>UNLIMITED</span>
                        </span>
                      ) : u.isGenerationBlocked ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span>RESTRICTED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-right">
                      {isUserAdmin ? (
                        isSelf ? (
                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] text-muted-foreground font-mono bg-muted/40 rounded-lg border border-border/50">
                            Current Account
                          </span>
                        ) : (
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenRoleChangeModal(u, 'user')}
                              disabled={isTargetLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 disabled:opacity-50"
                              title="Revoke administrator privileges"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span>Demote to User</span>
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenRoleChangeModal(u, 'admin')}
                            disabled={isTargetLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50"
                            title="Promote to administrator"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Make Admin</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleBlock(u)}
                            disabled={isTargetLoading}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                              u.isGenerationBlocked
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20'
                            } disabled:opacity-50`}
                          >
                            {u.isGenerationBlocked ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <Ban className="h-3.5 w-3.5" />
                                <span>Soft-Block</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
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
