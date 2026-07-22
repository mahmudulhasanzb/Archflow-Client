import { authClient } from '../auth-client';

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    const res = await authClient.$fetch<{ token?: string }>('/api/auth/token');
    const token = res?.data?.token || (res as any)?.token;
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
  } catch (err) {
    console.error('Error getting JWT token from authClient:', err);
  }
  return {};
};
