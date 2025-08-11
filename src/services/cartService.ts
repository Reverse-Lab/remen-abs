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
  ensureCartId();
  const res = await fetch(`/api/${path}`, {
    method: "POST",
    credentials: "include", // 쿠키 전송
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  return res.json();
}

// 장바구니 API 함수들
export async function loadCart() {
  return api("getCart");
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

