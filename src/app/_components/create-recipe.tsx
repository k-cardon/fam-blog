"use client";

import { useState } from 'react';
import { uploadImage } from '../actions/uploadImage'; 

const availableTags = ['Appetizer', 'Main', 'Side', 'Dessert', 'Snack', 'Breakfast', 'Vegan', 'Vegetarian', 'Dairy free', 'Kids', 'Other'];

const CreateRecipe = () => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    if (selectedTags.length === 0) {
      setError('Please select at least one tag.');
      setIsUploading(false);
      return;
    }
  
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

      const formattedIngredients = ingredients
      .filter(ing => ing.amount.trim() !== '' || ing.name.trim() !== '')
      .map(ing => `${ing.amount} ${ing.name}`.trim())
      .join('\n');

      const recipeData = {
        title,
        slug,
        ingredients: formattedIngredients.split('\n'), 
        instructions,
        author,
        link,
        imageURL: uploadedImageURL,
        tags: selectedTags,
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
      setSuccessMessage('Recipe added. Success!');
      
      setTitle('');
      setSlug('');
      setIngredients([]);
      setInstructions('');
      setAuthor('');
      setLink('');
      setImageFile(null);
      setSelectedTags([]);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-600">Create a New Recipe</h1>
      
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
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
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
            placeholder="Instructions"
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
          {isUploading ? 'Creating Recipe...' : 'Create Recipe'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default CreateRecipe;