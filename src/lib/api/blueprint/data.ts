import { baseURL, getAuthHeaders } from '../baseUrl';

export const getBlueprintsByUserEmail = async (userEmail: string) => {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${baseURL}/api/my-blueprints/${encodeURIComponent(userEmail)}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blueprints: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    return [];
  }
};

export const getUserQuota = async (userEmail: string) => {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${baseURL}/api/user/quota/${encodeURIComponent(userEmail)}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quota: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user quota:', error);
    return {
      role: 'free',
      count: 0,
      max: 3,
      remaining: 3,
      canGenerate: true,
      isPro: false,
    };
  }
};