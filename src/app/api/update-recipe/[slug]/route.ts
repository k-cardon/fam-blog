import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  const { slug, title, ingredients, instructions, notes, author, link, image, tags } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const existingRecipe = await prisma.recipe.findUnique({
      where: { slug }, 
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { slug },
      data: {
        title: title !== undefined ? title : existingRecipe.title,
        ingredients: ingredients ? (Array.isArray(ingredients) ? ingredients : [ingredients]) : existingRecipe.ingredients,
        instructions: instructions !== undefined ? instructions : existingRecipe.instructions,
        notes: notes !== undefined ? notes : existingRecipe.notes,
        author: author !== undefined ? author : existingRecipe.author,
        link: link !== undefined ? link : existingRecipe.link,
        image: image !== undefined ? image : existingRecipe.image,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : existingRecipe.tags,
      },
    });

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while updating the recipe' }, { status: 500 });
  }
}
