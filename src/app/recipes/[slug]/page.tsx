import { notFound, redirect } from "next/navigation";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import { Recipe as RecipeType } from "@/interfaces/recipe";
import { getBaseUrl } from '@/lib/getBaseUrl';
import { getServerSession } from "next-auth";
import Link from "next/link";

async function getRecipeBySlug(slug: string): Promise<RecipeType | null> {
  const res = await fetch(`${getBaseUrl()}/api/recipes?slug=${slug}`);
  if (!res.ok) return null;
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
      <div className='md:mx-10 md:px-10'>
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={recipe.title}
            image={recipe.image || '/assets/default.jpeg'}
            date={recipe.date}
            author={recipe.author}
          />
          <div className='text-center text-2xl font-bold'>{recipe.title}</div>
          <div className="mt-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 pl-5">Ingredients</h2>
            <ul className="list-none list-inside pl-10">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="mb-2">{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-lg">
          <PostBody content={recipe.instructions} />
          </div>
          {recipe.notes && (
            <div className="mt-8 max-w-xl mx-auto pl-5">
              <h2 className="text-2xl font-bold mb-4">Notes</h2>
              <p className="text-gray-700">{recipe.notes}</p>
            </div>
          )}
          {recipe.link && (
            <div className="mt-8 max-w-xl mx-auto pl-10">
              <Link href={recipe.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                Original Recipe Link
              </Link>
            </div>
          )}

          <div className="mt-8 max-w-xl mx-auto pl-10">
            <Link href={`/update/${params.slug}`} className="text-green-600 hover:underline">
              Update recipe
            </Link>
          </div>

          <div className="mt-8 max-w-xl mx-auto pl-5">
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
      </div>
  );
}

type Params = {
  params: {
    slug: string;
  };
};
