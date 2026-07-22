import { baseURL, getAuthHeaders } from './baseUrl';

// serverFetch
export const serverFetch = async (path: any) => {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${baseURL}${path}`, {
    cache: 'no-store',
    headers: {
      ...authHeaders,
    },
  });

  if (!res.ok) {
    console.error(`Fetch error: ${res.status} ${res.statusText} for ${path}`);
    return null;
  }

  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`JSON parse error for ${path}:`, error);
    return null;
  }
};

// get all blueprints (public)
export const getAllBlueprints = async () => {
  const res = await fetch(`${baseURL}/api/all-blueprints`);
  if (!res.ok) {
    return null;
  }
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`JSON parse error for getAllBlueprints`, error);
    return null;
  }
};
