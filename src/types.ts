export interface ColorOption {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  hoverImage?: string;
  sizes: string[];
  colors: ColorOption[];
  description: string;
  tag?: 'New' | 'Bestseller' | 'Sale' | 'Limited';
  localStock: number;
  deliveryTime: string;
  reviews?: Review[];
}

export interface CartItem {
  id: string; // unique cart identifier (product.id + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  isLoggedIn: boolean;
}

export interface DeliveryStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  timestamp?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  deliveryOption: {
    id: string;
    name: string;
    price: number;
    time: string;
  };
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  status: 'placed' | 'preparing' | 'transit' | 'delivered';
  paymentMethod: string;
  steps: DeliveryStep[];
  courierName: string;
  courierPhone: string;
  etaMinutes: number;
}
