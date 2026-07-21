import { baseURL } from './baseUrl';

// serverFetch
export const serverFetch = async (path: any) => {
  const res = await fetch(`${baseURL}${path}`, { cache: 'no-store' });

  if (!res.ok) {
    console.error(
      `Fetch error: ${res.status} ${res.statusText} for ${path}`,
    );
    return null;
  }

  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`JSON parse error for ${path}:`, error);
    return null;
  }
};


// get all blueprints
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


