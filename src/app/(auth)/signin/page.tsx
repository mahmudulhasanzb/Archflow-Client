'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import { Eye, EyeOff, Activity, Cpu, Layers, ShieldAlert, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

type Inputs = {
  email: string;
  password: string;
};

const FEATURES = [
  { icon: Cpu,        text: 'AI architect agent generates full schemas' },
  { icon: Layers,     text: 'Multi-agent pipeline with 4 specialists' },
  { icon: ShieldAlert,text: 'Security audit included in every blueprint' },
];

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ defaultValues: { email: '', password: '' } });

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    const toastId = toast.loading('Signing in...');
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/workspace',
      });
      if (error) {
        toast.error(error.message || 'Invalid email or password.', { id: toastId });
      } else {
        toast.success('Signed in successfully!', { id: toastId });
        router.push('/workspace');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.', { id: toastId });
    }
  };

  const handleDemoLogin = () => {
    const toastId = toast.loading('Logging in as Demo User...');
    document.cookie = 'better-auth.session_token=demo-session-token; path=/; max-age=2592000;';
    toast.success('Logged in as Demo User!', { id: toastId });
    router.push('/workspace');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      {/* ── Left brand panel ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] relative overflow-hidden">
        {/* Decorative orbs */}
        <div aria-hidden className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#0D9488]/20 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white font-display">Archflow</span>
        </div>

        {/* Headline */}
        <div className="relative space-y-6">
          <h2 className="text-4xl font-extrabold text-white font-display leading-tight">
            Architecture
            <br />
            starts with
            <br />
            <span className="text-[#86EFAC]">one idea.</span>
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
            Our multi-agent AI system turns a paragraph description into complete
            schemas, roadmaps, and code stubs — in seconds.
          </p>

          {/* Feature list */}
          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-xs text-indigo-200">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <p className="relative text-xs text-indigo-300">
          &copy; {new Date().getFullYear()} Archflow. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ───────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm space-y-8 animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <Activity className="h-6 w-6 text-[#4F46E5]" />
            <span className="text-lg font-bold text-[#181B20] font-display">Archflow</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#181B20] font-display">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-[#4F46E5] hover:underline">
                Sign up free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                })}
                className="w-full rounded-xl border border-[#E1E4EA] bg-[#F1F3F6]/50 px-4 py-2.5 text-sm text-[#181B20] placeholder-[#6B7280] transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full rounded-xl border border-[#E1E4EA] bg-[#F1F3F6]/50 px-4 py-2.5 pr-10 text-sm text-[#181B20] placeholder-[#6B7280] transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#181B20] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4F46E5]/25 transition-all hover:bg-[#4338CA] hover:shadow-[#4F46E5]/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-[#E1E4EA]" />
              <span className="mx-3 text-xs uppercase tracking-wider text-[#6B7280]">Or</span>
              <div className="flex-1 border-t border-[#E1E4EA]" />
            </div>

            {/* Demo login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E1E4EA] bg-white px-4 py-2.5 text-sm font-semibold text-[#4F46E5] transition-all hover:bg-[#EEF0FF] hover:border-[#4F46E5]/30"
            >
              <Zap className="h-4 w-4" />
              One Click Demo Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
