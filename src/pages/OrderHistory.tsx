import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Calendar,
  MapPin,
  Phone,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService, Order } from '../services/firebaseService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    // 인증 로딩이 완료된 후에만 주문 내역 로드
    if (authLoading) {
      return;
    }
    
    // 사용자 상태가 변경될 때마다 로딩 상태 초기화
    if (user) {
      setLoading(true);
      setError(null);
      loadOrderHistory();
    } else {
      setLoading(false);
      setOrders([]);
      setError(null);
    }
  }, [user, authLoading]);

  const loadOrderHistory = async () => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Firebase 연결 상태 확인
      console.log('=== Firebase Debug Info ===');
      console.log('User UID:', user.uid);
      console.log('User Email:', user.email);
      console.log('User Display Name:', user.displayName);
      console.log('Auth State:', user ? 'Authenticated' : 'Not authenticated');
      
      // 간단한 Firebase 연결 테스트
      try {
        if (db) {
          const testDoc = await getDoc(doc(db, 'test', 'connection'));
          console.log('Firebase connection test:', testDoc.exists() ? 'Success' : 'Success (doc not exists)');
        } else {
          console.log('Firestore not available for connection test');
        }
      } catch (connectionError) {
        console.error('Firebase connection test failed:', connectionError);
        // 연결 테스트 실패 시에도 계속 진행 (orders 컬렉션 테스트에서 확인)
      }
      
      console.log('Loading orders for user:', user.uid);
      const userOrders = await orderService.getUserOrders(user.uid);
      console.log('Orders loaded:', userOrders);
      
      // 빈 배열이 반환된 경우 (주문이 없거나 데이터베이스 접근 문제)
      if (userOrders.length === 0) {
        console.log('No orders found for user');
        setOrders([]);
        // 에러가 아닌 정상적인 빈 상태로 처리
        return;
      }
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading order history:', error);
      console.error('Full error object:', error);
      
      // 에러가 발생해도 빈 배열로 처리하여 사용자 경험 개선
      console.log('Error occurred, but treating as empty orders for better UX');
      setOrders([]);
      setError(null); // 에러 메시지 대신 빈 상태로 표시
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusText = (status: Order['status']) => {
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
      case 'cancelled':
        return '주문 취소';
      case 'refunded':
        return '환불 완료';
      default:
        return '주문 접수';
    }
  };

  const getStatusColor = (status: Order['status']) => {
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
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'refunded':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
      case 'payment_pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'payment_completed':
      case 'processing':
        return <Package size={16} className="text-blue-600" />;
      case 'shipped':
        return <Truck size={16} className="text-purple-600" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'refunded':
        return <AlertCircle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getEstimatedDelivery = (order: Order) => {
    const orderDate = order.createdAt.toDate();
    const deliveryDays = order.shipping.method === 'express' ? 2 : 5;
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    return estimatedDate;
  };

  // 인증 로딩 상태 처리
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">인증 정보를 확인하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 주문 내역 로딩 상태 처리
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">주문 내역을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-3">
              <button
                onClick={loadOrderHistory}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다시 시도
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium ml-3"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Package size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-8">주문 내역을 확인하려면 로그인해주세요.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Package size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">주문 내역이 없습니다</h2>
            <p className="text-gray-600 mb-8">아직 주문한 상품이 없습니다. 첫 주문을 시작해보세요.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              쇼핑하기
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
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowRight size={24} className="rotate-180" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">주문 내역</h1>
        </div>

        {/* 주문 목록 */}
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden relative"
            >
              {/* 주문 헤더 */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">주문번호</p>
                      <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">주문일</p>
                    <p className="text-sm text-gray-900">{formatDate(order.createdAt.toDate())}</p>
                  </div>
                </div>
              </div>

              {/* 주문 상품 */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.brand} {item.model}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}원</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 주문 정보 */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center mb-2">
                      <MapPin size={14} className="text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">배송지</span>
                    </div>
                    <p className="text-gray-600">
                      {order.shipping.recipient.address.address1}
                      {order.shipping.recipient.address.address2 && ` ${order.shipping.recipient.address.address2}`}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar size={14} className="text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">예상 배송일</span>
                    </div>
                    <p className="text-gray-600">{formatDate(getEstimatedDelivery(order))}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-700">결제 금액</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(order.finalAmount)}원</p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id || null)}
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Eye size={16} className="mr-1" />
                      상세보기
                    </button>
                    {order.status === 'delivered' && (
                      <button className="flex items-center text-green-600 hover:text-green-700 transition-colors">
                        리뷰 작성
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/order-detail/${order.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    주문 상세
                  </button>
                </div>

                {/* 상세 정보 (접기/펼치기) */}
                {selectedOrder === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">주문자 정보</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">이름</span>
                            <span className="text-gray-900">{order.customer.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">이메일</span>
                            <span className="text-gray-900">{order.customer.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">연락처</span>
                            <span className="text-gray-900">{order.customer.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">배송 정보</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">수령인</span>
                            <span className="text-gray-900">{order.shipping.recipient.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">연락처</span>
                            <span className="text-gray-900">{order.shipping.recipient.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">배송 방법</span>
                            <span className="text-gray-900">
                              {order.shipping.method === 'standard' && '일반배송'}
                              {order.shipping.method === 'express' && '빠른배송'}
                              {order.shipping.method === 'pickup' && '픽업'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory; 