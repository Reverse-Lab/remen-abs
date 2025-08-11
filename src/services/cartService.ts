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
export async function loadCart() {
  if (user?.uid) {
    // 회원일 때: userCarts에서 로드
    return api("getUserCart", { userId: user.uid });
  } else {
    // 게스트일 때: carts에서 로드
    return api("getCart");
  }
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
}) {
  return api("addItem", item);
}

export async function updateCartItem(sku: string, qty?: number, checked?: boolean) {
  return api("updateItem", { sku, qty, checked });
}

export async function removeFromCart(sku: string) {
  return api("removeItem", { sku });
}

export async function clearCart() {
  return api("clearCart");
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
    imageUrl: item.imageUrl || '',
    quantity: item.qty || 1,
    inStock: item.inStock !== false,
    checked: item.checked !== false
  }));

  const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  return { items, totalItems, totalPrice };
}

// 회원 장바구니 가져오기
export const getUserCart = onRequest({
  region: "asia-northeast3",
}, async (req, res) => {
  try {
    // CORS 설정
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ok: false, error: "Method not allowed"});
      return;
    }

    const {userId} = req.body;
    
    if (!userId) {
      res.status(400).json({ok: false, error: "User ID is required"});
      return;
    }

    logger.info("Getting user cart", {userId});

    const userCartRef = db.collection("userCarts").doc(userId);
    const userCartDoc = await userCartRef.get();
    
    if (!userCartDoc.exists) {
      // 빈 장바구니 반환
      res.json({
        ok: true,
        cart: {
          id: userId,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      return;
    }

    const userCartData = userCartDoc.data();
    res.json({
      ok: true,
      cart: {
        id: userId,
        items: userCartData?.items || [],
        createdAt: userCartData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error("Error getting user cart:", error);
    res.status(500).json({ok: false, error: "Internal server error"});
  }
});

