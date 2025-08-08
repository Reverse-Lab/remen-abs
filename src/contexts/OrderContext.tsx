import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem } from './CartContext';

// 주문 상태 타입
export type OrderStatus = 
  | 'pending'      // 주문 대기
  | 'payment_pending' // 결제 대기
  | 'payment_completed' // 결제 완료
  | 'processing'   // 주문 처리 중
  | 'shipped'      // 배송 중
  | 'delivered'    // 배송 완료
  | 'cancelled'    // 주문 취소
  | 'refunded';    // 환불 완료

// 결제 방법 타입
export type PaymentMethod = 
  | 'card'         // 신용카드
  | 'bank_transfer' // 무통장입금
  | 'kakao_pay'    // 카카오페이
  | 'naver_pay'    // 네이버페이
  | 'toss_pay';    // 토스페이

// 배송 방법 타입
export type ShippingMethod = 
  | 'standard'     // 일반배송
  | 'express'      // 빠른배송
  | 'pickup';      // 픽업

// 주문자 정보
export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: {
    postalCode: string;
    address1: string;
    address2: string;
  };
}

// 배송 정보
export interface ShippingInfo {
  method: ShippingMethod;
  recipient: {
    name: string;
    phone: string;
    address: {
      postalCode: string;
      address1: string;
      address2: string;
    };
  };
  memo?: string;
}

// 결제 정보
export interface PaymentInfo {
  method: PaymentMethod;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  pgProvider?: string; // PG사 정보 (토스페이먼츠, 아임포트 등)
  paidAt?: Date;
}

// 주문 아이템
export interface OrderItem extends CartItem {
  orderPrice: number; // 주문 당시 가격 (가격 변동 대비)
}

// 주문 정보
export interface Order {
  id: string;
  orderNumber: string; // 주문번호 (예: 20241201-001)
  customer: OrderCustomer;
  items: OrderItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  status: OrderStatus;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

// 주문 상태
interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  loading: boolean;
  error: string | null;
}

// 주문 액션 타입
type OrderAction =
  | { type: 'CREATE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_ORDER_HISTORY'; payload: Order[] }
  | { type: 'CLEAR_CURRENT_ORDER' };

const initialState: OrderState = {
  currentOrder: null,
  orderHistory: [],
  loading: false,
  error: null,
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'CREATE_ORDER':
      return {
        ...state,
        currentOrder: action.payload,
        error: null,
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        currentOrder: state.currentOrder && state.currentOrder.id === action.payload.orderId
          ? { ...state.currentOrder, status: action.payload.status, updatedAt: new Date() }
          : state.currentOrder,
        orderHistory: state.orderHistory.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        ),
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'LOAD_ORDER_HISTORY':
      return {
        ...state,
        orderHistory: action.payload,
      };
    
    case 'CLEAR_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: null,
      };
    
    default:
      return state;
  }
};

// 주문 컨텍스트 타입
interface OrderContextType {
  state: OrderState;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  loadOrderHistory: () => Promise<void>;
  clearCurrentOrder: () => void;
  generateOrderNumber: () => string;
  calculateShippingFee: (method: ShippingMethod, totalAmount: number) => number;
  calculateDiscount: (totalAmount: number, couponCode?: string) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // 주문번호 생성 (YYYYMMDD-XXX 형식)
  const generateOrderNumber = (): string => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
                   (now.getMonth() + 1).toString().padStart(2, '0') +
                   now.getDate().toString().padStart(2, '0');
    
    // 실제 구현에서는 데이터베이스에서 순번을 가져와야 함
    const sequence = Math.floor(Math.random() * 999) + 1;
    return `${dateStr}-${sequence.toString().padStart(3, '0')}`;
  };

  // 배송비 계산
  const calculateShippingFee = (method: ShippingMethod, totalAmount: number): number => {
    switch (method) {
      case 'standard':
        return totalAmount >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
      case 'express':
        return totalAmount >= 100000 ? 0 : 5000; // 10만원 이상 무료배송
      case 'pickup':
        return 0;
      default:
        return 3000;
    }
  };

  // 할인 계산
  const calculateDiscount = (totalAmount: number, couponCode?: string): number => {
    // 실제 구현에서는 쿠폰 시스템과 연동
    if (couponCode === 'WELCOME10') {
      return Math.floor(totalAmount * 0.1); // 10% 할인
    }
    return 0;
  };

  // 주문 생성
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const orderNumber = generateOrderNumber();
      const now = new Date();
      
      const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderNumber,
        createdAt: now,
        updatedAt: now,
      };

      // 실제 구현에서는 데이터베이스에 저장
      console.log('Creating order:', newOrder);
      
      dispatch({ type: 'CREATE_ORDER', payload: newOrder });
      return newOrder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '주문 생성 중 오류가 발생했습니다.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 주문 상태 업데이트
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  // 주문 내역 로드
  const loadOrderHistory = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // 실제 구현에서는 API에서 주문 내역을 가져옴
      const mockOrders: Order[] = [];
      dispatch({ type: 'LOAD_ORDER_HISTORY', payload: mockOrders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '주문 내역을 불러오는 중 오류가 발생했습니다.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 현재 주문 클리어
  const clearCurrentOrder = () => {
    dispatch({ type: 'CLEAR_CURRENT_ORDER' });
  };

  const value: OrderContextType = {
    state,
    createOrder,
    updateOrderStatus,
    loadOrderHistory,
    clearCurrentOrder,
    generateOrderNumber,
    calculateShippingFee,
    calculateDiscount,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}; 