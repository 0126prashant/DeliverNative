import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Address } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      loginWithPhone: async (phone: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would send an OTP to the phone number here
        // For demo purposes, we'll just set a flag
        set({ isLoading: false });
      },
      
      verifyOtp: async (otp: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, any OTP is valid
        if (otp.length === 4) {
          set({
            isAuthenticated: true,
            user: {
              id: '1',
              phone: '9876543210', // This would come from the previous step in a real app
              addresses: [],
              currentLocation: {
                address: 'Current Location',
              },
            },
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
          throw new Error('Invalid OTP');
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUserProfile: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      
      addAddress: (addressData: Omit<Address, 'id'>) => {
        const { user } = get();
        if (user) {
          const newAddress: Address = {
            ...addressData,
            id: Date.now().toString(),
          };
          
          // If this is the first address or marked as default, make it the default
          if (user.addresses.length === 0 || addressData.isDefault) {
            // First, make sure no other address is default
            const updatedAddresses = user.addresses.map(addr => ({
              ...addr,
              isDefault: false,
            }));
            
            set({
              user: {
                ...user,
                addresses: [...updatedAddresses, newAddress],
              },
            });
          } else {
            set({
              user: {
                ...user,
                addresses: [...user.addresses, newAddress],
              },
            });
          }
        }
      },
      
      updateAddress: (updatedAddress: Address) => {
        const { user } = get();
        if (user) {
          let updatedAddresses = user.addresses.map(addr => 
            addr.id === updatedAddress.id ? updatedAddress : addr
          );
          
          // If this address is being set as default, update other addresses
          if (updatedAddress.isDefault) {
            updatedAddresses = updatedAddresses.map(addr => ({
              ...addr,
              isDefault: addr.id === updatedAddress.id,
            }));
          }
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses,
            },
          });
        }
      },
      
      deleteAddress: (addressId: string) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
          
          // If we deleted the default address and there are other addresses, make the first one default
          if (
            user.addresses.find(addr => addr.id === addressId)?.isDefault &&
            updatedAddresses.length > 0
          ) {
            updatedAddresses[0].isDefault = true;
          }
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses,
            },
          });
        }
      },
      
      setDefaultAddress: (addressId: string) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId,
          }));
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses,
            },
          });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);