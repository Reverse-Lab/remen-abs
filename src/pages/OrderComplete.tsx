import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight,
  Home,
  ShoppingBag,
  User
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderService, Order } from '../services/firebaseService';
import { initializePaymentServices } from '../services/paymentService';

const OrderComplete: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 결제 서비스 초기화
    initializePaymentServices();

    const loadOrder = async () => {
      const orderId = location.state?.orderId;
      
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const orderData = await orderService.getOrder(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [navigate, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">주문 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getEstimatedDelivery = () => {
    const orderDate = order.createdAt.toDate();
    const deliveryDays = order.shipping.method === 'express' ? 2 : 5;
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    return estimatedDate;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '주문 접수';
      case 'payment_pending':
        return '결제 대기';
      case 'payment_completed':
        return '결제 완료';
      case 'processing':
        return '주문 처리 중';
      case 'shipped':
        return '배송 중';
      case 'delivered':
        return '배송 완료';
      default:
        return '주문 접수';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'payment_pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'payment_completed':
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 주문 완료 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h1>
          <p className="text-gray-600">주문해주셔서 감사합니다.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 주문 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 기본 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">주문 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <ShoppingBag size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">주문번호</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{order.orderNumber}</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Clock size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">주문일시</span>
                  </div>
                  <p className="text-sm text-gray-900">{formatDate(order.createdAt.toDate())}</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">주문 상태</span>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">결제 금액</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(order.finalAmount)}원</p>
                </div>
              </div>
            </motion.div>

            {/* 주문 상품 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">주문 상품</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand} {item.model}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}원</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 배송 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <Truck className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">배송 정보</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <User size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">수령인</span>
                  </div>
                  <p className="text-gray-900">{order.shipping.recipient.name}</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Phone size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">연락처</span>
                  </div>
                  <p className="text-gray-900">{order.shipping.recipient.phone}</p>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <MapPin size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">배송지</span>
                  </div>
                  <p className="text-gray-900">
                    [{order.shipping.recipient.address.postalCode}] {order.shipping.recipient.address.address1}
                    {order.shipping.recipient.address.address2 && ` ${order.shipping.recipient.address.address2}`}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">배송 방법</span>
                  </div>
                  <p className="text-gray-900">
                    {order.shipping.method === 'standard' && '일반배송'}
                    {order.shipping.method === 'express' && '빠른배송'}
                    {order.shipping.method === 'pickup' && '픽업'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">예상 배송일</span>
                  </div>
                  <p className="text-gray-900">{formatDate(getEstimatedDelivery())}</p>
                </div>
              </div>

              {order.shipping.memo && (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">배송 메모</span>
                  </div>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{order.shipping.memo}</p>
                </div>
              )}
            </motion.div>

            {/* 결제 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">결제 정보</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="text-gray-900">{formatPrice(order.totalAmount)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배송비</span>
                  <span className="text-gray-900">{order.shippingFee === 0 ? '무료' : `${formatPrice(order.shippingFee)}원`}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">할인</span>
                    <span className="text-green-600">-{formatPrice(order.discountAmount)}원</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">총 결제금액</span>
                    <span className="font-semibold text-gray-900">{formatPrice(order.finalAmount)}원</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">다음 단계</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <CheckCircle size={20} className="text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">주문 접수 완료</p>
                    <p className="text-sm text-blue-700">주문이 성공적으로 접수되었습니다.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Clock size={20} className="text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">결제 처리</p>
                    <p className="text-sm text-gray-700">24시간 내 결제가 완료됩니다.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Truck size={20} className="text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">배송 준비</p>
                    <p className="text-sm text-gray-700">결제 완료 후 배송이 시작됩니다.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Home size={16} className="mr-2" />
                  홈으로 이동
                </button>
                
                <button
                  onClick={() => navigate('/products')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  쇼핑 계속하기
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">주문 확인</h4>
                <p className="text-sm text-yellow-800">
                  주문 확인 이메일이 <strong>{order.customer.email}</strong>로 발송되었습니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete; 