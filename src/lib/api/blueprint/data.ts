import { baseURL } from "../baseUrl";

export const getBlueprintsByUserEmail = async (userEmail: string) => {
    try {
        const response = await fetch(`${baseURL}/api/my-blueprints/${userEmail}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blueprints');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching blueprints:', error);
        return [];
    }
}