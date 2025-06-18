'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  path: string;
  year: number;
  color: string;
  mileage: number;
  quantity?: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        // Para carros, não aumentamos quantidade, apenas substituímos
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = { ...action.payload, quantity: 1 };

        return {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0
          ),
          itemCount: updatedItems.length,
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          items: newItems,
          total: newItems.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0
          ),
          itemCount: newItems.length,
        };
      }
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(
        item => item.id !== action.payload
      );
      return {
        items: filteredItems,
        total: filteredItems.reduce(
          (sum, item) => sum + item.price * (item.quantity || 1),
          0
        ),
        itemCount: filteredItems.length,
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * (item.quantity || 1),
          0
        ),
        itemCount: updatedItems.length,
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    case 'LOAD_CART':
      return {
        items: action.payload,
        total: action.payload.reduce(
          (sum, item) => sum + item.price * (item.quantity || 1),
          0
        ),
        itemCount: action.payload.length,
      };

    default:
      return state;
  }
};

const CartContext = createContext<{
  cartItems: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('carshop-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('carshop-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        total: state.total,
        itemCount: state.itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
