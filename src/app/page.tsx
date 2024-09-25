import Container from "@/app/_components/container";
import { HeroRecipe } from "@/app/_components/hero-recipe";
import { Intro } from "@/app/_components/intro";
import { MoreRecipes } from "@/app/_components/more-recipes";
import { getServerSession } from "next-auth";
import { Recipe } from "@/interfaces/recipe";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function getAllRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${getBaseUrl()}/api/recipes`, { 
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return res.json();
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