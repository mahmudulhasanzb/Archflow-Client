import { baseUrl, getAuthHeaders } from './baseUrl';

// serverMutation with JWT Authorization (safe for both client and server components)
export const serverMutation = async (
  path: string,
  method: string = 'POST',
  data?: any,
  customHeaders?: Record<string, string>,
) => {
  let authHeaders = customHeaders || {};

  if (!customHeaders || Object.keys(customHeaders).length === 0) {
    authHeaders = await getAuthHeaders();
  }

  const formattedPath = path.startsWith('/') ? path : `/${path}`;

  const res = await fetch(`${baseUrl}${formattedPath}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body:
      data !== undefined && method !== 'GET' ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.msg ||
        errorData?.error ||
        `Request failed with status ${res.status}`,
    );
  }

  return res.json();
};

export const deleteMutation = async (
  path: string,
  customHeaders?: Record<string, string>,
) => {
  return serverMutation(path, 'DELETE', undefined, customHeaders);
};
