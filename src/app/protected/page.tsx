import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import CreateRecipe from '@/app/_components/create-recipe';

export default async function ProtectedRoute() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      This is a protected route.
      <br />
      You will only see this if you are authenticated.
      <h1>Create a New Recipe</h1>
      <CreateRecipe />
    </div>
  );
}