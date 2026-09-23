'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import { Check, Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import VerificationModal from '../VerificationModal';

type Inputs = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

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
      });
      if (signUpError) {
        toast.error(signUpError.message || 'Failed to create account.', {
          id: toastId,
        });
      } else {
        toast.dismiss(toastId);
        setUserEmail(email);
        setIsVerificationModalOpen(true);
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.', {
        id: toastId,
      });
    }
  };

  const PasswordRule = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
          met
            ? 'bg-emerald-600 text-white'
            : 'bg-muted border border-border text-muted-foreground'
        }`}
      >
        <Check
          className={`h-2.5 w-2.5 stroke-[3] ${met ? 'opacity-100' : 'opacity-0'}`}
        />
      </span>
      <span
        className={`transition-colors text-[11px] ${
          met ? 'font-semibold text-foreground' : 'text-muted-foreground'
        }`}
      >
        {label}
      </span>
    </div>
  );

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

      {/* Centered Floating Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl relative z-10 space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
            Create your account
          </h1>
          <p className="text-xs text-muted-foreground">
            Start generating deterministic 6-file architecture suites
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
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

            {/* Password Complexity Checklist */}
            <div className="pt-2 space-y-1.5 rounded-xl bg-muted/40 border border-border p-3">
              <PasswordRule met={hasMinLength} label="At least 8 characters" />
              <PasswordRule
                met={hasUppercase}
                label="At least 1 uppercase letter (A-Z)"
              />
              <PasswordRule
                met={hasLowercase}
                label="At least 1 lowercase letter (a-z)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer pt-2"
          >
            <span>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Card Footer Switch */}
        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-semibold text-foreground hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Explore as Guest Option */}
      <div className="mt-6 text-center relative z-10">
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>Explore blueprints as guest</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        email={userEmail}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
}
