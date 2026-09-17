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
    { label: 'Blueprints', href: '/blueprints' },
    { label: 'Docs', href: '/docs' },
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  if (user) {
    navLinks.push({ label: 'Workspace', href: '/workspace' });
  }

  const isLinkActive = (href: string) => pathname === href;

  const isPro =
    (user as any)?.role?.toLowerCase() === 'pro' ||
    (user as any)?.role?.toLowerCase() === 'admin' ||
    (user as any)?.plan?.toLowerCase() === 'pro';

  return (
    <nav className="w-full bg-background/80 border-b border-border sticky top-0 z-50 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background border border-border group-hover:scale-105 transition-transform duration-200">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-foreground font-extrabold text-xl tracking-wider select-none font-display">
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
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full transition-all duration-300" />
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
              className="p-2 rounded-full bg-card border border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
              <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              /* Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer bg-card border border-border hover:border-foreground/30 hover:bg-muted p-1.5 pr-3 rounded-full transition-all duration-200"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleDropdownClick}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-foreground text-background flex items-center justify-center border border-border text-xs font-bold shrink-0">
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
                  <span className="text-xs font-semibold text-foreground hidden sm:block truncate max-w-[85px]">
                    {user?.name || 'Account'}
                  </span>
                  {isPro ? (
                    <span className="text-[9px] font-extrabold text-background bg-foreground px-1.5 py-0.5 rounded uppercase tracking-wider">
                      PRO
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                      FREE
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${
                      isUserDropdownOpen ? 'rotate-180 text-foreground' : ''
                    }`}
                  />
                </div>

                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-60 bg-card border border-border rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* User Info Header */}
                    <div className="px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-foreground text-background flex items-center justify-center border border-border text-xs font-bold shrink-0">
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
                          <p className="text-foreground font-bold truncate text-sm">
                            {user?.name}
                          </p>
                          <p className="text-muted-foreground text-xs truncate">
                            {user?.email}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              isPro
                                ? 'bg-muted text-foreground border-border'
                                : 'bg-muted text-muted-foreground border-border'
                            }`}
                          >
                            {isPro ? 'Pro' : 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Navigation - Workspace Only */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/workspace"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-foreground" />
                        <span>Workspace / Dashboard</span>
                      </Link>
                    </div>

                    {/* Sign Out Action */}
                    <div className="border-t border-border p-1.5 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-muted transition-all duration-200 cursor-pointer"
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
                  className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-extrabold text-xs uppercase px-5 py-2.5 rounded-full shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-200"
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
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none transition-all duration-200"
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
            ? 'max-h-screen opacity-100 border-b border-border'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-4 bg-background/95 backdrop-blur-lg">
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
                      ? 'bg-muted text-foreground border-l-2 border-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Section in Drawer */}
          <div className="px-1 pt-2 border-t border-border">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-xl bg-muted/60 border border-border">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
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
                    <p className="text-foreground font-bold truncate text-sm">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/workspace"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full bg-card border border-border text-foreground text-xs font-semibold py-2.5 rounded-full hover:bg-muted transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center justify-center gap-1.5 w-full bg-muted border border-border text-destructive text-xs font-bold py-2.5 rounded-full hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-opacity duration-200 shadow-xs"
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
