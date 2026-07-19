'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { LayoutDashboard, PlusCircle, FolderHeart, LogOut, Activity } from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        }
      }
    });
  };

  const menuItems = [
    { name: 'Dashboard Home', href: '/workspace', icon: LayoutDashboard },
    { name: 'New Blueprint', href: '/blueprints/add', icon: PlusCircle },
    { name: 'My Blueprints', href: '/blueprints/manage', icon: FolderHeart },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[#E1E4EA] bg-white">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-[#E1E4EA] px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#181B20] font-display">
          <Activity className="h-5 w-5 text-[#4F46E5]" />
          <span>Archflow Workspace</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#EEF0FF] text-[#4F46E5]'
                  : 'text-[#6B7280] hover:bg-[#F1F3F6] hover:text-[#181B20]'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Action */}
      <div className="border-t border-[#E1E4EA] p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#EA5C34] hover:bg-[#FFF0EA] transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
