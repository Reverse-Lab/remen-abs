import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Award, Users, ArrowRight, CheckCircle, Wrench, Truck, Package } from 'lucide-react';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "REMEN_ABS",
    "description": "고장 ABS 모듈 재생/수리 전문업체",
    "url": "https://www.remen-abs.com",
    "logo": "https://www.remen-abs.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-2-1234-5678",
      "contactType": "customer service"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR"
    },
    "sameAs": [
      "https://www.remen-abs.com"
    ]
  };

  return (
    <div className="w-full">
      <SEO
        title="고장 ABS 수리/재생 전문업체 | REMEN_ABS"
        description="고장 ABS 모듈 수리/재생 전문업체. 렉서스, 벤츠, BMW 등 수입차 고장 ABS 수리, 고장 ABS 재생, 고장 ABS 교체 서비스. 1년 보증, 무료 진단."
        keywords="고장 ABS, 고장 ABS 수리, 고장 ABS 재생, 고장 ABS 교체, ABS 고장, ABS 수리, ABS 재생, ABS 교체, 렉서스 ABS 수리, 벤츠 ABS 수리, BMW ABS 수리, 수입차 ABS 수리, 브레이크 시스템 수리, 자동차 부품 수리, ABS 모듈, 재생 ABS, 재제조 ABS, 고장 ABS 모듈, ABS 고장 진단, ABS 고장 수리, 고장 ABS 모듈 수리, 고장 ABS 모듈 교체"
        canonical="https://www.remen-abs.com/"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 break-words">
                최고 품질의<br />
                <span className="text-yellow-300">고장 ABS 모듈 수리</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 break-words">
                동진테크의 고장 ABS 모듈 재제조/수리로 안전하고 경제적인 주행을 경험하세요.
                렉서스 등 수입차 전문 고장 ABS 수리 서비스를 제공합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                  to="/products"
                  className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center break-words"
                >
                  제품 보기
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/repair-service"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center break-words"
                >
                  수리 서비스
                  <Wrench size={20} className="ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors text-center break-words"
                >
                  문의하기
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center w-full"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold mb-2 break-words">전문 재제조</h3>
                <p className="text-blue-100 break-words">자체 세척 및 검사 설비</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
              왜 REMEN_ABS 고장 ABS 수리를 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto break-words">
              전문적인 고장 ABS 재제조/수리 기술과 엄격한 품질 관리를 통해 최고의 고장 ABS 모듈을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center w-full"
            >
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 break-words">품질 보장</h3>
              <p className="text-gray-600 break-words">엄격한 검사 과정을 통과한 제품만 출고</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center w-full"
            >
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 break-words">빠른 배송</h3>
              <p className="text-gray-600 break-words">주문 후 1-2일 내 배송</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center w-full"
            >
              <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 break-words">전문 기술</h3>
              <p className="text-gray-600 break-words">20년 이상의 재제조 전문 기술</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center w-full"
            >
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 break-words">고객 만족</h3>
              <p className="text-gray-600 break-words">98% 고객 만족도 달성</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 break-words">
                동진테크의<br />
                <span className="text-blue-600">고장 ABS 재제조/수리 기술</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 break-words">
                동진테크는 자동차 고장 ABS 모듈 재제조/수리 전문업체로, 
                최신 설비와 전문 기술을 바탕으로 고품질 고장 ABS 재제조 제품을 제공합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  <span className="break-words">자체 세척 설비로 완벽한 청정도 확보</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  <span className="break-words">전문 검사 설비로 품질 보장</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  <span className="break-words">렉서스 등 수입차 고장 ABS 전문 서비스</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  <span className="break-words">통신판매업 허가 완료</span>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors break-words"
              >
                더 알아보기
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-100 rounded-2xl p-8 w-full"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🏭</div>
                <h3 className="text-2xl font-bold mb-4 break-words">전문 고장 ABS 재제조/수리 시설</h3>
                <p className="text-gray-600 break-words">
                  최신 설비와 전문 기술로 고품질 고장 ABS 모듈을 재제조/수리합니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Repair Service Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
              고장 ABS 모듈 수리 서비스
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto break-words">
              고장 ABS 모듈 회수부터 수리 완료 후 발송까지 원스톱 서비스로 안전하고 경제적인 고장 ABS 수리를 경험하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center w-full"
            >
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 break-words">고장 ABS 모듈 회수</h3>
              <p className="text-gray-600 mb-4 break-words">
                전국 무료 택배 회수 서비스로 고객의 고장 ABS 모듈을 안전하게 회수합니다.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="break-words">• 안전한 포장 제공</p>
                <p className="break-words">• 회수 상태 실시간 추적</p>
                <p className="break-words">• 회수 완료 알림 서비스</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center w-full"
            >
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Wrench size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 break-words">고장 ABS 전문 수리</h3>
              <p className="text-gray-600 mb-4 break-words">
                전문 기술자의 정밀한 진단과 고장 ABS 수리로 완벽한 품질을 보장합니다.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• 전문 진단 장비 사용</p>
                <p>• 상세한 문제점 분석</p>
                <p>• 1년 보증 제공</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center w-full"
            >
              <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 break-words">고장 ABS 안전 발송</h3>
              <p className="text-gray-600 mb-4 break-words">
                수리 완료된 고장 ABS 모듈을 안전하게 포장하여 발송합니다.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• 안전한 포장 발송</p>
                <p>• 배송 추적 서비스</p>
                <p>• 설치 가이드 제공</p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/repair-service"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              수리 서비스 신청하기
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SEO 최적화 섹션 */}
      <section className="py-20 bg-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고장 ABS 모듈 전문 서비스
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              고장 ABS 수리, 고장 ABS 재제조, 고장 ABS 교체 등 모든 고장 ABS 관련 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-4">고장 ABS 수리</h3>
              <p className="text-gray-600 mb-4">
                전문 기술로 고장 ABS 모듈을 정밀하게 수리하여 원래 성능을 복원합니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• 고장 ABS 진단</li>
                <li>• 고장 ABS 부품 교체</li>
                <li>• 고장 ABS 성능 테스트</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-4">고장 ABS 재제조</h3>
              <p className="text-gray-600 mb-4">
                고장 ABS 모듈을 완전히 재제조하여 새 제품과 동일한 품질을 제공합니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• 고장 ABS 완전 분해</li>
                <li>• 고장 ABS 부품 세척</li>
                <li>• 고장 ABS 재조립</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold mb-4">고장 ABS 교체</h3>
              <p className="text-gray-600 mb-4">
                고장 ABS 모듈 교체 서비스로 안전하고 경제적인 솔루션을 제공합니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• 고장 ABS 호환성 확인</li>
                <li>• 고장 ABS 설치 가이드</li>
                <li>• 고장 ABS 보증 제공</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 고장 ABS 증상 안내 섹션 */}
      <section className="py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고장 ABS 증상과 해결방법
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              고장 ABS 모듈의 주요 증상과 전문적인 해결방법을 안내해드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">고장 ABS 주요 증상</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>
                  <span>ABS 경고등이 계속 켜져 있음</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>
                  <span>브레이크 페달이 단단하거나 반응이 느림</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>
                  <span>급제동 시 ABS가 작동하지 않음</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>
                  <span>브레이크 잠김 현상 발생</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⚠️</span>
                  <span>브레이크 성능 저하</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">고장 ABS 해결방법</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>고장 ABS 모듈 전문 진단</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>고장 ABS 부품 교체</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>고장 ABS 모듈 재제조</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>고장 ABS 성능 테스트</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>고장 ABS 설치 및 보증</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            고장 ABS 수리 전문가와 상담하세요
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            고장 ABS 재제조, 고장 ABS 수리, 고장 ABS 교체 등 모든 고장 ABS 관련 서비스를 전문 상담원이 안내해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link
              to="/contact"
              className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-center"
            >
              고장 ABS 무료 상담 신청
            </Link>
            <a
                              href="tel:032-221-9182"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors text-center"
            >
                              032-221-9182
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 