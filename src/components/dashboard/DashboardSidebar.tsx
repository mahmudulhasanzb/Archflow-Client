'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  FolderHeart,
  Activity,
  ChevronDown,
  LogOut,
  User,
  Compass,
  Home,
} from 'lucide-react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const menuItems = [
  { label: 'Overview', href: '/workspace', icon: LayoutDashboard },
  { label: 'New Blueprint', href: '/add-blueprint', icon: PlusCircle },
  { label: 'My Blueprints', href: '/manage-blueprints', icon: FolderHeart },
  { label: 'Explore Gallery', href: '/blueprints', icon: Compass },
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
  const router = useRouter();
  const pathname = usePathname();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsUserDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 150);
  };

  const handleDropdownClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleSignOut = async () => {
    const toastId = toast.loading('Signing out...');
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed out successfully!', { id: toastId });
            router.push('/signin');
          },
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('Sign out failed.', { id: toastId });
    }
  };

  const isPro =
    (user as any)?.role?.toLowerCase() === 'pro' ||
    (user as any)?.role?.toLowerCase() === 'admin' ||
    (user as any)?.plan?.toLowerCase() === 'pro';

  const roleLabel = isPro ? 'Pro Developer' : 'Free Tier';

  return (
    <aside className="fixed inset-y-0 left-0 w-64 h-screen bg-white dark:bg-[#090C15] border-r border-[#E1E4EA] dark:border-[#1E2638] flex flex-col justify-between z-40 select-none transition-colors">
      {/* Brand Header & Navigation */}
      <div>
        {/* Brand Header */}
        <div className="h-16 md:h-20 border-b border-[#E1E4EA] dark:border-[#1E2638] flex items-center px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 group-hover:scale-105 transition-transform duration-200">
              <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-[#181B20] dark:text-white font-extrabold text-xl tracking-wider select-none font-display">
              ARCHFLOW
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
              Studio
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
          <div className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF]/60 uppercase tracking-widest px-3 mb-2">
            Navigation
          </div>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 group border ${
                  active
                    ? 'bg-indigo-50/80 dark:bg-[#141A29] border-indigo-200/70 dark:border-[#222C43] text-indigo-600 dark:text-white'
                    : 'bg-transparent border-transparent text-[#6B7280] dark:text-[#9CA3AF]/70 hover:text-[#181B20] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#141A29]/50'
                }`}
              >
                <IconComponent
                  className={`h-4.5 w-4.5 transition-colors duration-200 ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-[#6B7280] dark:text-[#9CA3AF]/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`}
                />
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-lg shadow-indigo-500/50" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-[#E1E4EA] dark:border-[#1E2638] bg-slate-50/60 dark:bg-[#070A11]/60 relative">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Popover Dropdown popping UP */}
            {isUserDropdownOpen && (
              <div
                className="absolute bottom-full left-0 mb-2.5 w-56 bg-white dark:bg-[#0E1321] border border-[#E1E4EA] dark:border-[#1E2638] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-2 border-b border-[#E1E4EA] dark:border-[#1E2638] mb-1">
                  <p className="text-[#181B20] dark:text-white text-xs font-bold truncate">
                    {user.name}
                  </p>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] text-[10px] truncate">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-[#141A29] transition-all duration-200"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <Home className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Archflow Home</span>
                </Link>
                <Link
                  href="/blueprints"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-[#141A29] transition-all duration-200"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <Compass className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Explore Blueprints</span>
                </Link>
                <div className="border-t border-[#E1E4EA] dark:border-[#1E2638] pt-1 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Profile Info Card Trigger */}
            <div
              className="flex items-center gap-3 p-2 rounded-2xl bg-white dark:bg-[#141A29]/60 border border-[#E1E4EA] dark:border-[#1E2638] cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-50/40 dark:hover:bg-[#141A29] transition-all duration-200"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleDropdownClick}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center border border-indigo-400/40 shrink-0 text-white text-xs font-bold">
                {user.image ? (
                  <Image
                    width={100}
                    height={100}
                    src={user.image}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#181B20] dark:text-white text-xs font-bold truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {roleLabel}
                </p>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#6B7280] dark:text-[#9CA3AF] transition-transform duration-300 shrink-0 ${
                  isUserDropdownOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                }`}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white dark:bg-[#141A29]/60 border border-[#E1E4EA] dark:border-[#1E2638] animate-pulse">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

