import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { title, slug, ingredients, instructions, notes, author, link, image, tags } = await req.json();

  // Basic validation
  if (!title || !slug || !ingredients || !instructions || !author || !tags) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        slug,
        ingredients: Array.isArray(ingredients) ? ingredients : [ingredients], 
        instructions,
        notes: notes || null,
        author,
        link: link || null,
        image: image || null,
        tags: Array.isArray(tags) ? tags : [tags],
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while creating the recipe' }, { status: 500 });
  }
}
