import { Recipe } from "@/interfaces/recipe";
import { PostPreview } from "./post-preview";

type Props = {
  recipes: Recipe[];
};

export function MoreRecipes({ recipes }: Props) {
  return (
    <section>
      <h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
        More Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {recipes.map((recipe) => (
          <PostPreview
            key={recipe.slug}
            title={recipe.title}
            image={recipe.image || '/assets/default.jpeg'}
            date={recipe.date}
            author={recipe.author}
            slug={recipe.slug}
            excerpt={recipe.instructions.substring(0, 200) + '...'}
          />
        ))}
      </div>
    </section>
  );
}
