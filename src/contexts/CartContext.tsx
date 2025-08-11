import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  imageUrl: string;
  quantity: number;
  inStock: boolean;
  checked: boolean;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_CHECKED'; payload: { id: string; checked: boolean } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, items: action.payload, totalItems, totalPrice, loading: false, error: null };
    }
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return { ...state, items: updatedItems, totalItems, totalPrice };
      } else {
        const newItems = [...state.items, action.payload];
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return { ...state, items: newItems, totalItems, totalPrice };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return { ...state, items: updatedItems, totalItems, totalPrice };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return { ...state, items: updatedItems, totalItems, totalPrice };
    }
    
    case 'UPDATE_CHECKED': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, checked: action.payload.checked }
          : item
      );
      
      return { ...state, items: updatedItems };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], totalItems: 0, totalPrice: 0 };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  loadCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity' | 'checked'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  updateChecked: (id: string, checked: boolean) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  mergeCartOnSignIn: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // 장바구니 로드
  const loadCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      let response;
      if (user?.uid) {
        // 회원일 때: userCarts에서 로드
        response = await cartService.loadUserCart(user.uid);
      } else {
        // 게스트일 때: carts에서 로드
        response = await cartService.loadGuestCart();
      }
      
      if (response.ok && response.cart) {
        const transformedData = cartService.transformCartData(response.cart);
        dispatch({ type: 'LOAD_CART', payload: transformedData.items });
      } else {
        throw new Error(response.error || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user?.uid]);

  // 장바구니에 아이템 추가
  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity' | 'checked'>) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await cartService.addToCart({
        sku: item.sku,
        qty: 1,
        priceAtAdd: item.price,
        name: item.name,
        brand: item.brand,
        model: item.model,
        imageUrl: item.imageUrl,
        inStock: item.inStock
      });
      
      if (response.ok) {
        dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1, checked: true } });
        await loadCart(); // 서버에서 최신 데이터 로드
      } else {
        throw new Error(response.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to add item to cart' });
    }
  }, [loadCart]);

  // 장바구니에서 아이템 제거
  const removeFromCart = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const item = state.items.find(item => item.id === id);
      if (!item) return;
      
      const response = await cartService.removeFromCart(item.sku);
      
      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
      } else {
        throw new Error(response.error || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove item from cart' });
    }
  }, [state.items]);

  // 수량 업데이트
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const item = state.items.find(item => item.id === id);
      if (!item) return;
      
      const response = await cartService.updateCartItem(item.sku, quantity);
      
      if (response.ok) {
        if (quantity <= 0) {
          dispatch({ type: 'REMOVE_ITEM', payload: id });
        } else {
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
        }
      } else {
        throw new Error(response.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update quantity' });
    }
  }, [state.items]);

  // 체크 상태 업데이트
  const updateChecked = useCallback(async (id: string, checked: boolean) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const item = state.items.find(item => item.id === id);
      if (!item) return;
      
      const response = await cartService.updateCartItem(item.sku, undefined, checked);
      
      if (response.ok) {
        dispatch({ type: 'UPDATE_CHECKED', payload: { id, checked } });
      } else {
        throw new Error(response.error || 'Failed to update checked status');
      }
    } catch (error) {
      console.error('Failed to update checked status:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update checked status' });
    }
  }, [state.items]);

  // 장바구니 비우기
  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await cartService.clearCart();
      
      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
      } else {
        throw new Error(response.error || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to clear cart' });
    }
  }, []);

  // 로그인 시 장바구니 병합
  const mergeCartOnSignIn = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await cartService.mergeCartOnSignIn(user.uid);
      
      if (response.ok) {
        await loadCart(); // 병합된 장바구니 로드
      } else {
        throw new Error(response.error || 'Failed to merge cart');
      }
    } catch (error) {
      console.error('Failed to merge cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to merge cart' });
    }
  }, [user?.uid, loadCart]);

  // 사용자 변경 시 장바구니 로드
  useEffect(() => {
    if (user) {
      mergeCartOnSignIn();
    } else {
      loadCart();
    }
  }, [user, mergeCartOnSignIn, loadCart]);

  // 초기 로드
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const isInCart = (id: string) => {
    return state.items.some(item => item.id === id);
  };

  const getItemQuantity = (id: string) => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    state,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateChecked,
    clearCart,
    isInCart,
    getItemQuantity,
    mergeCartOnSignIn,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 