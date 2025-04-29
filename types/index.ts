export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    image: string;
    category: string;
    weight: string;
    inStock: boolean;
    rating: number;
    nutritionalInfo?: {
      calories: string;
      protein: string;
      fat: string;
      carbs: string;
    };
    tags?: string[];
  }
  
  export interface Category {
    id: string;
    name: string;
    image: string;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Address {
    id: string;
    type: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }
  
  export interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    addresses: Address[];
    currentLocation?: {
      address: string;
      coords?: {
        latitude: number;
        longitude: number;
        altitude?: number | null;
        accuracy?: number | null;
        altitudeAccuracy?: number | null;
        heading?: number | null;
        speed?: number | null;
      };
    };
  }
  
  export interface DeliveryPerson {
    name: string;
    phone: string;
    image?: string;
  }
  
  export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    deliveryAddress: Address;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: string;
    estimatedDelivery?: string;
    trackingInfo?: {
      currentStatus: string;
      currentLocation?: string;
      deliveryPerson?: DeliveryPerson;
    };
  }