import RecipeIndex from "@/app/_components/recipe-index";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RecipesPage() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <RecipeIndex />
    </div>
  );
}