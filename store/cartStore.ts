import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  removeItemCompletely: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product: Product) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },
      
      removeFromCart: (productId: string) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === productId);
        
        if (existingItem && existingItem.quantity > 1) {
          set({
            items: items.map(item => 
              item.product.id === productId 
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          });
        } else {
          set({ items: items.filter(item => item.product.id !== productId) });
        }
      },
      
      removeItemCompletely: (productId: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.product.id !== productId) });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemQuantity: (productId: string) => {
        const { items } = get();
        const item = items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.product.discountedPrice || item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);