import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  image?: string;
  isAvailable: boolean;
}

interface DeliveryPersonnelState {
  deliveryPersonnel: DeliveryPerson[];
  isLoading: boolean;
  addDeliveryPersonnel: (data: Omit<DeliveryPerson, 'id'>) => Promise<void>;
  updateDeliveryPersonnel: (id: string, data: Partial<Omit<DeliveryPerson, 'id'>>) => Promise<void>;
  removeDeliveryPersonnel: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

export const useDeliveryPersonnelStore = create<DeliveryPersonnelState>()(
  persist(
    (set, get) => ({
      deliveryPersonnel: [
        {
          id: '1',
          name: 'Rahul Kumar',
          phone: '9876543210',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
          isAvailable: true,
        },
        {
          id: '2',
          name: 'Priya Singh',
          phone: '9876543211',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
          isAvailable: true,
        },
        {
          id: '3',
          name: 'Amit Sharma',
          phone: '9876543212',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
          isAvailable: false,
        },
      ],
      isLoading: false,
      
      addDeliveryPersonnel: async (data) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newPerson: DeliveryPerson = {
          ...data,
          id: Date.now().toString(),
        };
        
        set(state => ({
          deliveryPersonnel: [...state.deliveryPersonnel, newPerson],
          isLoading: false,
        }));
      },
      
      updateDeliveryPersonnel: async (id, data) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          deliveryPersonnel: state.deliveryPersonnel.map(person => 
            person.id === id ? { ...person, ...data } : person
          ),
          isLoading: false,
        }));
      },
      
      removeDeliveryPersonnel: async (id) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          deliveryPersonnel: state.deliveryPersonnel.filter(person => person.id !== id),
          isLoading: false,
        }));
      },
      
      toggleAvailability: async (id) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          deliveryPersonnel: state.deliveryPersonnel.map(person => 
            person.id === id ? { ...person, isAvailable: !person.isAvailable } : person
          ),
          isLoading: false,
        }));
      },
    }),
    {
      name: 'delivery-personnel-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);