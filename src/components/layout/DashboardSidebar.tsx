'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  FolderHeart,
  ChevronDown,
  LogOut,
  User,
  Compass,
  Home,
  Menu,
  X,
  ShieldCheck,
  Users,
  CreditCard,
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
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

  const isAdmin = (user as any)?.role?.toLowerCase() === 'admin';

  const isPro =
    (user as any)?.role?.toLowerCase() === 'pro' ||
    isAdmin ||
    (user as any)?.plan?.toLowerCase() === 'pro';

  const roleLabel = isAdmin ? 'Admin' : isPro ? 'Pro' : 'Free';

  const adminMenuItems = [
    { label: 'User Control', href: '/admin/users', icon: Users },
    { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-card/95 backdrop-blur-md border-b border-border z-30 px-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <span className="text-foreground font-black text-lg tracking-tight font-display">
            ARCHFLOW
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileOpen(prev => !prev)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-xs z-35 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 h-screen bg-card border-r border-border flex flex-col justify-between z-40 select-none transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
      {/* Brand Header & Navigation */}
      <div>
        {/* Brand Header */}
        <div className="h-16 md:h-20 border-b border-border flex items-center px-6">
          <Link href="/" className="inline-flex items-center group">
            <span className="text-foreground font-black text-xl tracking-tight select-none font-display group-hover:opacity-80 transition-opacity">
              ARCHFLOW
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
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
                    ? 'bg-muted border-border text-foreground'
                    : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <IconComponent
                  className={`h-4.5 w-4.5 transition-colors duration-200 ${
                    active
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 bg-foreground rounded-full" />
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 mt-5 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Console</span>
              </div>
              {adminMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={`admin-${index}`}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 group border ${
                      active
                        ? 'bg-muted border-border text-foreground'
                        : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <IconComponent
                      className={`h-4.5 w-4.5 transition-colors duration-200 ${
                        active
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-border bg-card relative">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Popover Dropdown popping UP */}
            {isUserDropdownOpen && (
              <div
                className="absolute bottom-full left-0 mb-2.5 w-56 bg-card border border-border rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-2 border-b border-border mb-1">
                  <p className="text-foreground text-xs font-bold truncate">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground text-[10px] truncate">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <Home className="h-3.5 w-3.5 text-foreground" />
                  <span>Archflow Home</span>
                </Link>
                <Link
                  href="/blueprints"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <Compass className="h-3.5 w-3.5 text-foreground" />
                  <span>Explore Blueprints</span>
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin/users"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-muted transition-all duration-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>User Control</span>
                    </Link>
                    <Link
                      href="/admin/transactions"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-muted transition-all duration-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <CreditCard className="h-3.5 w-3.5 text-primary" />
                      <span>Transactions</span>
                    </Link>
                  </>
                )}
                <div className="border-t border-border pt-1 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-muted transition-all duration-200 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Profile Info Card Trigger */}
            <div
              className="flex items-center gap-3 p-2 rounded-2xl bg-card border border-border cursor-pointer hover:border-foreground/30 hover:bg-muted transition-all duration-200"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleDropdownClick}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-foreground text-background flex items-center justify-center border border-border shrink-0 text-xs font-bold">
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
                <p className="text-foreground text-xs font-bold truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                  {roleLabel}
                </p>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                  isUserDropdownOpen ? 'rotate-180 text-foreground' : ''
                }`}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-muted/50 border border-border animate-pulse">
            <div className="w-9 h-9 rounded-full bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 bg-muted rounded w-3/4" />
              <div className="h-2 bg-muted rounded w-1/2" />
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}

