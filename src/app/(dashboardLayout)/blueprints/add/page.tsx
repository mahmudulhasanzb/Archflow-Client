'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { baseURL } from '@/lib/api/baseUrl';
import toast from 'react-hot-toast';
import { ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';

export default function AddBlueprintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('Next.js + Express + MongoDB');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim() || !description.trim()) {
      toast.error('All text inputs are required.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Initiating AI Architect pipeline...');

    try {
      // Send POST request to backend server
      const res = await fetch(`${baseURL}/api/blueprints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send Bearer demo token or cookies. fetch sends cookies by default if same-site, but let's make sure it handles CORS
        },
        body: JSON.stringify({
          title,
          shortDescription,
          description,
          stack,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Pipeline execution failed.');
      }

      toast.success('Simulation triggered successfully!', { id: toastId });
      router.push('/blueprints/manage');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit project.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow p-8 max-w-3xl mx-auto w-full space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#181B20] font-display">Create AI Architect Blueprint</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Provide technical specs to begin the 4-agent generation sequence.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E1E4EA] p-6 shadow-sm space-y-6">
        {/* Project Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-semibold text-[#181B20]">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            required
            placeholder="e.g. ChatEngine"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white"
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label htmlFor="short-desc" className="text-sm font-semibold text-[#181B20]">
            Short Description
          </label>
          <input
            id="short-desc"
            type="text"
            required
            placeholder="e.g. Realtime collaborative documentation manager"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white"
          />
          <p className="text-xs text-[#6B7280]">
            A single sentence summarizing the project purpose.
          </p>
        </div>

        {/* Full Details Description */}
        <div className="space-y-2">
          <label htmlFor="desc" className="text-sm font-semibold text-[#181B20]">
            Full Specifications Description
          </label>
          <textarea
            id="desc"
            required
            rows={6}
            placeholder="Describe database tables, custom routes, authentication needs, and task priorities..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white"
          />
        </div>

        {/* Tech Stack Select */}
        <div className="space-y-2">
          <label htmlFor="stack" className="text-sm font-semibold text-[#181B20]">
            Target Tech Stack
          </label>
          <select
            id="stack"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white"
          >
            <option value="Next.js + Express + MongoDB">Next.js + Express + MongoDB</option>
            <option value="Next.js + WebSockets + Redis">Next.js + WebSockets + Redis</option>
            <option value="Express.js + Node + Stripe">Express.js + Node + Stripe</option>
            <option value="Python + PostgreSQL + Vector">Python + PostgreSQL + Vector</option>
          </select>
        </div>

        {/* Warning Banner */}
        <div className="rounded-lg bg-[#FFF0EA] border border-[#FFF0EA] p-4 flex gap-3 text-xs text-[#EA5C34] font-medium">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <div>
            AI generation starts immediately. Simulation progresses sequentially through: Architect → Planner → Documenter → Reviewer → Ready (approx. 8 seconds).
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F46E5] py-2.5 text-sm font-semibold text-white hover:bg-[#3f37c9] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Launch Simulation'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
