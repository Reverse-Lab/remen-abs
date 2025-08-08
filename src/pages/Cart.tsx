import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  ShoppingCart, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state, removeFromCart, clearCart } = useCart();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveItem = async (id: string) => {
    setIsRemoving(id);
    // 애니메이션을 위한 짧은 지연
    setTimeout(() => {
      removeFromCart(id);
      setIsRemoving(null);
    }, 200);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

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
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.brand} {item.model}
                            </p>
                            <div className="flex items-center mt-2">
                              {item.soldOut ? (
                                <span className="flex items-center text-red-600 text-sm">
                                  <AlertTriangle size={16} className="mr-1" />
                                  판매완료
                                </span>
                              ) : !item.inStock ? (
                                <span className="flex items-center text-red-600 text-sm">
                                  <AlertTriangle size={16} className="mr-1" />
                                  품절
                                </span>
                              ) : (
                                <span className="flex items-center text-green-600 text-sm">
                                  <CheckCircle size={16} className="mr-1" />
                                  재고 있음
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price)}원
                            </p>
                          </div>
                        </div>

                                                 {/* 삭제 버튼 */}
                         <div className="flex items-center justify-end mt-4">
                           <button
                             onClick={() => handleRemoveItem(item.id)}
                             className="text-red-600 hover:text-red-700 transition-colors p-2"
                           >
                             <Trash2 size={20} />
                           </button>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">주문 요약</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>{formatPrice(state.totalPrice)}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>총 결제금액</span>
                    <span>{formatPrice(state.totalPrice)}원</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                주문하기
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/products')}
                  className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                >
                  쇼핑 계속하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 