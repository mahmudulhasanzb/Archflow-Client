'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { baseURL } from '@/lib/api/baseUrl';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, Cpu, Layers, Layout, ShieldAlert } from 'lucide-react';

interface Blueprint {
  _id: string;
  title: string;
  shortDescription?: string;
  description: string;
  stack: string;
  complexity?: string;
  rating?: number;
  status: string;
  createdAt: string;
}

export default function ExplorePage() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters state
  const [search, setSearch] = useState('');
  const [stackFilter, setStackFilter] = useState('All');
  const [complexityFilter, setComplexityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const mockBlueprints: Blueprint[] = [
    {
      _id: 'mock1',
      title: 'Realtime Collaborative Editor',
      shortDescription: 'Multiplayer document editing using Yjs CRDTs and WebSocket relays.',
      description: 'A complete collaborative suite containing document delta sync models.',
      stack: 'Next.js + WebSockets',
      complexity: 'High',
      rating: 4.9,
      status: 'Ready',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: 'mock2',
      title: 'Microservice Gateway Pattern',
      shortDescription: 'Unified routing portal with rate limiting, auth translation, and load balancing.',
      description: 'An Express.js proxy hub orchestrating API calls across distributed microservices.',
      stack: 'Express.js + Node',
      complexity: 'Medium',
      rating: 4.7,
      status: 'Ready',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      _id: 'mock3',
      title: 'Serverless SaaS Billing Hub',
      shortDescription: 'Stripe-integrated subscription webhook listener and consumption-metering logic.',
      description: 'A serverless database structure verifying Stripe webhooks and generating reports.',
      stack: 'Next.js + Stripe',
      complexity: 'High',
      rating: 4.8,
      status: 'Ready',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      _id: 'mock4',
      title: 'Distributed Task Queue',
      shortDescription: 'BullMQ background worker cluster using Redis streams for reliable job dispatching.',
      description: 'Background cluster listening to task events and running asynchronous worker tasks.',
      stack: 'Node + Redis',
      complexity: 'Medium',
      rating: 4.6,
      status: 'Ready',
      createdAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      _id: 'mock5',
      title: 'AI Customer Support Agent',
      shortDescription: 'Semantic search indexing using pgvector and automated answer routing.',
      description: 'AI chatbot using Retrieval-Augmented Generation to query corporate documentation.',
      stack: 'Python + PostgreSQL',
      complexity: 'Medium',
      rating: 4.5,
      status: 'Ready',
      createdAt: new Date(Date.now() - 432000000).toISOString()
    },
    {
      _id: 'mock6',
      title: 'SaaS Multi-tenant Template',
      shortDescription: 'Custom domain routing, database-per-tenant separation, and clean workspaces.',
      description: 'A complete template project resolving tenant subdomains and securing workspace schemas.',
      stack: 'Next.js + Express',
      complexity: 'Low',
      rating: 4.4,
      status: 'Ready',
      createdAt: new Date(Date.now() - 518400000).toISOString()
    }
  ];

  const fetchBlueprints = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${baseURL}/api/blueprints`);
      if (!res.ok) throw new Error('Failed to retrieve blueprints.');
      const data = await res.json();
      
      // Filter out blueprints that are not 'Ready' if public explore, but for preview we can show all ready ones
      const readyBlueprints = data.filter((bp: Blueprint) => bp.status === 'Ready');
      
      // Combine with mock database if list is small/empty
      if (readyBlueprints.length === 0) {
        setBlueprints(mockBlueprints);
      } else {
        setBlueprints(readyBlueprints);
      }
    } catch (err: any) {
      console.warn('API error, falling back to mock blueprints list:', err.message);
      setBlueprints(mockBlueprints);
    } finally {
      // Small timeout to demonstrate premium skeleton loaders
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchBlueprints();
  }, []);

  // Filter & Search Logic
  const filteredBlueprints = blueprints
    .filter((bp) => {
      const matchSearch =
        bp.title.toLowerCase().includes(search.toLowerCase()) ||
        bp.description.toLowerCase().includes(search.toLowerCase()) ||
        (bp.shortDescription && bp.shortDescription.toLowerCase().includes(search.toLowerCase()));
      
      const matchStack =
        stackFilter === 'All' ||
        bp.stack.toLowerCase().includes(stackFilter.toLowerCase());
      
      const matchComplexity =
        complexityFilter === 'All' ||
        (bp.complexity || 'Medium').toLowerCase() === complexityFilter.toLowerCase();
      
      return matchSearch && matchStack && matchComplexity;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

  // Pagination Logic
  const totalItems = filteredBlueprints.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlueprints = filteredBlueprints.slice(startIndex, startIndex + itemsPerPage);

  // Reset page on search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, stackFilter, complexityFilter, sortBy]);

  // Helper icons
  const getIcon = (stackName: string) => {
    const name = stackName.toLowerCase();
    if (name.includes('express') || name.includes('node')) return Layers;
    if (name.includes('stripe') || name.includes('billing')) return Layout;
    if (name.includes('task') || name.includes('redis')) return ShieldAlert;
    return Cpu;
  };

  const getIconColorClass = (stackName: string) => {
    const name = stackName.toLowerCase();
    if (name.includes('express') || name.includes('node')) return 'text-[#0D9488]';
    if (name.includes('stripe') || name.includes('billing')) return 'text-[#EA5C34]';
    if (name.includes('task') || name.includes('redis')) return 'text-[#4F46E5]';
    return 'text-[#4F46E5]';
  };

  const getBgColorClass = (stackName: string) => {
    const name = stackName.toLowerCase();
    if (name.includes('express') || name.includes('node')) return 'bg-[#E6F5F3]';
    if (name.includes('stripe') || name.includes('billing')) return 'bg-[#FFF0EA]';
    if (name.includes('task') || name.includes('redis')) return 'bg-[#EEF0FF]';
    return 'bg-[#EEF0FF]';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow">
      {/* Page Header */}
      <div className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">Explore Architecture Blueprints</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Search, filter, and review technical plans generated by the multi-agent AI pipeline.
          </p>
        </div>
        <button
          onClick={fetchBlueprints}
          className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Listing
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search blueprints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white"
          />
        </div>

        {/* Stack Filter */}
        <div className="relative flex items-center">
          <SlidersHorizontal className="absolute left-3 h-4 w-4 text-[#6B7280] pointer-events-none" />
          <select
            value={stackFilter}
            onChange={(e) => setStackFilter(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white appearance-none"
          >
            <option value="All">All Stacks</option>
            <option value="Next.js">Next.js</option>
            <option value="Express">Express</option>
            <option value="Node">Node</option>
            <option value="Python">Python</option>
            <option value="WebSockets">WebSockets</option>
          </select>
        </div>

        {/* Complexity Filter */}
        <div className="relative flex items-center">
          <SlidersHorizontal className="absolute left-3 h-4 w-4 text-[#6B7280] pointer-events-none" />
          <select
            value={complexityFilter}
            onChange={(e) => setComplexityFilter(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white appearance-none"
          >
            <option value="All">All Complexities</option>
            <option value="Low">Low Complexity</option>
            <option value="Medium">Medium Complexity</option>
            <option value="High">High Complexity</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3 h-4 w-4 text-[#6B7280] pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white appearance-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="rating">Sort: Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Listing Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : paginatedBlueprints.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-[#E1E4EA]">
          <SlidersHorizontal className="mx-auto h-12 w-12 text-[#6B7280] mb-4" />
          <h3 className="text-lg font-bold text-[#181B20] font-display">No blueprints found</h3>
          <p className="text-sm text-[#6B7280] mt-1">Try adjusting your search query or filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedBlueprints.map((bp) => {
            const Icon = getIcon(bp.stack);
            return (
              <div key={bp._id} className="group bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm flex flex-col justify-between h-[360px]">
                <div className={`${getBgColorClass(bp.stack)} h-40 flex items-center justify-center border-b border-[#E1E4EA]`}>
                  <Icon className={`h-10 w-10 ${getIconColorClass(bp.stack)}`} />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#181B20] font-display">{bp.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                      {bp.shortDescription || bp.description}
                    </p>
                  </div>
                  <div className="pt-4 flex justify-between items-center text-[10px] text-[#6B7280]">
                    <span>Rating: ★ {bp.rating || '4.5'}</span>
                    <span className="font-semibold text-[#0D9488]">{bp.complexity || 'Medium'} Complexity</span>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link
                    href={`/blueprints/${bp._id}`}
                    className="block text-center rounded-lg bg-[#FAFBFC] border border-[#E1E4EA] py-2 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors disabled:opacity-50"
          >
            Prev
          </button>
          
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#181B20]">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-8 w-8 rounded-lg border text-center transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                      : 'bg-white border-[#E1E4EA] text-[#181B20] hover:bg-[#F1F3F6]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
