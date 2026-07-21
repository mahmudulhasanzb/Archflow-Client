import { baseURL } from './baseUrl';

// serverFetch
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

//serverMutation
