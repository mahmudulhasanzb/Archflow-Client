import { baseURL, getAuthHeaders } from './baseUrl';
import { serverMutation, deleteMutation } from './mutation';

export interface UserApiKeyStatus {
  hasCustomKey: boolean;
  apiKey?: string;
  rawKey?: string;
  label?: string;
  usage?: number;
  limit?: number | null;
  limit_remaining?: number | null;
  is_free_tier?: boolean;
  isValid?: boolean;
  error?: string;
}

export interface SaveApiKeyResponse {
  success: boolean;
  message: string;
  keyData?: {
    label: string;
    usage: number;
    limit: number | null;
    limit_remaining: number | null;
    is_free_tier: boolean;
  };
}

// Fetch user custom OpenRouter key status & real-time balance
export async function getUserApiKeyStatus(): Promise<UserApiKeyStatus> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${baseURL}/api/user/api-key`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { hasCustomKey: false };
      }
      throw new Error(`Failed to fetch API key status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user API key status:', error);
    return { hasCustomKey: false };
  }
}

// Save & verify user custom OpenRouter key (uses project standard serverMutation)
export async function saveUserApiKey(apiKey: string): Promise<SaveApiKeyResponse> {
  return await serverMutation('/api/user/api-key', 'POST', { apiKey: apiKey.trim() });
}

// Disconnect / remove user custom OpenRouter key (uses project standard deleteMutation)
export async function deleteUserApiKey(): Promise<{ success: boolean; message: string }> {
  return await deleteMutation('/api/user/api-key');
}
