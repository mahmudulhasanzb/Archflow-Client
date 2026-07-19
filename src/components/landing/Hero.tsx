'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Cpu, Layers, Layout, ShieldAlert } from 'lucide-react';

export default function Hero() {
  const [demoInput, setDemoInput] = useState('');
  const [demoStep, setDemoStep] = useState(0); // 0: input, 1: Architect, 2: Planner, 3: Documenter, 4: Reviewer, 5: Ready

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput) return;
    setDemoStep(1);

    const interval = setInterval(() => {
      setDemoStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          return 5;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const mockDemoContent = [
    { title: 'AI Software Architect Pipeline', desc: 'Type your idea below to watch our 4-agent team generate a full blueprint structure in real-time.' },
    { title: 'Architect Agent is designing schemas...', desc: `Creating database schemas, collection structures, indexing fields, and relation charts for: "${demoInput}"` },
    { title: 'Planner Agent is building roadmaps...', desc: 'Defining project execution phases, milestones, task checklists, and estimating complexity.' },
    { title: 'Documenter Agent is writing stubs...', desc: 'Generating detailed setup instructions, shell commands, pre-requisites, and API routes.' },
    { title: 'Reviewer Agent is auditing risks...', desc: 'Conducting code structure checks, highlighting security concerns, and verifying schema logic.' },
    { title: 'Blueprint Ready!', desc: 'Simulation completed! Try logging in or creating a free account to download the complete blueprint package.' }
  ];

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center border-b border-[#E1E4EA] bg-gradient-to-b from-[#EEF0FF]/30 to-[#FAFBFC] px-4 py-16 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3.5 py-1 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Driven Architecture
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#181B20] sm:text-6xl font-display">
          From Idea to Technical <span className="text-[#4F46E5]">Blueprint</span> in Seconds
        </h1>
        <p className="mx-auto max-w-2xl text-base text-[#6B7280]">
          An AI Software Architect: a team of specialized agents turn your one-paragraph project description into schemas, roadmaps, setup scripts, and reviews.
        </p>

        {/* Interactive Demo */}
        <div className="mx-auto mt-8 w-full max-w-2xl rounded-xl border border-[#E1E4EA] bg-white p-6 shadow-sm">
          {demoStep === 0 ? (
            <form onSubmit={handleDemoSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="e.g., Realtime chat app with Next.js, Redis, and WebSockets..."
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="flex-1 rounded-lg border border-[#E1E4EA] px-4 py-2.5 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#4F46E5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3f37c9] transition-colors"
              >
                Generate Free Preview
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  {demoStep < 5 ? `Step ${demoStep} of 4: Generating` : 'Completed'}
                </span>
                {demoStep < 5 && (
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#4F46E5]" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#4F46E5]" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#4F46E5]" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-[#F1F3F6] p-4 font-mono text-xs text-[#181B20] border border-[#E1E4EA] min-h-[100px] flex flex-col justify-center">
                <div className="font-bold text-[#4F46E5] mb-2 font-display text-sm">{mockDemoContent[demoStep].title}</div>
                <div className="text-[#6B7280]">{mockDemoContent[demoStep].desc}</div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  {['Architect', 'Planner', 'Documenter', 'Reviewer'].map((agentName, idx) => (
                    <span
                      key={agentName}
                      className={`h-2.5 w-12 rounded-full transition-colors ${
                        demoStep > idx + 1
                          ? 'bg-[#16A34A]'
                          : demoStep === idx + 1
                          ? 'bg-[#D97706]'
                          : 'bg-[#E1E4EA]'
                      }`}
                    />
                  ))}
                </div>

                {demoStep === 5 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setDemoInput('');
                        setDemoStep(0);
                      }}
                      className="text-xs font-semibold text-[#6B7280] hover:text-[#181B20] transition-colors"
                    >
                      Reset Demo
                    </button>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:text-[#3f37c9] transition-colors"
                    >
                      Create Account to Download
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
