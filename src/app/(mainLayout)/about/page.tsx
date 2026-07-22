import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Database, Shield, Terminal, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#090C15] text-[#181B20] dark:text-[#F3F4F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Page Title & Intro (Minimalist Header, No Hero Banner) */}
        <div className="space-y-4 border-b border-[#E1E4EA] dark:border-[#222C43] pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#181B20] dark:text-white tracking-tight">
            About Archflow
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed max-w-3xl">
            Archflow is an AI-driven system architecture platform designed to transform high-level software requirements into production-ready database schemas, visual system topologies, security audits, and setup scripts.
          </p>
        </div>

        {/* Section 1: Our Mission */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-[#181B20] dark:text-white">
            Our Mission
          </h2>
          <div className="space-y-4 text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed text-sm sm:text-base">
            <p>
              Starting a new software project often involves dozens of hours spent designing database schemas, mapping API endpoints, configuring containerized development environments, and verifying security compliance.
            </p>
            <p>
              Archflow was created to eliminate this setup friction. By leveraging specialized AI agent swarms, Archflow enables software engineers, tech leads, and founders to generate complete, enterprise-grade technical blueprints in minutes — allowing teams to focus on shipping core product features.
            </p>
          </div>
        </section>

        {/* Section 2: Core Capabilities */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display text-[#181B20] dark:text-white">
            Core Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321]">
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="h-5 w-5 text-[#4F46E5]" />
                <h3 className="font-semibold text-base text-[#181B20] dark:text-white">System Topology</h3>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Generates microservice architecture maps, API endpoint routing, and visual system topology flowcharts.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321]">
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-base text-[#181B20] dark:text-white">Database Engineering</h3>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Engineers relational & NoSQL schemas, entity-relationship diagrams (ERDs), indexes, and Prisma models.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321]">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-base text-[#181B20] dark:text-white">Security & Compliance</h3>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Audits designs against OWASP standards, establishes RBAC access policies, and highlights vulnerability risks.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321]">
              <div className="flex items-center gap-3 mb-2">
                <Terminal className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-base text-[#181B20] dark:text-white">DevOps & Infrastructure</h3>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Produces production Dockerfiles, Docker-Compose stack files, CI/CD pipelines, and local startup shell scripts.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Core Values */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-[#181B20] dark:text-white">
            Core Principles
          </h2>
          <ul className="space-y-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0 mt-0.5" />
              <span><strong className="text-[#181B20] dark:text-white">Architectural Rigor:</strong> Every output follows enterprise standards for scalability, data integrity, and separation of concerns.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0 mt-0.5" />
              <span><strong className="text-[#181B20] dark:text-white">Developer Autonomy:</strong> Clean, portable exports with zero vendor lock-in — standard SQL, Dockerfiles, and TypeScript code.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0 mt-0.5" />
              <span><strong className="text-[#181B20] dark:text-white">Proactive Security:</strong> Threat modeling and access controls are integrated directly into blueprint generation.</span>
            </li>
          </ul>
        </section>

        {/* Minimal Footer Navigation */}
        <div className="pt-8 border-t border-[#E1E4EA] dark:border-[#222C43] flex items-center justify-between">
          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Archflow Platform</span>
          <Link
            href="/blueprints"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] dark:text-indigo-400 hover:underline"
          >
            Explore Blueprints
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
