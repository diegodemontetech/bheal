import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  weight: number;
  stock: number;
  category: string;
  sku: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductStore {
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Barreira Óssea 15x20mm',
    description: 'Barreira óssea reabsorvível para regeneração tecidual guiada',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500',
    weight: 0.015,
    stock: 100,
    category: 'Barreiras',
    sku: 'BAR-15X20'
  },
  {
    id: '2',
    name: 'Barreira Óssea 20x30mm',
    description: 'Barreira óssea reabsorvível para regeneração tecidual guiada',
    price: 650.00,
    image: 'https://images.unsplash.com/photo-1584363854442-d9f8ef05f777?w=500',
    weight: 0.020,
    stock: 80,
    category: 'Barreiras',
    sku: 'BAR-20X30'
  },
  {
    id: '3',
    name: 'Kit Cirúrgico Premium',
    description: 'Kit completo com instrumentais para cirurgia oral',
    price: 2500.00,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500',
    weight: 1.500,
    stock: 20,
    category: 'Kits',
    sku: 'KIT-PREM'
  },
  {
    id: '4',
    name: 'Barreira Óssea 30x40mm',
    description: 'Barreira óssea reabsorvível para regeneração tecidual guiada',
    price: 850.00,
    image: 'https://images.unsplash.com/photo-1583912267550-d44c9c34c412?w=500',
    weight: 0.030,
    stock: 60,
    category: 'Barreiras',
    sku: 'BAR-30X40'
  },
  {
    id: '5',
    name: 'Kit Básico de Instrumentais',
    description: 'Kit básico com instrumentais essenciais',
    price: 1200.00,
    image: 'https://images.unsplash.com/photo-1584017911776-d0e50a347d9a?w=500',
    weight: 1.000,
    stock: 30,
    category: 'Kits',
    sku: 'KIT-BAS'
  }
];

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  cart: [],
  loading: false,
  error: null,

  addToCart: (productId: string, quantity: number) => 
    set((state) => {
      const existingItem = state.cart.find(item => item.productId === productId);
      if (existingItem) {
        return {
          cart: state.cart.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      return {
        cart: [...state.cart, { productId, quantity }]
      };
    }),

  removeFromCart: (productId: string) =>
    set((state) => ({
      cart: state.cart.filter(item => item.productId !== productId)
    })),

  updateCartQuantity: (productId: string, quantity: number) =>
    set((state) => ({
      cart: state.cart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    })),

  clearCart: () => set({ cart: [] })
}));