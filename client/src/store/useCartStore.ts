import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== productId)
    }));
  },
  decreaseQuantity: (productId) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return {
          items: state.items.map(item => 
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          )
        };
      } else {
         return {
          items: state.items.filter(item => item.id !== productId)
        };
      }
    });
  },
  clearCart: () => set({ items: [] }),
  totalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));
