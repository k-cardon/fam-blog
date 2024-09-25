import Container from "@/app/_components/container";
import { HeroRecipe } from "@/app/_components/hero-recipe";
import { Intro } from "@/app/_components/intro";
import { MoreRecipes } from "@/app/_components/more-recipes";
import { getServerSession } from "next-auth";
import { Recipe } from "@/interfaces/recipe";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function getAllRecipes(): Promise<Recipe[]> {
  const url = `${getBaseUrl()}/api/recipes`;
  console.log('Fetching recipes from:', url);
  
  try {
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API response not ok:', res.status, errorText);
      throw new Error(`API responded with status ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Fetched recipes:', data);
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export default async function Home() {
  const session = await getServerSession();
  let allRecipes: Recipe[] = [];
  let error: string | null = null;

  try {
    allRecipes = await getAllRecipes();
  } catch (e) {
    console.error("Failed to fetch recipes:", e);
    error = "Failed to load recipes. Please try again later.";
  }

  const heroRecipe = allRecipes[0];
  const moreRecipes = allRecipes.slice(1);

  return (
    <main>
      {session?.user?.name ? (
        <Container>
          <Intro />
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : heroRecipe ? (
            <>
              <HeroRecipe
                title={heroRecipe.title}
                image={heroRecipe.image || '/assets/default.jpeg'}
                date={heroRecipe.date}
                author={heroRecipe.author}
                slug={heroRecipe.slug}
                excerpt={heroRecipe.instructions.substring(0, 200) + '...'}
              />
              {moreRecipes.length > 0 && <MoreRecipes recipes={moreRecipes} />}
            </>
          ) : (
            <div>No recipes found.</div>
          )}
        </Container>
      ) : (
        <div>Not logged in</div>
      )}
    </main>
  );
}