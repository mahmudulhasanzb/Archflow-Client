import { baseURL, getAuthHeaders } from './baseUrl';

// serverMutation with JWT Authorization
export const serverMutation = async (path: any, method: any, data: any) => {
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${baseURL}${formattedPath}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
