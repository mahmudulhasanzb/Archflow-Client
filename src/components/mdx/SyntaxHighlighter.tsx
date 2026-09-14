'use client';

import React, { useEffect } from 'react';
import Prism from 'prismjs';

// Theme
import 'prismjs/themes/prism-twilight.min.css';

// Languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';

export default function SyntaxHighlighter({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  return <div className="prism-highlight-wrapper">{children}</div>;
}
