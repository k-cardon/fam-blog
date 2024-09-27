import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RecipeForm from '@/app/_components/recipe-form';

export default async function CreateRecipe() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
      <RecipeForm />
  )}