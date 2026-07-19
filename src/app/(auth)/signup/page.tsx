'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import { Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

type Inputs = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Watch password for real-time validation
  const passwordVal = watch('password', '');
  const hasMinLength = passwordVal.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordVal);
  const hasLowercase = /[a-z]/.test(passwordVal);

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { name, email, password } = data;

    if (!hasMinLength || !hasUppercase || !hasLowercase) {
      toast.error('Please meet all password complexity requirements.');
      return;
    }

    const toastId = toast.loading('Creating account...');

    try {
      const { data: authData, error: signUpError } =
        await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: '/workspace',
        });

      if (signUpError) {
        toast.error(signUpError.message || 'Failed to create account.', {
          id: toastId,
        });
      } else {
        toast.success('Account created successfully!', {
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
            Create your account
          </h2>

          <p className="mt-2 text-center text-sm text-[#6B7280]">
            Or{' '}
            <Link
              href="/signin"
              className="font-display font-medium text-[#0D9488] transition-colors hover:text-[#0b7a70]"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              {...register('name', {
                required: 'Name is required',
              })}
              className="w-full rounded-lg border border-[#E1E4EA] bg-[#F1F3F6]/50 px-3.5 py-2 text-sm text-[#181B20] placeholder-[#6B7280] transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Email Address
            </label>

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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  validate: {
                    minLength: value =>
                      value.length >= 8 ||
                      'Password must be at least 8 characters.',
                    uppercase: value =>
                      /[A-Z]/.test(value) ||
                      'Password must contain at least one uppercase letter.',
                    lowercase: value =>
                      /[a-z]/.test(value) ||
                      'Password must contain at least one lowercase letter.',
                  },
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

          {/* Password Rules */}
          <div className="mt-4 space-y-2 border-t border-[#E1E4EA] pt-2">
            <div className="flex items-center space-x-2 text-xs">
              <span
                className={`rounded-full p-0.5 ${
                  hasMinLength
                    ? 'bg-green-600 text-white'
                    : 'bg-[#F1F3F6] text-[#6B7280]'
                }`}
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </span>

              <span
                className={
                  hasMinLength
                    ? 'font-semibold text-[#181B20]'
                    : 'text-[#6B7280]'
                }
              >
                8+ characters
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span
                className={`rounded-full p-0.5 ${
                  hasUppercase
                    ? 'bg-green-600 text-white'
                    : 'bg-[#F1F3F6] text-[#6B7280]'
                }`}
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </span>

              <span
                className={
                  hasUppercase
                    ? 'font-semibold text-[#181B20]'
                    : 'text-[#6B7280]'
                }
              >
                1 uppercase letter
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span
                className={`rounded-full p-0.5 ${
                  hasLowercase
                    ? 'bg-green-600 text-white'
                    : 'bg-[#F1F3F6] text-[#6B7280]'
                }`}
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </span>

              <span
                className={
                  hasLowercase
                    ? 'font-semibold text-[#181B20]'
                    : 'text-[#6B7280]'
                }
              >
                1 lowercase letter
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full justify-center rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3f37c9] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}
