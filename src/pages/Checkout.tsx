import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Calendar,
  Clock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder, PaymentMethod, ShippingMethod, OrderCustomer, ShippingInfo } from '../contexts/OrderContext';
import { initializePaymentServices, paymentService, getPGProviderForMethod } from '../services/paymentService';
import { orderService, productService } from '../services/firebaseService';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: cartState, clearCart } = useCart();
  const { user } = useAuth();
  const { state: orderState, createOrder, calculateShippingFee, calculateDiscount } = useOrder();
  
  // 폼 상태
  const [customerInfo, setCustomerInfo] = useState<OrderCustomer>({
    name: '',
    email: '',
    phone: '',
    address: {
      postalCode: '',
      address1: '',
      address2: '',
    },
  });

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    method: 'standard',
    recipient: {
      name: '',
      phone: '',
      address: {
        postalCode: '',
        address1: '',
        address2: '',
      },
    },
    memo: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [couponCode, setCouponCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 계산된 값들
  const totalAmount = cartState.totalPrice;
  const shippingFee = calculateShippingFee(shippingInfo.method, totalAmount);
  const discountAmount = calculateDiscount(totalAmount, couponCode);
  const finalAmount = totalAmount + shippingFee - discountAmount;

  // 주문자 정보와 배송지 정보 동일 여부
  const [sameAsCustomer, setSameAsCustomer] = useState(true);

  useEffect(() => {
    if (sameAsCustomer) {
      setShippingInfo(prev => ({
        ...prev,
        recipient: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
        },
      }));
    }
  }, [customerInfo, sameAsCustomer]);

  // 장바구니가 비어있으면 홈으로 리다이렉트
  useEffect(() => {
    if (cartState.items.length === 0) {
      navigate('/cart');
    }
  }, [cartState.items.length, navigate]);

  // 결제 서비스 초기화
  useEffect(() => {
    initializePaymentServices();
  }, []);

  const handleCustomerInfoChange = (field: keyof OrderCustomer, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: keyof OrderCustomer['address'], value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleShippingInfoChange = (field: keyof ShippingInfo['recipient'], value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        [field]: value,
      },
    }));
  };

  const handleShippingAddressChange = (field: keyof ShippingInfo['recipient']['address'], value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        address: {
          ...prev.recipient.address,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    if (!agreedToTerms) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      // 주문 번호 생성 (현재 날짜 + 랜덤 숫자)
      const orderNumber = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      // 주문 아이템 생성
      const orderItems = cartState.items.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        model: item.model,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      }));

      // 주문 데이터 생성
      const orderData = {
        orderNumber,
        status: 'pending' as const,
        totalAmount,
        finalAmount,
        shippingFee,
        discountAmount,
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
                 shipping: {
           method: shippingInfo.method,
           recipient: {
             name: shippingInfo.recipient.name,
             phone: shippingInfo.recipient.phone,
             address: {
               postalCode: shippingInfo.recipient.address.postalCode,
               address1: shippingInfo.recipient.address.address1,
               address2: shippingInfo.recipient.address.address2,
             },
           },
           memo: shippingInfo.memo,
         },
        items: orderItems,
        userId: user.uid,
      };

      // Firebase에 주문 저장
      const orderId = await orderService.addOrder(orderData);

      // PG사 설정
      const pgProvider = getPGProviderForMethod(paymentMethod);
      paymentService.setProvider(pgProvider);

      // 결제 요청
      const paymentRequest = {
        orderId,
        orderNumber,
        amount: finalAmount,
        method: paymentMethod,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: orderItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: 1,
        })),
        successUrl: `${window.location.origin}/order-complete?orderId=${orderId}`,
        failUrl: `${window.location.origin}/checkout?error=payment_failed`,
      };

      const paymentResponse = await paymentService.requestPayment(paymentRequest);

      if (paymentResponse.success) {
        // 결제 성공 시 장바구니 클리어
        clearCart();
        
        // 주문 상태를 결제 완료로 업데이트
        await orderService.updateOrderStatus(orderId, 'payment_completed');
        
        // 주문된 제품들을 판매완료 상태로 변경
        try {
          for (const item of cartState.items) {
            await productService.markProductAsSoldOut(item.id);
            console.log(`Product ${item.id} marked as sold out`);
          }
        } catch (error) {
          console.error('Error marking products as sold out:', error);
          // 제품 상태 변경 실패해도 주문은 완료되도록 함
        }

        // 주문 확인 이메일 발송
        try {
          const orderDoc = await orderService.getOrder(orderId);
          if (orderDoc) {
            const emailSent = await orderService.sendOrderConfirmationEmail(orderDoc);
            if (emailSent) {
              console.log('Order confirmation email sent successfully');
            } else {
              console.warn('Failed to send order confirmation email');
            }
          }
        } catch (error) {
          console.error('Error sending order confirmation email:', error);
          // 이메일 발송 실패해도 주문은 완료되도록 함
        }
        
        // 주문 완료 페이지로 이동
        navigate('/order-complete', { state: { orderId } });
      } else {
        throw new Error(paymentResponse.errorMessage || '결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('주문 처리 중 오류:', error);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  if (cartState.items.length === 0) {
    return null;
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
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">주문/결제</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 주문 정보 입력 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 주문자 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <User className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">주문자 정보</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    우편번호 *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.address.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기본주소 *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.address.address1}
                    onChange={(e) => handleAddressChange('address1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세주소
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address.address2}
                    onChange={(e) => handleAddressChange('address2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* 배송 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <Truck className="text-green-600 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">배송 정보</h2>
              </div>

              {/* 배송 방법 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  배송 방법 *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'standard', label: '일반배송', desc: '3-5일 소요', price: '3,000원' },
                    { value: 'express', label: '빠른배송', desc: '1-2일 소요', price: '5,000원' },
                    { value: 'pickup', label: '픽업', desc: '매장 방문', price: '무료' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                        shippingInfo.method === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.value}
                        checked={shippingInfo.method === method.value}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, method: e.target.value as ShippingMethod }))}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-600">{method.desc}</div>
                        <div className="text-sm text-blue-600 font-medium">{method.price}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 배송지 정보 */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAsCustomer}
                    onChange={(e) => setSameAsCustomer(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">주문자와 동일</span>
                </label>
              </div>

              {!sameAsCustomer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      수령인 *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.recipient.name}
                      onChange={(e) => handleShippingInfoChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.recipient.phone}
                      onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      우편번호 *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.recipient.address.postalCode}
                      onChange={(e) => handleShippingAddressChange('postalCode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      기본주소 *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.recipient.address.address1}
                      onChange={(e) => handleShippingAddressChange('address1', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상세주소
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.recipient.address.address2}
                      onChange={(e) => handleShippingAddressChange('address2', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배송 메모
                </label>
                <textarea
                  value={shippingInfo.memo}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, memo: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="배송 시 요청사항을 입력해주세요."
                />
              </div>
            </motion.div>

            {/* 결제 방법 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <CreditCard className="text-purple-600 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">결제 방법</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'card', label: '신용카드', icon: '💳' },
                  { value: 'bank_transfer', label: '무통장입금', icon: '🏦' },
                  { value: 'kakao_pay', label: '카카오페이', icon: '💛' },
                  { value: 'naver_pay', label: '네이버페이', icon: '💚' },
                  { value: 'toss_pay', label: '토스페이', icon: '💙' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === method.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <span className="font-medium text-gray-900">{method.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* 쿠폰 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">쿠폰/할인</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="쿠폰 코드를 입력하세요"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (couponCode === 'WELCOME10') {
                      alert('10% 할인 쿠폰이 적용되었습니다!');
                    } else if (couponCode) {
                      alert('유효하지 않은 쿠폰입니다.');
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  적용
                </button>
              </div>
              {couponCode === 'WELCOME10' && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  10% 할인 쿠폰이 적용되었습니다.
                </div>
              )}
            </motion.div>

            {/* 이용약관 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 mr-3"
                  required
                />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">이용약관</span> 및 <span className="font-medium">개인정보 처리방침</span>에 동의합니다. *
                </div>
              </div>
            </motion.div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-20"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">주문 요약</h2>

              {/* 상품 목록 */}
              <div className="space-y-3 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.brand} {item.model}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}원
                    </div>
                  </div>
                ))}
              </div>

              {/* 금액 계산 */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>{formatPrice(totalAmount)}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>{shippingFee === 0 ? '무료' : `${formatPrice(shippingFee)}원`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>할인</span>
                    <span>-{formatPrice(discountAmount)}원</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>총 결제금액</span>
                    <span>{formatPrice(finalAmount)}원</span>
                  </div>
                </div>
              </div>

              {/* 결제 버튼 */}
              <button
                type="submit"
                disabled={isProcessing || !agreedToTerms}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                  isProcessing || !agreedToTerms
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? '처리 중...' : `${formatPrice(finalAmount)}원 결제하기`}
              </button>

              {/* 안내사항 */}
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>주문 후 24시간 내 결제 완료</span>
                </div>
                <div className="flex items-center">
                  <Truck size={12} className="mr-1" />
                  <span>배송 시작 시 SMS 발송</span>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 