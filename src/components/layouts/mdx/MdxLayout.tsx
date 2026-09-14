import React from 'react';
import SyntaxHighlighter from '@/components/mdx/SyntaxHighlighter';

interface MdxLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MdxLayout({ children, className = '' }: MdxLayoutProps) {
  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-pre:bg-[#090C15] prose-pre:border prose-pre:border-[#1E2638] prose-code:text-indigo-600 dark:prose-code:text-indigo-300 prose-code:font-mono text-sm leading-relaxed ${className}`}
    >
      <SyntaxHighlighter>{children}</SyntaxHighlighter>
    </div>
  );
}
