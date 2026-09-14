'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Activity,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import Image from 'next/image';

function getInitials(name?: string | null) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
    const activeTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(activeTheme);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

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

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const navLinks = [
    { label: 'Explore', href: '/blueprints' },
    { label: 'Docs', href: '/docs' },
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  if (user) {
    navLinks.push({ label: 'Dashboard', href: '/workspace' });
  }

  const isLinkActive = (href: string) => pathname === href;

  const isPro =
    (user as any)?.role?.toLowerCase() === 'pro' ||
    (user as any)?.role?.toLowerCase() === 'admin' ||
    (user as any)?.plan?.toLowerCase() === 'pro';

  return (
    <nav className="w-full bg-white/95 dark:bg-[#090C15]/95 border-b border-[#E1E4EA] dark:border-[#1E2638] sticky top-0 z-50 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 group-hover:scale-105 transition-transform duration-200">
                <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[#181B20] dark:text-white font-extrabold text-xl tracking-wider select-none font-display">
                ARCHFLOW
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 transition-all duration-300">
            {navLinks.map(link => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[14px] font-medium transition-all duration-200 py-2 ${
                    active
                      ? 'text-indigo-600 dark:text-white font-semibold'
                      : 'text-[#6B7280] dark:text-[#9CA3AF]/80 hover:text-[#181B20] dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full bg-[#FAFBFC] dark:bg-[#141A29] border border-[#E1E4EA] dark:border-[#222C43] hover:border-indigo-500/50 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white transition-colors cursor-pointer"
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Auth Section */}
            {isPending ? (
              <div className="h-9 w-24 animate-pulse rounded-full bg-[#F1F3F6] dark:bg-[#171E30]" />
            ) : user ? (
              /* Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer bg-[#FAFBFC] dark:bg-[#141A29] border border-[#E1E4EA] dark:border-[#222C43] hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-[#1C2234] p-1.5 pr-3 rounded-full transition-all duration-200"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleDropdownClick}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center border border-indigo-400/40 text-white text-xs font-bold shrink-0">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt="User avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(user?.name)}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#181B20] dark:text-white/90 hidden sm:block truncate max-w-[85px]">
                    {user?.name || 'Account'}
                  </span>
                  {isPro ? (
                    <span className="text-[9px] font-extrabold text-white bg-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      PRO
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#9CA3AF] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase">
                      FREE
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[#6B7280] dark:text-[#9CA3AF] transition-transform duration-300 ${
                      isUserDropdownOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </div>

                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-[#0E1321] border border-[#E1E4EA] dark:border-[#1E2638] rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* User Info Header */}
                    <div className="px-4 pb-3 border-b border-[#E1E4EA] dark:border-[#1E2638]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center border border-indigo-400/40 text-white text-xs font-bold shrink-0">
                          {user?.image ? (
                            <Image
                              src={user.image}
                              width={40}
                              height={40}
                              alt="User avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{getInitials(user?.name)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#181B20] dark:text-white font-bold truncate text-sm">
                            {user?.name}
                          </p>
                          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs truncate">
                            {user?.email}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              isPro
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-[#6B7280] dark:text-[#9CA3AF] border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isPro ? 'Pro Developer' : 'Free Tier'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Navigation - Workspace Only */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/workspace"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#181B20] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-white hover:bg-[#EEF0FF] dark:hover:bg-[#141A29] transition-all duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Workspace / Dashboard</span>
                      </Link>
                    </div>

                    {/* Sign Out Action */}
                    <div className="border-t border-[#E1E4EA] dark:border-[#1E2638] p-1.5 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all duration-200 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-full shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F1F3F6] dark:hover:bg-[#171E30] transition-colors cursor-pointer"
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C210E] focus:outline-none transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-screen opacity-100 border-b border-[#E1E4EA] dark:border-[#1E2638]'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-4 bg-white/98 dark:bg-[#090C15]/98 backdrop-blur-lg">
          {/* Mobile Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-indigo-50 dark:bg-[#141A29] text-indigo-600 dark:text-white border-l-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#141A29]/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Section in Drawer */}
          <div className="px-1 pt-2 border-t border-[#E1E4EA] dark:border-[#1E2638]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50 dark:bg-[#141A29] border border-[#E1E4EA] dark:border-[#222C43]">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(user.name)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#181B20] dark:text-white font-bold truncate text-sm">
                      {user.name}
                    </p>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/workspace"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full bg-[#FAFBFC] dark:bg-[#141A29] border border-[#E1E4EA] dark:border-[#222C43] text-[#181B20] dark:text-white text-xs font-semibold py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#1A2236] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center justify-center gap-1.5 w-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold py-2.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white font-semibold py-3 rounded-full hover:bg-indigo-500 transition-colors duration-200 shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
