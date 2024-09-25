export type Recipe = {
  id: number; 
  title: string;
  slug: string;
  ingredients: string[]; 
  instructions: string;
  notes?: string; 
  author: string; 
  link?: string; 
  image?: string; 
  tags: string[]; 
  date: string; 
};