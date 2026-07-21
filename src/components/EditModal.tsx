'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface Blueprint {
  _id: string;
  title: string;
  description: string;
  teckStack?: string | string[];
  complexity?: string;
  complexcity?: string;
  status: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: Blueprint | null;
  onSave: (updatedData: Partial<Blueprint>) => Promise<void>;
  loading: boolean;
}

export default function EditModal({
  isOpen,
  onClose,
  blueprint,
  onSave,
  loading,
}: EditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [complexity, setComplexity] = useState('Medium');
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    if (blueprint) {
      setTitle(blueprint.title || '');
      setDescription(blueprint.description || '');
      
      const stack = blueprint.teckStack;
      if (Array.isArray(stack)) {
        setTechStackInput(stack.join(', '));
      } else if (typeof stack === 'string') {
        setTechStackInput(stack);
      } else {
        setTechStackInput('');
      }

      setComplexity(blueprint.complexity || blueprint.complexcity || 'Medium');
      setStatus(blueprint.status || 'Ready');
    }
  }, [blueprint, isOpen]);

  if (!isOpen || !blueprint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Parse tech stack input back into an array
    const teckStack = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedData: Partial<Blueprint> = {
      title,
      description,
      teckStack,
      complexity,
      complexcity: complexity, // keep both for safety
      status,
    };

    await onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#090A0C]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-[#E1E4EA] bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          disabled={loading}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#181B20] font-display">
            Edit Architecture Blueprint
          </h3>
          <p className="text-xs text-[#6B7280]">
            Update details for your custom AI generated software blueprint.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] mb-1.5">
              Blueprint Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Microservices eCommerce API"
              className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
              disabled={loading}
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] mb-1.5">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a description of the target system structure..."
              className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
              disabled={loading}
            />
          </div>

          {/* Tech Stack Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] mb-1.5">
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="React, Next.js, Node.js, MongoDB"
              className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
              disabled={loading}
            />
          </div>

          {/* Grid for Complexity & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] mb-1.5">
                Complexity
              </label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
                disabled={loading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-[#E1E4EA] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
                disabled={loading}
              >
                <option value="Generating">Generating</option>
                <option value="Ready">Ready</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 text-xs font-semibold text-[#181B20] hover:bg-[#FAFBFC] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3f37c9] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Blueprint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
