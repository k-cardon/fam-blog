import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import CreateRecipe from '@/app/_components/create-recipe';

export default async function ProtectedRoute() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
      <CreateRecipe />
  )}