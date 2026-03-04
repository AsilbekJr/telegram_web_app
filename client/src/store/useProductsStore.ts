import { create } from 'zustand';
import type { Product } from '../types';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  activeCategory: string | null;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string | null) => void;
  fetchProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  activeCategory: null,
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().fetchProducts();
  },
  setActiveCategory: (category: string | null) => {
    set({ activeCategory: category });
    get().fetchProducts();
  },
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, activeCategory } = get();
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (activeCategory) queryParams.append('category', activeCategory);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetch(`${baseUrl}/api/products${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      set({ products: data, isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
