'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MdxLayout from '@/components/layouts/mdx/MdxLayout';

interface MdxRendererProps {
  content: string;
  className?: string;
}

export default function MdxRenderer({ content, className = '' }: MdxRendererProps) {
  return (
    <MdxLayout className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </MdxLayout>
  );
}
