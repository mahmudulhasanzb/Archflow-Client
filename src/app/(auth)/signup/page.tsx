'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import { Check, Eye, EyeOff, Activity, Cpu, Layers, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const FEATURES = [
  { icon: Cpu,         text: 'AI architect generates full schemas instantly' },
  { icon: Layers,      text: '4 specialized agents work in parallel' },
  { icon: ShieldAlert, text: 'Security & QA audit built in' },
];

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ defaultValues: { name: '', email: '', password: '' } });

  const passwordVal = watch('password', '');
  const hasMinLength = passwordVal.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordVal);
  const hasLowercase = /[a-z]/.test(passwordVal);

  const onSubmit: SubmitHandler<Inputs> = async ({ name, email, password }) => {
    if (!hasMinLength || !hasUppercase || !hasLowercase) {
      toast.error('Please meet all password complexity requirements.');
      return;
    }
    const toastId = toast.loading('Creating account...');
    try {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/workspace',
      });
      if (signUpError) {
        toast.error(signUpError.message || 'Failed to create account.', { id: toastId });
      } else {
        toast.success('Account created successfully!', { id: toastId });
        router.push('/workspace');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.', { id: toastId });
    }
  };

  const PasswordRule = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-xs">
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${met ? 'bg-[#16A34A]' : 'bg-[#F1F3F6]'}`}>
        <Check className={`h-2.5 w-2.5 stroke-[3] ${met ? 'text-white' : 'text-[#6B7280]'}`} />
      </span>
      <span className={met ? 'font-semibold text-[#181B20]' : 'text-[#6B7280]'}>{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      {/* ── Left brand panel ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] relative overflow-hidden">
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
            Build smarter.
            <br />
            Ship faster.
            <br />
            <span className="text-[#86EFAC]">Start today.</span>
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
            Join thousands of developers using AI-orchestrated architecture to
            plan, document, and review software projects in minutes.
          </p>

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
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Already have an account?{' '}
              <Link href="/signin" className="font-semibold text-[#4F46E5] hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
                className="w-full rounded-xl border border-[#E1E4EA] bg-[#F1F3F6]/50 px-4 py-2.5 text-sm text-[#181B20] placeholder-[#6B7280] transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Email Address
              </label>
              <input
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
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    validate: {
                      minLength: v => v.length >= 8 || 'At least 8 characters.',
                      uppercase: v => /[A-Z]/.test(v) || 'One uppercase letter.',
                      lowercase: v => /[a-z]/.test(v) || 'One lowercase letter.',
                    },
                  })}
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

              {/* Password rules */}
              {passwordVal.length > 0 && (
                <div className="mt-3 space-y-1.5 rounded-lg border border-[#E1E4EA] bg-[#FAFBFC] p-3">
                  <PasswordRule met={hasMinLength} label="8+ characters" />
                  <PasswordRule met={hasUppercase} label="1 uppercase letter" />
                  <PasswordRule met={hasLowercase} label="1 lowercase letter" />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4F46E5]/25 transition-all hover:bg-[#4338CA] hover:shadow-[#4F46E5]/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
