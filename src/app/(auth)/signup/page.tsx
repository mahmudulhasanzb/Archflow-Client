'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  GitBranch,
  Activity,
  Layers
} from 'lucide-react';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setApiError(null);
    const { name, email, password } = data;

    try {
      const { data: authData, error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setApiError(error.message || 'Something went wrong during sign up.');
      } else {
        setIsSuccess(true);
        // Automatically redirect after a short delay
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      }
    } catch (err: any) {
      setApiError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Aurora background glow decorations */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      {/* Main Grid Layout */}
      <div className="grid w-full lg:grid-cols-12">
        {/* Left Column: Visual flow / Architecture illustration (hidden on mobile) */}
        <div className="relative hidden flex-col justify-between p-12 lg:col-span-5 lg:flex border-r border-zinc-900 bg-zinc-950/40 backdrop-blur-3xl overflow-hidden">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          {/* Logo & Brand Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25">
              <Layers className="h-5 w-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Archflow
            </span>
          </div>

          {/* Visual Workspace Micro-animation */}
          <div className="relative z-10 my-auto flex flex-col justify-center items-center py-10">
            {/* Interactive flow representation */}
            <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-2xl">
              <div className="absolute -top-3 -left-3 flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/80 px-3 py-1 text-[10px] font-semibold text-indigo-400 backdrop-blur">
                <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Live Canvas</span>
              </div>

              {/* Dynamic Connecting Nodes */}
              <div className="flex flex-col h-full justify-between relative">
                {/* Node 1 */}
                <div className="flex items-center gap-3 self-start bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 shadow-md w-40 transform hover:-translate-y-0.5 transition-transform">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-zinc-300">Trigger Source</span>
                    <span className="text-[9px] text-zinc-500">Webhook Listen</span>
                  </div>
                </div>

                {/* Connection Line SVGs */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
                  <path 
                    d="M 120 40 Q 220 40, 200 100 T 110 160" 
                    stroke="url(#grad)" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4"
                    className="animate-[dash_20s_linear_infinite]"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Node 2 */}
                <div className="flex items-center gap-3 self-end bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 shadow-md w-40 transform hover:-translate-y-0.5 transition-transform">
                  <div className="h-2.5 w-2.5 rounded bg-purple-500 flex items-center justify-center">
                    <Activity className="h-1.5 w-1.5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-zinc-300">Filter Logic</span>
                    <span className="text-[9px] text-zinc-500">Condition Block</span>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="flex items-center gap-3 self-start bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 shadow-md w-40 transform hover:-translate-y-0.5 transition-transform">
                  <div className="h-2.5 w-2.5 rounded bg-indigo-500 flex items-center justify-center">
                    <GitBranch className="h-1.5 w-1.5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-zinc-300">Publish Flow</span>
                    <span className="text-[9px] text-zinc-500">Database Sync</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center max-w-sm">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Architect your workflow visually
              </h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Connect databases, trigger webhooks, and automate complex API orchestrations with ease.
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <div className="relative z-10 text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Archflow. All rights reserved.
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="flex flex-col justify-center items-center px-6 py-12 lg:col-span-7 bg-zinc-950/80">
          <div className="w-full max-w-md space-y-8">
            {/* Header info for mobile/tablet screens */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex lg:hidden h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25 mb-4">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text">
                Create an account
              </h1>
              <p className="mt-2.5 text-sm text-zinc-400">
                Start designing and orchestrating your workflows today.
              </p>
            </div>

            {/* Success & Error alerts */}
            {isSuccess && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-emerald-400 backdrop-blur-xl animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Account created successfully!</span>
                  <span className="text-xs text-emerald-500/90 mt-0.5">Redirecting you to the sign-in page...</span>
                </div>
              </div>
            )}

            {apiError && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-rose-400 backdrop-blur-xl animate-fade-in">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Sign up failed</span>
                  <span className="text-xs text-rose-400/90 mt-0.5">{apiError}</span>
                </div>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      className={`w-full bg-zinc-900/60 border ${
                        errors.name ? 'border-rose-500/60 focus:ring-rose-500/20' : 'border-zinc-800/80 focus:border-indigo-500/80 focus:ring-indigo-500/10'
                      } rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-4 transition-all bg-clip-padding backdrop-blur-sm`}
                      {...register('name', { 
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' } 
                      })}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1 animate-fade-in">
                      <AlertCircle className="h-3 w-3" /> {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="jane.doe@example.com"
                      className={`w-full bg-zinc-900/60 border ${
                        errors.email ? 'border-rose-500/60 focus:ring-rose-500/20' : 'border-zinc-800/80 focus:border-indigo-500/80 focus:ring-indigo-500/10'
                      } rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-4 transition-all bg-clip-padding backdrop-blur-sm`}
                      {...register('email', { 
                        required: 'Email address is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1 animate-fade-in">
                      <AlertCircle className="h-3 w-3" /> {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Password
                    </label>
                    <span className="text-[11px] text-zinc-500">Min. 6 characters</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`w-full bg-zinc-900/60 border ${
                        errors.password ? 'border-rose-500/60 focus:ring-rose-500/20' : 'border-zinc-800/80 focus:border-indigo-500/80 focus:ring-indigo-500/10'
                      } rounded-xl py-3 pl-11 pr-11 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-4 transition-all bg-clip-padding backdrop-blur-sm`}
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1 animate-fade-in">
                      <AlertCircle className="h-3 w-3" /> {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:hover:shadow-none cursor-pointer"
              >
                <div className="flex h-12 items-center justify-center rounded-[11px] bg-zinc-950/90 hover:bg-zinc-950/20 transition-colors px-6">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-semibold tracking-wide">
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </button>

              {/* Sign in redirect */}
              <p className="text-center text-sm text-zinc-500">
                Already have an account?{' '}
                <Link 
                  href="/signin" 
                  className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 hover:underline-offset-2 transition-all"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
