'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { serverMutation } from '@/lib/api/mutation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { Cpu, Layers, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddBlueprintPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [complexcity, setComplexcity] = useState('medium');
  const [status, setStatus] = useState('ready');
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('hasan@gmail.com');

  useEffect(() => {
    if (session?.user?.email) {
      setAuthor(session.user.email);
    }
  }, [session]);

  // Architecture Flow states
  const [archTitle, setArchTitle] = useState('');
  const [archDesc, setArchDesc] = useState('');
  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [planDesc, setPlanDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Title and Description are required.');
      return;
    }

    setLoading(true);

    // Parse techStack
    const teckStack = techStackInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const payload = {
      title,
      description,
      teckStack: teckStack.length > 0 ? teckStack : ['React', 'Node.js'],
      complexcity,
      architectureFlow: {
        architecture: {
          title: archTitle || 'Architecture details',
          description: archDesc || 'Architecture description details.',
        },
        features: {
          title: featureTitle || 'Key features',
          description: featureDesc || 'Feature checklist details.',
        },
        plan: {
          title: planTitle || 'Implementation roadmap',
          description: planDesc || 'Roadmap blueprint plan details.',
        },
      },
      status,
      rating: Number(rating) || 5,
      author,
      email: author,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await serverMutation('/api/blueprints', 'POST', payload);
      if (res) {
        toast.success('Blueprint successfully created!');
        router.push('/blueprints');
      } else {
        throw new Error('No response from server');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        'Failed to create blueprint: ' + (err.message || 'Server error'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex-grow">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/blueprints"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] hover:text-[#181B20] transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#181B20] font-display">
            Create Architecture Blueprint
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Specify technical details, architecture phases, and target tech
            stack.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white border border-[#E1E4EA] rounded-xl p-6 sm:p-8 shadow-sm"
      >
        {/* Core Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#E1E4EA]">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#181B20] mb-2">
              Blueprint Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Realtime Collaborative Workspace"
              className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#181B20] mb-2">
              Short Description
            </label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Overview description of the system architecture design..."
              rows={3}
              className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#181B20] mb-2">
              Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={e => setTechStackInput(e.target.value)}
              placeholder="Nextjs, React, MongoDB, WebSockets"
              className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#181B20] mb-2">
              Complexity Level
            </label>
            <select
              value={complexcity}
              onChange={e => setComplexcity(e.target.value)}
              className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800 appearance-none cursor-pointer"
            >
              <option value="low">Low Complexity</option>
              <option value="medium">Medium Complexity</option>
              <option value="high">High Complexity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#181B20] mb-2">
              Author Email
            </label>
            <input
              type="email"
              required
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#181B20] mb-2">
              Rating
            </label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              required
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Architecture Flow Details */}
        <div className="space-y-6 pb-6 border-b border-[#E1E4EA]">
          <h3 className="text-sm font-bold text-[#181B20] uppercase tracking-wider">
            Architecture Flow Steps
          </h3>

          {/* Step 1: Architecture */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-[#4F46E5]">
              <Cpu className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Step 1: System Architecture
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                  Step Title
                </label>
                <input
                  type="text"
                  value={archTitle}
                  onChange={e => setArchTitle(e.target.value)}
                  placeholder="System Layout & Topology"
                  className="w-full rounded-lg border border-[#E1E4EA] px-3 py-1.5 text-xs focus:border-[#4F46E5] focus:outline-none bg-white text-slate-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                  Step Description
                </label>
                <input
                  type="text"
                  value={archDesc}
                  onChange={e => setArchDesc(e.target.value)}
                  placeholder="Details of gateways, microservices routing, or database structure..."
                  className="w-full rounded-lg border border-[#E1E4EA] px-3 py-1.5 text-xs focus:border-[#4F46E5] focus:outline-none bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Features */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-[#0D9488]">
              <Layers className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Step 2: Core Features
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                  Step Title
                </label>
                <input
                  type="text"
                  value={featureTitle}
                  onChange={e => setFeatureTitle(e.target.value)}
                  placeholder="Functional Scope"
                  className="w-full rounded-lg border border-[#E1E4EA] px-3 py-1.5 text-xs focus:border-[#4F46E5] focus:outline-none bg-white text-slate-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                  Step Description
                </label>
                <input
                  type="text"
                  value={featureDesc}
                  onChange={e => setFeatureDesc(e.target.value)}
                  placeholder="Detail user authentication, sync engine, real-time channels..."
                  className="w-full rounded-lg border border-[#E1E4EA] px-3 py-1.5 text-xs focus:border-[#4F46E5] focus:outline-none bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Plan */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-[#EA5C34]">
              <BookOpen className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Step 3: Roadmap & Plan
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                  Step Title
                </label>
                <input
                  type="text"
                  value={planTitle}
                  onChange={e => setPlanTitle(e.target.value)}
                  placeholder="Execution Phases"
                  className="w-full rounded-lg border border-[#E1E4EA] px-3 py-1.5 text-xs focus:border-[#4F46E5] focus:outline-none bg-white text-slate-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                  Step Description
                </label>
                <input
                  type="text"
                  value={planDesc}
                  onChange={e => setPlanDesc(e.target.value)}
                  placeholder="Phase 1 setup, Phase 2 migration, Phase 3 validation checklist..."
                  className="w-full rounded-lg border border-[#E1E4EA] px-3 py-1.5 text-xs focus:border-[#4F46E5] focus:outline-none bg-white text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/blueprints"
            className="inline-flex items-center rounded-lg border border-[#E1E4EA] bg-white px-5 py-2.5 text-sm font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4F46E5] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#4338CA] disabled:bg-[#EEF0FF] disabled:text-[#4F46E5] transition-colors cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create Blueprint'}
          </button>
        </div>
      </form>
    </div>
  );
}
