'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Recipe } from "@/interfaces/recipe";

const RecipeIndex: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/recipes');
        if (!res.ok) throw new Error('Failed to fetch recipes');
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>{error}</div>;

  const recipesByTag: Record<string, Recipe[]> = {};

  recipes.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!recipesByTag[tag]) {
        recipesByTag[tag] = [];
      }
      recipesByTag[tag].push(recipe);
    });
  });

    const sortedTags = Object.keys(recipesByTag).sort();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Recipe Index</h1>
      {sortedTags.map(tag => (
        <div key={tag} className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-green-600">{tag}</h2>
          <ul className="list-none">
            {recipesByTag[tag].map(recipe => (
              <li key={recipe.id} className="mb-4">
                <h3 className="text-xl font-semibold">
                  <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
                </h3>
                <p>By {recipe.author}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RecipeIndex;