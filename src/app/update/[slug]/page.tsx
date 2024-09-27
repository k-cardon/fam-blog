'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import RecipeForm from '@/app/_components/recipe-form';
import { Recipe } from "@/interfaces/recipe";

const UpdateRecipePage = () => {
  const pathname = usePathname();
  const slug = pathname.split('/').pop(); // Extract slug from path
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes?slug=${slug}`);
        if (!res.ok) throw new Error('Failed to fetch recipe');
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug]);

  if (loading) return <div>Loading recipe...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {recipe && <RecipeForm existingRecipe={recipe} />}
    </div>
  );
};

export default UpdateRecipePage;










// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import RecipeForm from '@/app/_components/recipe-form';
// import { Recipe } from "@/interfaces/recipe";
// import { usePathname } from 'next/navigation'


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import RecipeForm from '@/app/_components/recipe-form';
// import { Recipe } from "@/interfaces/recipe";

// const UpdateRecipePage = () => {
//   const searchParams = useSearchParams();
//   const slug = searchParams.get('slug');
//   const [recipe, setRecipe] = useState<Recipe | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchRecipe = async () => {
//       try {
//         const res = await fetch(`/api/recipes?slug=${slug}`);
//         if (!res.ok) throw new Error('Failed to fetch recipe');
//         const data = await res.json();
//         setRecipe(data);
//       } catch (err) {
//         setError('Failed to load recipe');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipe();
//   }, [slug]);

//   if (loading) return <div>Loading recipe...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Update Recipe</h1>
//       {recipe && <RecipeForm existingRecipe={recipe} />}
//     </div>
//   );
// };

// export default UpdateRecipePage;






// const UpdateRecipePage = () => {
//   const router = useRouter();
//   const { slug } = router.query; 
//   const [recipe, setRecipe] = useState<Recipe | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Ensure slug is defined before fetching
//     if (!slug) return;

//     const fetchRecipe = async () => {
//       try {
//         const res = await fetch(`/api/recipes?slug=${slug}`);
//         if (!res.ok) throw new Error('Failed to fetch recipe');
//         const data = await res.json();
//         setRecipe(data);
//       } catch (err) {
//         setError('Failed to load recipe');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipe();
//   }, [slug]);

//   if (loading) return <div>Loading recipe...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Update Recipe</h1>
//       {recipe && <RecipeForm existingRecipe={recipe} />}
//     </div>
//   );
// };

// export default UpdateRecipePage;























// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
// import RecipeForm from '@/app/_components/recipe-form';
// import { Recipe } from '@/interfaces/recipe'; 

// type SearchParams = { [key: string]: string | string[] | undefined };

// async function fetchRecipeToUpdate(slug: string | undefined): Promise<Recipe | null> {
//   if (!slug) {
//     return null; 
//   }

//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${slug}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch recipe');
//     }
//     const recipe: Recipe = await response.json();
//     return recipe;
//   } catch (error) {
//     console.error('Error fetching recipe:', error);
//     return null;
//   }
// }

// export default async function UpdateRecipe({ searchParams }: { searchParams: SearchParams }) {
//   const session = await getServerSession();
//   if (!session || !session.user) {
//     redirect("/api/auth/signin");
//   }

//   const recipeToUpdate = await fetchRecipeToUpdate(searchParams.slug as string);

//   return (
//     <RecipeForm existingRecipe={recipeToUpdate} />
//   );
// }