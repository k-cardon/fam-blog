'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import RecipeForm from '@/app/_components/recipe-form';
import { Recipe } from "@/interfaces/recipe";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function UpdateRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split('/').pop(); 
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (!slug || status !== "authenticated") return;
    
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