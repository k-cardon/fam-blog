import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const deletedRecipe = await prisma.recipe.delete({
      where: { slug }, 
    });

    return NextResponse.json(deletedRecipe, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while deleting the recipe' }, { status: 500 });
  }
}
