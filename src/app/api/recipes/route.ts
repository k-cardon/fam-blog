import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Recipe as RecipeType } from "@/interfaces/recipe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const recipe = await prisma.recipe.findUnique({
        where: { slug }, 
      });

      if (!recipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
      }

      const formattedRecipe: RecipeType = {
        id: recipe.id,
        title: recipe.title,
        slug: recipe.slug,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        notes: recipe.notes || '',
        author: recipe.author,
        link: recipe.link || '',
        image: recipe.image || '', 
        tags: recipe.tags,
        date: recipe.date.toISOString(), 
      };

      return NextResponse.json(formattedRecipe, { status: 200 });
    } else {
      const recipes = await prisma.recipe.findMany();
      
      const formattedRecipes: RecipeType[] = recipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        slug: recipe.slug,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        notes: recipe.notes || '',
        author: recipe.author,
        link: recipe.link || '',
        image: recipe.image || '', 
        tags: recipe.tags,
        date: recipe.date.toISOString(), 
      }));

      return NextResponse.json(formattedRecipes, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching recipes' }, { status: 500 });
  }
}