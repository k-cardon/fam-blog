"use client";

import React, { useState, useEffect } from 'react';
import { uploadImage } from '../actions/uploadImage'; 
import { Recipe } from '@/interfaces/recipe'; 

interface RecipeFormProps {
  existingRecipe?: Recipe | null;
}

const availableTags = ['Appetizer', 'Main', 'Side', 'Dessert', 'Drink', 'Snack', 'Breakfast', 'Vegan', 'Vegetarian', 'Dairy free', 'Kids', 'Other'];

const RecipeForm: React.FC<RecipeFormProps> = ({ existingRecipe = null }) => {
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [ingredients, setIngredients] = useState<Array<{ amount: string; name: string }>>([{ amount: '', name: '' }]);
  const [instructions, setInstructions] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(!!existingRecipe);


  useEffect(() => {
    if (existingRecipe) {
      setTitle(existingRecipe.title);
      setSlug(existingRecipe.slug);
      setIngredients(existingRecipe.ingredients.map(ing => {
        const [amount, ...nameParts] = ing.split(' ');
        return { amount, name: nameParts.join(' ') };
      }));
      setInstructions(existingRecipe.instructions);
      setNotes(existingRecipe.notes || '');
      setAuthor(existingRecipe.author);
      setLink(existingRecipe.link || '');
      setSelectedTags(existingRecipe.tags);
    }
  }, [existingRecipe]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') 
      .substring(0, 100);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle)); 
  };

  const handleIngredientChange = (index: number, field: 'amount' | 'name', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };
  
  const addIngredient = () => {
    setIngredients([...ingredients, { amount: '', name: '' }]);
  };
  
  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag) // Deselect tag
        : [...prevSelected, tag] // Select tag
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      let uploadedImageURL = existingRecipe?.image || '';
  
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const result = await uploadImage(formData);
        uploadedImageURL = result.url;
      }
  
      const formattedIngredients = ingredients
        .filter(ing => ing.amount.trim() !== '' || ing.name.trim() !== '')
        .map(ing => `${ing.amount} ${ing.name}`.trim());
  
      const formattedInstructions = instructions
        .split('\n')
        .filter(line => line.trim() !== '')
        .map((line, index) => `${index + 1}. ${line.trim()}`)
        .join('\n');
  
      const recipeData = {
        title,
        slug,
        ingredients: formattedIngredients,
        instructions: formattedInstructions,
        author,
        link,
        image: uploadedImageURL,
        tags: selectedTags,
        notes,
      };
  
      const endpoint = isUpdating ? `/api/update-recipe/${existingRecipe?.slug}` : '/api/create-recipe';
      const method = isUpdating ? 'PUT' : 'POST';
  
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        
        if (errorText.includes('slug')) {
          throw new Error('The slug must be unique. Please try a different title.');
        } else {
          throw new Error(existingRecipe ? 'Failed to update recipe.' : 'Failed to create recipe.');
        }
      }
  
      const responseRecipe = await res.json();
      console.log(existingRecipe ? 'Recipe updated:' : 'Recipe created:', responseRecipe);
      setSuccessMessage(existingRecipe ? 'Recipe updated successfully!' : 'Recipe created successfully!');
  
      if (!existingRecipe) {
        setTitle('');
        setSlug('');
        setIngredients([{ amount: '', name: '' }]);
        setInstructions('');
        setAuthor('');
        setLink('');
        setImageFile(null);
        setSelectedTags([]);
        setNotes('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!existingRecipe || !existingRecipe.slug) {
      setError("Cannot delete: Recipe not found");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/delete-recipe`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug: existingRecipe.slug }),
        });
  
        if (!res.ok) {
          throw new Error('Failed to delete recipe');
        }
  
        setSuccessMessage('Recipe deleted successfully!');
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred while deleting the recipe');
      }
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
<h1 className="text-2xl font-bold text-center m-4">{isUpdating ? 'Update Recipe' : 'Create a New Recipe'}</h1>      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              id="slug"
              value={slug}
              placeholder='auto-generates from title--must be unique!'
              readOnly
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-green-600">Ingredients</h2>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="w-1/3 p-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                placeholder="Ingredient"
                className="w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 px-2 py-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition duration-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            Add Ingredient
          </button>
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions (you can add line breaks for each new step or section of the recipe and the app will automatically number each paragraph for you)"
            required
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
            <input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link (optional)"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Add an image (optional)</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-green-600">Select Tags</h2>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <label key={tag} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Select one or more tags for your recipe.</p>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
        >
          {isUploading ? `${isUpdating ? 'Updating' : 'Creating'} Recipe...` : `${isUpdating ? 'Update' : 'Create'} Recipe`}
          </button>
          {existingRecipe && (
        <button
          type="button"
          onClick={handleDeleteRecipe}
          className="mt-4 ml-4 px-4  py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
        >
          Delete Recipe
        </button>
      )}
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-8 p-3 mx-auto bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default RecipeForm;