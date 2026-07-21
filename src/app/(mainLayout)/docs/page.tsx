import Link from 'next/link';
import {
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Terminal,
  Zap,
  ArrowRight,
  Search,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const metadata = {
  title: 'Documentation - Archflow',
  description: 'Learn how to generate, customize, and deploy modern system architecture blueprints with Archflow.',
};

export default function DocsPage() {
  const categories = [
    {
      title: 'Getting Started',
      icon: Zap,
      description: 'Quickstart guides to get your architecture up and running in minutes.',
      articles: [
        'Introduction to Archflow',
        'Quickstart Guide',
        'Core Concepts & Terminology',
        'Architecture Standard Guidelines',
      ],
    },
    {
      title: 'Blueprint Engineering',
      icon: Layers,
      description: 'Master blueprint design, multi-tier stack selections, and diagram generation.',
      articles: [
        'Creating Custom Blueprints',
        'Managing Stack Dependencies',
        'Microservices vs Monolith Blueprints',
        'Exporting Diagrams & Infrastructure Specs',
      ],
    },
    {
      title: 'AI System Assistant',
      icon: Cpu,
      description: 'Leverage AI to assist with system optimization and bottleneck analysis.',
      articles: [
        'Prompt Engineering for Blueprints',
        'Automated Bottleneck Detection',
        'Cost Estimation Prompts',
        'Security & Compliance Checking',
      ],
    },
    {
      title: 'API & Integrations',
      icon: Code2,
      description: 'Connect Archflow directly into your existing CI/CD and cloud provider workflows.',
      articles: [
        'Archflow REST API Overview',
        'Authentication & API Keys',
        'Webhook Notifications',
        'Terraform & CloudFormation Exporters',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 mb-4 border border-indigo-100">
            <BookOpen className="h-3.5 w-3.5" />
            Documentation & Guides
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl font-display">
            How can we help you build today?
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Everything you need to architect, optimize, and scale modern software applications using Archflow’s blueprint system.
          </p>
          
          {/* Quick Search Mockup */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation, API endpoints, guides..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{cat.title}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {cat.description}
                  </p>
                  <ul className="space-y-2.5 border-t border-slate-100 pt-4">
                    {cat.articles.map((art, aIdx) => (
                      <li key={aIdx} className="flex items-center gap-2 text-sm text-slate-700 hover:text-indigo-600 cursor-pointer transition-colors group">
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span>{art}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                  <span>Explore category</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quickstart Code Preview Section */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Terminal className="h-4 w-4" /> CLI & API Integration
              </div>
              <h2 className="text-2xl font-bold mb-3 font-display">Generate Blueprints Programmatically</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Fetch blueprints directly into your development pipelines or custom dashboard using our TypeScript API client.
              </p>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Full TypeScript type safety and auto-completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Instant JSON schema validation</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner overflow-x-auto">
              <div className="flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span className="ml-2 text-[10px]">example.ts</span>
              </div>
              <pre className="leading-relaxed">
                <span className="text-indigo-400">import</span> &#123; ArchflowClient &#125; <span className="text-indigo-400">from</span> <span className="text-emerald-300">&apos;@archflow/sdk&apos;</span>;<br /><br />
                <span className="text-indigo-400">const</span> client = <span className="text-indigo-400">new</span> ArchflowClient(&#123;<br />
                &nbsp;&nbsp;apiKey: process.env.ARCHFLOW_API_KEY,<br />
                &#125;);<br /><br />
                <span className="text-indigo-400">const</span> blueprint = <span className="text-indigo-400">await</span> client.blueprints.generate(&#123;<br />
                &nbsp;&nbsp;title: <span className="text-emerald-300">&apos;E-Commerce Microservices&apos;</span>,<br />
                &nbsp;&nbsp;stack: [<span className="text-emerald-300">&apos;Next.js&apos;</span>, <span className="text-emerald-300">&apos;Node.js&apos;</span>, <span className="text-emerald-300">&apos;PostgreSQL&apos;</span>],<br />
                &#125;);
              </pre>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-600">
            Need additional help? Check our{' '}
            <Link href="/blueprints" className="font-semibold text-indigo-600 hover:underline">
              Community Blueprints
            </Link>{' '}
            or visit the workspace dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
