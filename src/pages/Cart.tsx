import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  ShoppingCart, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    state, 
    removeFromCart, 
    clearCart, 
    updateQuantity, 
    updateChecked 
  } = useCart();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  const handleRemoveItem = async (id: string) => {
    setIsRemoving(id);
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    setUpdatingItem(id);
    try {
      await updateQuantity(id, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleCheckedChange = async (id: string, checked: boolean) => {
    try {
      await updateChecked(id, checked);
    } catch (error) {
      console.error('Failed to update checked status:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 로딩 상태
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Loader2 size={64} className="text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">장바구니를 불러오는 중...</h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertTriangle size={64} className="text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">장바구니 로드 실패</h2>
            <p className="text-gray-600 mb-4">{state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingCart size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">장바구니가 비어있습니다</h2>
            <p className="text-gray-600 mb-8">원하는 상품을 장바구니에 추가해보세요.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              쇼핑 계속하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">장바구니</h1>
            <span className="ml-4 text-gray-500">({state.totalItems}개 상품)</span>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
          >
            전체 삭제
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 상품 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">상품 목록</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    animate={isRemoving === item.id ? { opacity: 0, x: -100 } : {}}
                    className="p-6"
                  >
                    <div className="flex items-center space-x-4">
                      {/* 체크박스 */}
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => handleCheckedChange(item.id, e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      
                      {/* 상품 이미지 */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* 상품 정보 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.brand} - {item.model}
                        </p>
                        <p className="text-lg font-bold text-blue-600 mt-2">
                          {formatPrice(item.price)}원
                        </p>
                      </div>
                      
                      {/* 수량 조절 */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItem === item.id}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">
                          {updatingItem === item.id ? (
                            <Loader2 size={16} className="animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingItem === item.id}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemoving === item.id}
                        className="text-red-600 hover:text-red-700 transition-colors p-2 disabled:opacity-50"
                      >
                        {isRemoving === item.id ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">주문 요약</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 수량</span>
                  <span className="font-medium">{state.totalItems}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">{formatPrice(state.totalPrice)}원</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">총 결제금액</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(state.totalPrice)}원
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={state.items.filter(item => item.checked).length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {state.items.filter(item => item.checked).length === 0 
                  ? '선택된 상품이 없습니다' 
                  : '주문하기'
                }
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                선택된 상품만 주문됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 