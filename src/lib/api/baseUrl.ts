import { authClient } from '../auth-client';

export const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const baseURL = baseUrl;

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    if (typeof window !== 'undefined') {
      const res = await authClient.$fetch<{ token?: string }>('/token');
      const token = res?.data?.token || (res as any)?.token;
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        };
      }
    } else {
      // Server-side execution (Server Actions / SSR)
      const { headers } = await import('next/headers');
      const reqHeaders = await headers();
      const { auth } = await import('@/lib/auth');

      const authHeaders: Record<string, string> = {};

      try {
        const tokenRes = await auth.api.getToken({
          headers: reqHeaders,
        });
        const token = (tokenRes as any)?.token || (typeof tokenRes === 'string' ? tokenRes : null);
        if (token) {
          authHeaders['Authorization'] = `Bearer ${token}`;
        }
      } catch (tokenErr) {
        // Token extraction error fallback
      }

      try {
        const sessionRes = await auth.api.getSession({
          headers: reqHeaders,
        });
        if (sessionRes?.user) {
          if (sessionRes.user.email) authHeaders['x-user-email'] = sessionRes.user.email;
          if (sessionRes.user.id) authHeaders['x-user-id'] = sessionRes.user.id;
          authHeaders['x-internal-secret'] =
            process.env.INTERNAL_SERVER_SECRET || 'archflow-internal-secure-comm';
        }
      } catch (sessionErr) {
        // Session fallback
      }

      return authHeaders;
    }
  } catch (err) {
    console.error('Error getting auth headers:', err);
  }
  return {};
};
