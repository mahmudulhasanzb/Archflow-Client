'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Menu, X, ArrowRight, Activity } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  const navLinks = session
    ? [
        { name: 'Explore', href: '/blueprints' },
        { name: 'Workspace', href: '/workspace' },
        { name: 'Add Blueprint', href: '/blueprints/add' },
        { name: 'Manage', href: '/blueprints/manage' },
        { name: 'Docs', href: '/docs' },
      ]
    : [
        { name: 'Explore', href: '/blueprints' },
        { name: 'Docs', href: '/docs' },
        { name: 'About', href: '/about' },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E1E4EA] bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-[#181B20] font-display"
            >
              <Activity className="h-6 w-6 text-[#4F46E5]" />
              <span>Archflow</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#6B7280] hover:text-[#181B20] transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {isPending ? (
              <div className="h-8 w-20 animate-pulse rounded-lg bg-[#F1F3F6]" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#6B7280] bg-[#F1F3F6] px-2.5 py-1 rounded-full font-medium">
                  {session.user?.name || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg border border-[#E1E4EA] px-3.5 py-1.5 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="text-xs font-semibold text-[#181B20] hover:text-[#4F46E5] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#4F46E5] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#3f37c9] transition-colors"
                >
                  Get Started
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-[#6B7280] hover:bg-[#F1F3F6] hover:text-[#181B20] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#E1E4EA] bg-white px-4 py-3 md:hidden space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-[#6B7280] hover:bg-[#F1F3F6] hover:text-[#181B20] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#E1E4EA] mt-2 space-y-2">
            {session ? (
              <div className="flex flex-col gap-2">
                <div className="px-3 text-xs text-[#6B7280]">
                  Signed in as{' '}
                  <span className="font-semibold text-[#181B20]">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left rounded-lg px-3 py-2 text-base font-medium text-[#EA5C34] hover:bg-[#FFF0EA] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-[#181B20] hover:bg-[#F1F3F6] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-lg bg-[#4F46E5] px-3 py-2 text-base font-medium text-white hover:bg-[#3f37c9] transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
