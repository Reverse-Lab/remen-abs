import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase';

// 제품 관련 서비스
export interface Product {
  id?: string;
  name: string;
  brand: string;
  model: string;
  year?: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls?: string[]; // 여러 이미지 URL을 저장하기 위한 속성 추가
  inStock: boolean;
  soldOut?: boolean; // 판매완료 상태 추가
  rating: number;
  inspectionResults?: {
    brakeTest: string;
    absTest: string;
    pressureTest: string;
    electricalTest: string;
  };
  createdAt?: Timestamp;
}

export const productService = {
  // 모든 제품 조회
  async getAllProducts(): Promise<Product[]> {
    try {
      if (!db) {
        console.error('Firestore not available');
        return [];
      }
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // 브랜드별 제품 조회
  async getProductsByBrand(brand: string): Promise<Product[]> {
    try {
      if (!db) {
        console.error('Firestore not available');
        return [];
      }
      const q = query(
        collection(db, 'products'), 
        where('brand', '==', brand),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw error;
    }
  },

  // 단일 제품 조회
  async getProduct(id: string): Promise<Product | null> {
    try {
      if (!db) {
        console.error('Firestore not available');
        return null;
      }
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // 제품 추가
  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // 제품 수정
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // 제품 삭제
  async deleteProduct(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // 제품 판매완료 상태 업데이트
  async markProductAsSoldOut(productId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, { 
        soldOut: true,
        inStock: false
      });
    } catch (error) {
      console.error('Error marking product as sold out:', error);
      throw error;
    }
  }
};

// 문의 관련 서비스
export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  carBrand: string;
  carModel: string;
  message: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt?: Timestamp;
}

export const inquiryService = {
  // 모든 문의 조회
  async getAllInquiries(): Promise<Inquiry[]> {
    try {
      if (!db) {
        console.error('Firestore not available');
        return [];
      }
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      throw error;
    }
  },

  // 문의 추가
  async addInquiry(inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = await addDoc(collection(db, 'inquiries'), {
        ...inquiry,
        status: 'pending',
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding inquiry:', error);
      throw error;
    }
  },

  // 문의 상태 업데이트
  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      throw error;
    }
  }
};

// 주문 관련 서비스
export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface OrderAddress {
  postalCode: string;
  address1: string;
  address2?: string;
}

export interface OrderRecipient {
  name: string;
  phone: string;
  address: OrderAddress;
}

export interface OrderShipping {
  method: 'standard' | 'express' | 'pickup';
  recipient: OrderRecipient;
  memo?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  status: 'pending' | 'payment_pending' | 'payment_completed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalAmount: number;
  finalAmount: number;
  shippingFee: number;
  discountAmount: number;
  customer: OrderCustomer;
  shipping: OrderShipping;
  items: OrderItem[];
  userId?: string;
}

export const orderService = {
  // 사용자별 주문 내역 조회
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      console.log('Fetching orders for userId:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!db) {
        console.error('Firestore not available');
        return [];
      }
      
      // 먼저 모든 주문을 가져와서 클라이언트에서 필터링 (임시 해결책)
      try {
        console.log('Trying to fetch all orders first...');
        const allOrdersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const allOrdersSnapshot = await getDocs(allOrdersQuery);
        console.log('All orders fetched, total count:', allOrdersSnapshot.size);
        
        // 클라이언트에서 userId로 필터링
        const userOrders = allOrdersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order => (order as any).userId === userId) as Order[];
        
        console.log('Filtered orders for user:', userOrders.length);
        return userOrders;
        
      } catch (allOrdersError) {
        console.error('Error fetching all orders:', allOrdersError);
        
        // 모든 주문을 가져올 수 없는 경우, 직접 쿼리 시도
        try {
          console.log('Trying direct user query...');
          const userQuery = query(
            collection(db, 'orders'), 
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          );
          
          const userOrdersSnapshot = await getDocs(userQuery);
          console.log('Direct user query result:', userOrdersSnapshot.size);
          
          const userOrders = userOrdersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          
          return userOrders;
          
        } catch (directQueryError) {
          console.error('Direct user query failed:', directQueryError);
          
          // 마지막 수단: 빈 배열 반환
          console.log('All query methods failed, returning empty array');
          return [];
        }
      }
      
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // 에러가 발생해도 빈 배열 반환 (사용자 경험 개선)
      console.log('Returning empty array due to error');
      return [];
    }
  },

  // 모든 주문 내역 조회 (관리자용)
  async getAllOrders(): Promise<Order[]> {
    try {
      if (!db) {
        console.error('Firestore not available');
        return [];
      }
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  // 단일 주문 조회
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      if (!db) {
        console.error('Firestore not available');
        return null;
      }
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // 주문 추가
  async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // 주문 상태 업데이트
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, { 
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // 주문 삭제
  async deleteOrder(orderId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not available');
      }
      const docRef = doc(db, 'orders', orderId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};

// 파일 업로드 서비스
export const fileService = {
  // 이미지 업로드
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      if (!storage) {
        throw new Error('Firebase Storage not available');
      }
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // 파일 삭제
  async deleteFile(path: string): Promise<void> {
    try {
      if (!storage) {
        throw new Error('Firebase Storage not available');
      }
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // URL에서 파일 삭제 (Firebase Storage URL을 경로로 변환하여 삭제)
  async deleteFileFromUrl(url: string): Promise<void> {
    try {
      if (!storage) {
        throw new Error('Firebase Storage not available');
      }
      // Firebase Storage URL에서 파일 경로 추출
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const path = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
      } else {
        throw new Error('Invalid Firebase Storage URL');
      }
    } catch (error) {
      console.error('Error deleting file from URL:', error);
      throw error;
    }
  }
}; 