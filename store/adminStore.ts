import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, hardcoded credentials
        if (username === 'admin' && password === 'admin123') {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }
      },
      
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);