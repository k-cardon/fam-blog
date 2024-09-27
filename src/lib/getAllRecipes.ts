import { getBaseUrl } from "@/lib/getBaseUrl";
import { Recipe } from "@/interfaces/recipe";


export async function getAllRecipes(): Promise<Recipe[]> {
    const url = `${getBaseUrl()}/api/recipes`;
    
    try {
      const res = await fetch(url, { 
        cache: 'no-store',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API response not ok:', res.status, errorText);
        throw new Error(`API responded with status ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }