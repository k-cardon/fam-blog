import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import { Recipe as RecipeType } from "@/interfaces/recipe";
import { getBaseUrl } from '@/lib/getBaseUrl';
import { getServerSession } from "next-auth";

async function getRecipeBySlug(slug: string): Promise<RecipeType | null> {
  const res = await fetch(`${getBaseUrl()}/api/recipes?slug=${slug}`);
  if (!res.ok) return null;
  return res.json();
}

async function getAllRecipes(): Promise<RecipeType[]> {
  const res = await fetch(`${getBaseUrl()}/api/recipes`);
  if (!res.ok) return [];
  return res.json();
}

export default async function Recipe({ params }: Params) {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    return notFound();
  }

  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={recipe.title}
            image={recipe.image || '/assets/default.jpeg'}
            date={recipe.date}
            author={recipe.author}
          />
          <PostBody content={recipe.instructions} />
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="list-disc list-inside">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          {recipe.notes && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Notes</h2>
              <p>{recipe.notes}</p>
            </div>
          )}
          {recipe.link && (
            <div className="mt-8">
              <a href={recipe.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Original Recipe Link
              </a>
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    return notFound();
  }

  const title = `${recipe.title} | Recipe`;

  return {
    title,
    openGraph: {
      title,
      images: [recipe.image || '/assets/default.jpeg'],
    },
  };
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes();

  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}
