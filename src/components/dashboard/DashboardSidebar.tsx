'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { LayoutDashboard, PlusCircle, FolderHeart, LogOut, Activity } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard',      href: '/workspace',         icon: LayoutDashboard },
  { name: 'New Blueprint',  href: '/add-blueprint',     icon: PlusCircle },
  { name: 'My Blueprints',  href: '/manage-blueprints', icon: FolderHeart },
];

function getInitials(name?: string | null) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push('/'),
      },
    });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[#E1E4EA] bg-white dark:bg-[#0E1321] dark:border-[#222C43]">
      {/* Brand header */}
      <div className="flex h-16 items-center border-b border-[#E1E4EA] dark:border-[#222C43] px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-[#181B20] dark:text-[#F3F4F6] font-display"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF0FF]">
            <Activity className="h-4.5 w-4.5 text-[#4F46E5]" />
          </div>
          <span>Archflow</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
          Workspace
        </p>
        {menuItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#EEF0FF] text-[#4F46E5] shadow-sm'
                  : 'text-[#6B7280] hover:bg-[#F1F3F6] hover:text-[#181B20] dark:hover:bg-[#171E30] dark:hover:text-[#F3F4F6]'
              }`}
            >
              {/* Active left indicator */}
              <span
                className={`absolute left-0 h-6 w-1 rounded-r-full bg-[#4F46E5] transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <Icon className="h-4 w-4 shrink-0" />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-[#E1E4EA] dark:border-[#222C43] p-4 space-y-3">
        {/* User info */}
        {session?.user && (
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
              {getInitials(session.user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#181B20] dark:text-[#F3F4F6]">
                {session.user.name || 'User'}
              </p>
              <p className="truncate text-[10px] text-[#6B7280]">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#EA5C34] hover:bg-[#FFF0EA] dark:hover:bg-[#EA5C34]/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
