import { baseURL, getAuthHeaders } from './baseUrl';

// serverFetch
export const serverFetch = async (path: any, options?: RequestInit) => {
  let authHeaders = {};
  if (typeof window !== 'undefined') {
    authHeaders = await getAuthHeaders();
  }
  const res = await fetch(`${baseURL}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      ...authHeaders,
      ...(options?.headers || {}),
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

export interface BlueprintsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  stack?: string;
  complexity?: string;
  sort?: string;
}

export interface PaginatedBlueprintsResponse {
  blueprints: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// get all blueprints (public feed with MongoDB queries)
export const getAllBlueprints = async (
  params?: BlueprintsQueryParams
): Promise<PaginatedBlueprintsResponse> => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.stack && params.stack !== 'All') query.set('stack', params.stack);
    if (params?.complexity && params.complexity !== 'All') query.set('complexity', params.complexity);
    if (params?.sort) query.set('sort', params.sort);

    const queryString = query.toString();
    const url = `${baseURL}/api/all-blueprints${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return { blueprints: [], total: 0, page: 1, limit: 6, totalPages: 1 };
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return {
        blueprints: data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }
    return data;
  } catch (error) {
    console.error(`JSON parse error for getAllBlueprints`, error);
    return { blueprints: [], total: 0, page: 1, limit: 6, totalPages: 1 };
  }
};
