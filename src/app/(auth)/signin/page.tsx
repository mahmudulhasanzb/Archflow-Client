'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

type Inputs = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { email, password } = data;

    const toastId = toast.loading('Signing in...');

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/workspace',
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password.', {
          id: toastId,
        });
      } else {
        toast.success('Signed in successfully!', {
          id: toastId,
        });

        router.push('/workspace');
      }
    } catch (error) {
      console.error(error);

      toast.error('An unexpected error occurred. Please try again.', {
        id: toastId,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-[#E1E4EA] bg-white p-8 shadow-sm">
        <div>
          <h2 className="mt-6 text-center font-display text-3xl font-bold tracking-tight text-[#181B20]">
            Welcome back to <span className="text-[#4F46E5]">Archflow</span>
          </h2>

          <p className="mt-2 text-center text-sm text-[#6B7280]">
            Or{' '}
            <Link
              href="/signup"
              className="font-display font-medium text-[#0D9488] transition-colors hover:text-[#0b7a70]"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 rounded-md">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email-address"
                className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]"
              >
                Email Address
              </label>

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
                className="w-full rounded-lg border border-[#E1E4EA] bg-[#F1F3F6]/50 px-3.5 py-2 text-sm text-[#181B20] placeholder-[#6B7280] transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="w-full rounded-lg border border-[#E1E4EA] bg-[#F1F3F6]/50 px-3.5 py-2 pr-10 text-sm text-[#181B20] placeholder-[#6B7280] transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#181B20]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full justify-center rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3f37c9] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
