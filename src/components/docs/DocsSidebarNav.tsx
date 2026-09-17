'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export interface NavLinkItem {
  id: string;
  title: string;
}

interface DocsSidebarNavProps {
  navLinks: NavLinkItem[];
  initialActiveSection?: string;
}

export default function DocsSidebarNav({
  navLinks,
  initialActiveSection = 'overview',
}: DocsSidebarNavProps) {
  const searchParams = useSearchParams();
  const currentParam =
    searchParams.get('section') ||
    searchParams.get('tab') ||
    searchParams.get('route') ||
    initialActiveSection;

  return (
    <nav className="space-y-1 text-xs font-medium">
      {navLinks.map((link) => {
        const isActive = currentParam === link.id;
        return (
          <Link
            key={link.id}
            href={`/docs?section=${link.id}#${link.id}`}
            className={`block py-1.5 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}
