'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import {
  Eye,
  EyeOff,
  Activity,
  Mail,
  Lock,
  Zap,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Inputs = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/workspace';
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
        callbackURL: callbackUrl,
      });
      if (error) {
        toast.error(error.message || 'Invalid email or password.', {
          id: toastId,
        });
      } else {
        toast.success('Signed in successfully!', { id: toastId });
        router.push(callbackUrl);
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.', {
        id: toastId,
      });
    }
  };

  /* ── DEMO LOGIN HANDLER (Easily toggled/removed when ready) ── */
  const handleDemoLogin = async () => {
    const toastId = toast.loading('Logging in as Demo User...');
    try {
      const { error } = await authClient.signIn.email({
        email: 'demo@gmail.com',
        password: 'DemoP@ssord',
        callbackURL: callbackUrl,
      });
      if (!error) {
        toast.success('Signed in as Demo User!', { id: toastId });
        router.push(callbackUrl);
      } else {
        toast.error(error.message || 'Demo login failed.', { id: toastId });
      }
    } catch {
      toast.error('Failed to log in as demo user.', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"
      />

      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] rounded-full bg-primary/10 blur-3xl"
      />

      {/* Top Logo */}
      <Link
        href="/"
        className="relative z-10 flex items-center gap-2.5 mb-8 group transition-opacity hover:opacity-90"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <Activity className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold font-display tracking-tight text-foreground">
          Archflow
        </span>
      </Link>

      {/* Centered Floating Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl relative z-10 space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
            Welcome back
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your credentials to access your architecture workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="email-address"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email-address"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                })}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer pt-2"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* ── DEMO LOGIN SECTION (Easily toggled/removed when ready) ── */}
          <div className="relative flex items-center pt-2">
            <div className="flex-1 border-t border-border" />
            <span className="mx-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              Or
            </span>
            <div className="flex-1 border-t border-border" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 hover:bg-muted px-4 py-2.5 text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>One Click Demo Login</span>
          </button>
          {/* ──────────────────────────────────────────────────────────── */}
        </form>

        {/* Card Footer Switch */}
        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-foreground hover:underline"
          >
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
}
