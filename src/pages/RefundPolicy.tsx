import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { RefreshCw, Package, Truck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "환불 정책",
    "description": "동진테크의 환불 정책입니다.",
    "url": "https://www.remen-abs.com/refund-policy"
  };

  return (
    <div>
      <SEO
        title="환불 정책 | REMEN_ABS"
        description="동진테크의 환불 정책입니다. 환불 조건과 절차에 관한 상세한 내용을 확인하세요."
        keywords="환불 정책, 환불 조건, 동진테크 환불, ABS 수리 환불"
        canonical="https://www.remen-abs.com/refund-policy"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            반품/환불/교환 정책
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-orange-100 max-w-3xl mx-auto"
          >
            고객 만족을 위한 명확한 반품/환불/교환 정책을 안내드립니다.
          </motion.p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* 청약철회 및 환불 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <RefreshCw className="mr-3 text-orange-600" size={32} />
                청약철회 및 환불
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">청약철회 기간</h3>
                <p className="text-gray-600 mb-6">
                  상품을 받으신 날로부터 <strong className="text-orange-600">7일 이내</strong>에 청약철회를 요청하실 수 있습니다.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">청약철회 가능한 경우</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="text-green-600 mr-2" size={20} />
                      <span className="font-semibold text-green-800">청약철회 가능</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 상품을 받은 날로부터 7일 이내</li>
                      <li>• 상품이 표시·광고 내용과 다르거나 계약내용과 다르게 이행된 경우</li>
                      <li>• 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우</li>
                      <li>• 배송 중 상품이 파손된 경우</li>
                      <li>• 상품의 하자가 있는 경우</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <XCircle className="text-red-600 mr-2" size={20} />
                      <span className="font-semibold text-red-800">청약철회 제한</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• 이용자의 책임으로 상품이 멸실 또는 훼손된 경우</li>
                      <li>• 이용자의 사용 또는 일부 소비로 상품의 가치가 현저히 감소한 경우</li>
                      <li>• 시간의 경과로 재판매가 곤란할 정도로 상품의 가치가 현저히 감소한 경우</li>
                      <li>• 복제가 가능한 상품의 포장을 훼손한 경우</li>
                      <li>• 개봉 후 사용한 상품</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 반품/교환 절차 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="mr-3 text-orange-600" size={32} />
                반품/교환 절차
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold text-xl">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">반품 신청</h3>
                    <p className="text-sm text-gray-600">
                      고객센터(010-9027-9182) 또는 이메일(info@remen-abs.com)로 반품 신청
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold text-xl">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">상품 발송</h3>
                    <p className="text-sm text-gray-600">
                      상품을 원래 포장 상태로 안전하게 포장하여 발송
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold text-xl">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">환불 처리</h3>
                    <p className="text-sm text-gray-600">
                      상품 확인 후 3영업일 이내에 환불 처리
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 배송비 및 환불 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Truck className="mr-3 text-orange-600" size={32} />
                배송비 및 환불
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">환불 시 배송비</h3>
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">회사 부담</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 상품의 하자로 인한 반품</li>
                          <li>• 배송 중 상품 파손</li>
                          <li>• 상품이 표시·광고와 다른 경우</li>
                          <li>• 계약내용과 다르게 이행된 경우</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">고객 부담</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• 단순 변심으로 인한 반품</li>
                          <li>• 고객의 책임으로 상품 훼손</li>
                          <li>• 사용으로 인한 가치 감소</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">환불 처리</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">환불 방법</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 신용카드 결제: 카드사 승인 취소</li>
                          <li>• 계좌이체: 원래 계좌로 환불</li>
                          <li>• 무통장입금: 고객 계좌로 환불</li>
                          <li>• 포인트 결제: 포인트 환불</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">환불 기간</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• 상품 반환 후 3영업일 이내</li>
                          <li>• 신용카드: 3~5영업일</li>
                          <li>• 계좌이체: 1~2영업일</li>
                          <li>• 무통장입금: 1~2영업일</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 교환 정책 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <RefreshCw className="mr-3 text-orange-600" size={32} />
                교환 정책
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">교환 가능한 경우</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">교환 가능</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 상품의 하자가 있는 경우</li>
                      <li>• 배송 중 상품이 파손된 경우</li>
                      <li>• 상품이 표시·광고와 다른 경우</li>
                      <li>• 동일 상품으로의 교환</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">교환 불가</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• 사용으로 인한 상품 훼손</li>
                      <li>• 고객의 책임으로 상품 훼손</li>
                      <li>• 개봉 후 사용한 상품</li>
                      <li>• 재고 부족으로 인한 교환 불가</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">교환 절차</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold">1</span>
                    </div>
                    <p className="text-sm text-gray-600">교환 신청</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold">2</span>
                    </div>
                    <p className="text-sm text-gray-600">상품 반송</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold">3</span>
                    </div>
                    <p className="text-sm text-gray-600">상품 확인</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold">4</span>
                    </div>
                    <p className="text-sm text-gray-600">새 상품 발송</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 주의사항 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="mr-3 text-orange-600" size={32} />
                주의사항
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">반품 시 주의사항</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 상품을 원래 포장 상태로 안전하게 포장해 주세요.</li>
                      <li>• 상품에 부착된 모든 라벨과 태그를 제거하지 마세요.</li>
                      <li>• 상품의 모든 구성품을 포함하여 반송해 주세요.</li>
                      <li>• 반품 신청 후 7일 이내에 상품을 발송해 주세요.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">환불 관련 안내</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 환불은 결제 수단에 따라 처리 기간이 다를 수 있습니다.</li>
                      <li>• 신용카드 환불은 카드사 정책에 따라 처리됩니다.</li>
                      <li>• 무통장입금 환불 시 계좌번호를 정확히 확인해 주세요.</li>
                      <li>• 환불 관련 문의는 고객센터로 연락해 주세요.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">교환 관련 안내</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 교환은 동일 상품으로만 가능합니다.</li>
                      <li>• 교환 상품의 재고 상황에 따라 처리가 지연될 수 있습니다.</li>
                      <li>• 교환 상품이 품절인 경우 환불로 처리됩니다.</li>
                      <li>• 교환 시 배송비는 상품 하자 시에만 회사가 부담합니다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 문의처 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">문의처</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">고객센터</h3>
                    <div className="space-y-2 text-gray-600">
                                              <p><strong>전화:</strong> 010-9027-9182</p>
                        <p><strong>이메일:</strong> info@remen-abs.com</p>
                      <p><strong>운영시간:</strong> 평일 09:00-18:00</p>
                      <p><strong>점심시간:</strong> 12:00-13:00</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">반품/교환 주소</h3>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>주소:</strong> 인천광역시 남동구 청능대로340번길 24, 2층</p>
                      <p><strong>수령인:</strong> 동진테크 반품담당자</p>
                                              <p><strong>연락처:</strong> 010-9027-9182</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 시행일자 */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="text-orange-800 text-center">
                <strong>시행일자:</strong> 2024년 1월 1일<br/>
                <strong>최종 수정일:</strong> 2024년 12월 1일
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy; 