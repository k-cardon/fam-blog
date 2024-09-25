import Container from "@/app/_components/container";
import { HeroRecipe } from "@/app/_components/hero-recipe";
import { Intro } from "@/app/_components/intro";
import { MoreRecipes } from "@/app/_components/more-recipes";
import { getServerSession } from "next-auth";
import { Recipe } from "@/interfaces/recipe";


async function getAllRecipes(): Promise<Recipe[]> {
  const res = await fetch('http://localhost:3000/api/recipes', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return res.json();
}

export default async function Home() {
  const session = await getServerSession();
  const allRecipes = await getAllRecipes();

  const heroRecipe = allRecipes[0];
  const moreRecipes = allRecipes.slice(1);

  return (
    <main>
      {session?.user?.name ? (
        <>
          <Container>
            <Intro />
            <HeroRecipe
              title={heroRecipe.title}
              image={heroRecipe.image || '/assets/default.jpeg'}
              date={heroRecipe.date}
              author={heroRecipe.author}
              slug={heroRecipe.slug}
              excerpt={heroRecipe.instructions.substring(0, 200) + '...'}
            />
            {moreRecipes.length > 0 && <MoreRecipes recipes={moreRecipes} />}
          </Container>
        </>
      ) : (
        <div>Not logged in</div>
      )}
    </main>
  );
}
