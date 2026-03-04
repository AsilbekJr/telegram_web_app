import { create } from 'zustand';

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      set({ categories: data, isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
