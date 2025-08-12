// 장바구니 ID 쿠키 관리
const CART_KEY = "cartId";

export function ensureCartId(): string {
  const m = document.cookie.match(new RegExp(`${CART_KEY}=([^;]+)`));
  if (m?.[1]) return m[1];
  const id = crypto.randomUUID();
  document.cookie = `${CART_KEY}=${id}; Max-Age=2592000; Path=/; SameSite=Lax; Secure`;
  return id;
}

// API 래퍼
async function api(path: string, body?: any) {
  const cartId = ensureCartId();
  const requestBody = {
    cartId,
    ...body
  };
  
  try {
    const res = await fetch(`/api/${path}`, {
      method: "POST",
      credentials: "include", // 쿠키 전송
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    
    // 응답이 JSON인지 확인
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // HTML 에러 페이지가 반환된 경우
      if (res.status === 404) {
        throw new Error('API endpoint not found. Please check if Firebase Functions are deployed.');
      } else {
        throw new Error(`Server returned ${res.status}: ${res.statusText}. Expected JSON response.`);
      }
    }
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// 장바구니 API 함수들
export async function loadGuestCart() {
  return api("getCart");
}

export async function loadUserCart(userId: string) {
  return api("getUserCart", { userId });
}

export async function addToCart(item: {
  sku: string;
  qty: number;
  priceAtAdd?: number;
  name?: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
  inStock?: boolean;
  userId?: string; // 회원 여부 확인용
}) {
  return api("addItem", item);
}

export async function updateCartItem(sku: string, qty?: number, checked?: boolean, userId?: string) {
  // 회원일 때는 userId를 cartId로 사용, 게스트일 때는 기존 cartId 사용
  const cartId = userId || ensureCartId();
  return api("updateItem", { sku, qty, checked, userId, cartId });
}

export async function removeFromCart(sku: string, userId?: string) {
  // 회원일 때는 userId를 cartId로 사용, 게스트일 때는 기존 cartId 사용
  const cartId = userId || ensureCartId();
  
  // 디버깅 로그 추가
  console.log('cartService.removeFromCart called with:', { sku, userId, cartId });
  
  const response = await api("removeItem", { sku, userId, cartId });
  
  // 응답 로그 추가
  console.log('cartService.removeFromCart response:', response);
  
  return response;
}

export async function clearCart(userId?: string) {
  // 회원일 때는 userId를 cartId로 사용, 게스트일 때는 기존 cartId 사용
  const cartId = userId || ensureCartId();
  return api("clearCart", { userId, cartId });
}

export async function mergeCartOnSignIn(userId: string) {
  return api("mergeCartOnSignIn", { userId });
}

// 장바구니 데이터 변환 유틸리티
export function transformCartData(cartData: any) {
  if (!cartData || !cartData.items) return { items: [], totalItems: 0, totalPrice: 0 };
  
  const items = cartData.items.map((item: any) => ({
    id: item.sku,
    sku: item.sku,
    name: item.name || 'Unknown Product',
    brand: item.brand || 'Unknown Brand',
    model: item.model || 'Unknown Model',
    price: item.priceAtAdd || 0,
    priceAtAdd: item.priceAtAdd || 0,
    imageUrl: item.imageUrl || '',
    quantity: item.qty || 1,
    inStock: item.inStock !== false,
    checked: item.checked !== false,
    addedAt: item.addedAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString()
  }));

  const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  return { items, totalItems, totalPrice };
}

