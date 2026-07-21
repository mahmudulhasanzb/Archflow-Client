import { baseURL } from './baseUrl';

//serverMutation
export const serverMutation = async (path: any, method: any, data: any) => {
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${baseURL}${formattedPath}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
