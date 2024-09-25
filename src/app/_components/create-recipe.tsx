"use client";

import { useState } from 'react';
import { uploadImage } from '../actions/uploadImage'; 

const CreateRecipe = () => {
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
  
    try {
      let uploadedImageURL = '';
  
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
  
        try {
          const result = await uploadImage(formData);
          uploadedImageURL = result.url;
        } catch (uploadError) {
          throw new Error('Image upload failed. Please try again.');
        }
      }
  
      const recipeData = {
        title,
        slug,
        ingredients,
        instructions,
        author,
        link,
        imageURL: uploadedImageURL,
      };
  
      const res = await fetch('/api/create-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
  
      if (!res.ok) {
        throw new Error('Failed to create recipe. Please try again.');
      }
  
      const newRecipe = await res.json();
      console.log('Recipe created:', newRecipe);
      setTitle('');
      setSlug('');
      setIngredients('');
      setInstructions('');
      setAuthor('');
      setLink('');
      setImageFile(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">Create a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={slug}
            readOnly
            placeholder="Slug (auto-generated)"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredients"
            required
            className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions"
            required
            className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:bg-green-300"
        >
          {isUploading ? 'Creating Recipe...' : 'Create Recipe'}
        </button>
      </form>
      {error && (
      <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    )}
    </div>
  );
};

export default CreateRecipe;
