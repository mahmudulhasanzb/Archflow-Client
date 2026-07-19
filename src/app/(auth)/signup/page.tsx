'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';

const SignUpPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: signUpError } = await signUp.email({
        email,
        password,
        name,
        callbackURL: '/workspace',
      });

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account.');
      } else {
        router.push('/workspace');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl border border-[#E1E4EA] shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#181B20] font-display">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#6B7280]">
            Or{' '}
            <Link
              href="/signin"
              className="font-medium text-[#0D9488] hover:text-[#0b7a70] transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-[#FFF0EA] p-3 text-sm text-[#EA5C34] border border-[#ffdbd0]">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                id="fullname"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="relative block w-full rounded-lg border border-[#E1E4EA] px-3 py-2 text-[#181B20] placeholder-[#6B7280] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] sm:text-sm bg-[#F1F3F6]/50"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-lg border border-[#E1E4EA] px-3 py-2 text-[#181B20] placeholder-[#6B7280] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] sm:text-sm bg-[#F1F3F6]/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-lg border border-[#E1E4EA] px-3 py-2 text-[#181B20] placeholder-[#6B7280] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] sm:text-sm bg-[#F1F3F6]/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3f37c9] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
