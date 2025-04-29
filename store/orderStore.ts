import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, CartItem, Address, DeliveryPerson } from '@/types';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  placeOrder: (items: CartItem[], address: Address, paymentMethod: string) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, trackingInfo?: { deliveryPerson?: DeliveryPerson }) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      
      placeOrder: async (items: CartItem[], address: Address, paymentMethod: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const totalAmount = items.reduce((total, item) => {
          const price = item.product.discountedPrice || item.product.price;
          return total + (price * item.quantity);
        }, 0);
        
        const newOrder: Order = {
          id: `ORD${Date.now()}`,
          items,
          totalAmount,
          status: 'confirmed',
          deliveryAddress: address,
          paymentMethod,
          paymentStatus: 'completed',
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
          trackingInfo: {
            currentStatus: 'Order confirmed and being prepared',
          },
        };
        
        set(state => ({
          orders: [newOrder, ...state.orders],
          isLoading: false,
        }));
        
        return newOrder;
      },
      
      getOrderById: (orderId: string) => {
        const { orders } = get();
        return orders.find(order => order.id === orderId);
      },
      
      cancelOrder: async (orderId: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          ),
          isLoading: false,
        }));
      },
      
      updateOrderStatus: async (orderId: string, status: string, trackingInfo = {}) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { 
                  ...order, 
                  status: status as Order['status'],
                  trackingInfo: {
                    ...order.trackingInfo,
                    currentStatus: getStatusMessage(status),
                    ...trackingInfo,
                  }
                }
              : order
          ),
          isLoading: false,
        }));
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

function getStatusMessage(status: string): string {
  switch (status) {
    case 'pending':
      return 'Order received and pending confirmation';
    case 'confirmed':
      return 'Order confirmed and being prepared';
    case 'preparing':
      return 'Your order is being prepared';
    case 'out_for_delivery':
      return 'Your order is out for delivery';
    case 'delivered':
      return 'Your order has been delivered';
    case 'cancelled':
      return 'Your order has been cancelled';
    default:
      return 'Order status updated';
  }
}