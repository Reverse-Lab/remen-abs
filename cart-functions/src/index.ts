/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

// Firebase Admin 초기화
initializeApp();
const db = getFirestore();

// 장바구니 가져오기
export const getCart = onRequest({
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

    const {cartId} = req.body;

    if (!cartId) {
      res.status(400).json({ok: false, error: "Cart ID is required"});
      return;
    }

    logger.info("Getting cart", {cartId});

    const cartDoc = await db.collection("carts").doc(cartId).get();

    if (!cartDoc.exists) {
      // 빈 장바구니 반환
      res.json({
        ok: true,
        cart: {
          id: cartId,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      return;
    }

    const cartData = cartDoc.data();
    res.json({
      ok: true,
      cart: {
        id: cartId,
        items: cartData?.items || [],
        createdAt: cartData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Error getting cart:", error);
    res.status(500).json({ok: false, error: "Internal server error"});
  }
});

// 장바구니에 아이템 추가
export const addItem = onRequest({
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

    const {
      cartId,
      sku,
      qty,
      priceAtAdd,
      name,
      brand,
      model,
      imageUrl,
      inStock,
    } = req.body;

    if (!cartId || !sku) {
      res.status(400).json({
        ok: false,
        error: "Cart ID and SKU are required",
      });
      return;
    }

    logger.info("Adding item to cart", {cartId, sku, qty});

    const cartRef = db.collection("carts").doc(cartId);

    // 트랜잭션으로 장바구니 업데이트
    await db.runTransaction(async (transaction) => {
      const cartDoc = await transaction.get(cartRef);

      if (!cartDoc.exists) {
        // 새 장바구니 생성
        const newCart = {
          id: cartId,
          items: [{
            sku,
            qty: qty || 1,
            priceAtAdd: priceAtAdd || 0,
            name: name || "Unknown Product",
            brand: brand || "Unknown Brand",
            model: model || "Unknown Model",
            imageUrl: imageUrl || "",
            inStock: inStock !== false,
            checked: true,
            addedAt: new Date().toISOString(),
          }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        transaction.set(cartRef, newCart);
      } else {
        // 기존 장바구니에 아이템 추가/업데이트
        const cartData = cartDoc.data();
        const existingItems = cartData?.items || [];
        const existingItemIndex = existingItems.findIndex(
          (item: any) => item.sku === sku,
        );

        if (existingItemIndex >= 0) {
          // 기존 아이템 수량 증가
          existingItems[existingItemIndex].qty += (qty || 1);
          existingItems[existingItemIndex].updatedAt = new Date().toISOString();
        } else {
          // 새 아이템 추가
          existingItems.push({
            sku,
            qty: qty || 1,
            priceAtAdd: priceAtAdd || 0,
            name: name || "Unknown Product",
            brand: brand || "Unknown Brand",
            model: model || "Unknown Model",
            imageUrl: imageUrl || "",
            inStock: inStock !== false,
            checked: true,
            addedAt: new Date().toISOString(),
          });
        }

        transaction.update(cartRef, {
          items: existingItems,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    res.json({ok: true, message: "Item added to cart successfully"});
  } catch (error) {
    logger.error("Error adding item to cart:", error);
    res.status(500).json({ok: false, error: "Internal server error"});
  }
});

// 장바구니 아이템 업데이트
export const updateItem = onRequest({
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

    const {cartId, sku, qty, checked} = req.body;

    if (!cartId || !sku) {
      res.status(400).json({
        ok: false,
        error: "Cart ID and SKU are required",
      });
      return;
    }

    logger.info("Updating cart item", {cartId, sku, qty, checked});

    const cartRef = db.collection("carts").doc(cartId);

    await db.runTransaction(async (transaction) => {
      const cartDoc = await transaction.get(cartRef);

      if (!cartDoc.exists) {
        res.status(404).json({ok: false, error: "Cart not found"});
        return;
      }

      const cartData = cartDoc.data();
      const existingItems = cartData?.items || [];
      const existingItemIndex = existingItems.findIndex(
        (item: any) => item.sku === sku,
      );

      if (existingItemIndex < 0) {
        res.status(404).json({ok: false, error: "Item not found in cart"});
        return;
      }

      // 아이템 업데이트
      if (qty !== undefined) {
        if (qty <= 0) {
          // 수량이 0 이하면 아이템 제거
          existingItems.splice(existingItemIndex, 1);
        } else {
          existingItems[existingItemIndex].qty = qty;
          existingItems[existingItemIndex].updatedAt = new Date().toISOString();
        }
      }

      if (checked !== undefined) {
        existingItems[existingItemIndex].checked = checked;
        existingItems[existingItemIndex].updatedAt = new Date().toISOString();
      }

      transaction.update(cartRef, {
        items: existingItems,
        updatedAt: new Date().toISOString(),
      });
    });

    res.json({ok: true, message: "Cart item updated successfully"});
  } catch (error) {
    logger.error("Error updating cart item:", error);
    res.status(500).json({ok: false, error: "Internal server error"});
  }
});

// 장바구니에서 아이템 제거
export const removeItem = onRequest({
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

    const {cartId, sku} = req.body;

    if (!cartId || !sku) {
      res.status(400).json({
        ok: false,
        error: "Cart ID and SKU are required",
      });
      return;
    }

    logger.info("Removing item from cart", {cartId, sku});

    const cartRef = db.collection("carts").doc(cartId);

    await db.runTransaction(async (transaction) => {
      const cartDoc = await transaction.get(cartRef);

      if (!cartDoc.exists) {
        res.status(404).json({ok: false, error: "Cart not found"});
        return;
      }

      const cartData = cartDoc.data();
      const existingItems = cartData?.items || [];
      const filteredItems = existingItems.filter(
        (item: any) => item.sku !== sku,
      );

      transaction.update(cartRef, {
        items: filteredItems,
        updatedAt: new Date().toISOString(),
      });
    });

    res.json({ok: true, message: "Item removed from cart successfully"});
  } catch (error) {
    logger.error("Error removing item from cart:", error);
    res.status(500).json({ok: false, error: "Internal server error"});
  }
});

// 장바구니 비우기
export const clearCart = onRequest({
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

    const {cartId} = req.body;

    if (!cartId) {
      res.status(400).json({ok: false, error: "Cart ID is required"});
      return;
    }

    logger.info("Clearing cart", {cartId});

    const cartRef = db.collection("carts").doc(cartId);

    await cartRef.update({
      items: [],
      updatedAt: new Date().toISOString(),
    });

    res.json({ok: true, message: "Cart cleared successfully"});
  } catch (error) {
    logger.error("Error clearing cart:", error);
    res.status(500).json({ok: false, error: "Internal server error"});
  }
});

// 로그인 시 장바구니 병합
export const mergeCartOnSignIn = onRequest({
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

    const {cartId, userId} = req.body;

    if (!cartId || !userId) {
      res.status(400).json({
        ok: false,
        error: "Cart ID and User ID are required",
      });
      return;
    }

    logger.info("Merging cart on sign in", {cartId, userId});

    // 게스트 장바구니 가져오기
    const guestCartDoc = await db.collection("carts").doc(cartId).get();

    if (!guestCartDoc.exists) {
      res.json({ok: true, message: "No guest cart to merge"});
      return;
    }

    const guestCartData = guestCartDoc.data();
    const guestItems = guestCartData?.items || [];

    if (guestItems.length === 0) {
      res.json({ok: true, message: "Guest cart is empty"});
      return;
    }

    // 사용자 장바구니 가져오기
    const userCartRef = db.collection("userCarts").doc(userId);
    const userCartDoc = await userCartRef.get();

    if (!userCartDoc.exists) {
      // 사용자 장바구니가 없으면 게스트 장바구니를 사용자 장바구니로 이동
      await userCartRef.set({
        userId,
        items: guestItems,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // 사용자 장바구니와 게스트 장바구니 병합
      const userCartData = userCartDoc.data();
      const userItems = userCartData?.items || [];

      // SKU별로 아이템 병합
      const mergedItems = [...userItems];

      guestItems.forEach((guestItem: any) => {
        const existingItemIndex = mergedItems.findIndex(
          (item: any) => item.sku === guestItem.sku,
        );

        if (existingItemIndex >= 0) {
          // 기존 아이템이 있으면 수량 증가
          mergedItems[existingItemIndex].qty += guestItem.qty;
          mergedItems[existingItemIndex].updatedAt = new Date().toISOString();
        } else {
          // 새 아이템 추가
          mergedItems.push({
            ...guestItem,
            addedAt: new Date().toISOString(),
          });
        }
      });

      await userCartRef.update({
        items: mergedItems,
        updatedAt: new Date().toISOString(),
      });
    }

    // 게스트 장바구니 삭제
    await db.collection("carts").doc(cartId).delete();

    res.json({ok: true, message: "Cart merged successfully"});
  } catch (error) {
    logger.error("Error merging cart:", error);
    res.status(500).json({ok: false, error: "Internal server error"});
  }
});

// ping 함수 (테스트용)
export const ping = onRequest({
  region: "asia-northeast3",
}, (req, res) => {
  logger.info("ping called", {path: req.path, method: req.method});
  res.status(200).send("ok");
});
