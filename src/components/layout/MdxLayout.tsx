import React from 'react';
import SyntaxHighlighter from '@/components/mdx/SyntaxHighlighter';

interface MdxLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MdxLayout({ children, className = '' }: MdxLayoutProps) {
  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-foreground prose-a:underline prose-pre:bg-card prose-pre:border prose-pre:border-border prose-code:text-foreground prose-code:font-mono text-sm leading-relaxed ${className}`}
    >
      <SyntaxHighlighter>{children}</SyntaxHighlighter>
    </div>
  );
}
