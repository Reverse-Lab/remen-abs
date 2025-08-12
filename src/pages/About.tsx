import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Factory, Users, Award, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const About: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "동진테크",
    "description": "자동차 ABS 모듈 재제조 전문업체",
    "url": "https://www.remen-abs.com",
    "logo": "https://www.remen-abs.com/logo.png",
    "foundingDate": "2004",
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
    <div>
      <SEO
        title="동진테크 소개 - 자동차 ABS 모듈 재제조 전문업체 | REMEN_ABS"
        description="20년 이상의 자동차 부품 재제조 경험을 바탕으로, 최신 기술과 엄격한 품질 관리를 통해 고품질 ABS 모듈을 제공합니다."
        keywords="동진테크, ABS 모듈 재제조, 자동차 부품 재제조, 렉서스 ABS 수리, 수입차 ABS 수리, 전문 재제조 기술"
        canonical="https://www.remen-abs.com/about"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 break-words"
          >
            동진테크 소개
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto break-words"
          >
            자동차 ABS 모듈 재제조 전문업체로서 최고 품질의 제품과 서비스를 제공합니다.
          </motion.p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 break-words">
                전문 재제조 기술의<br />
                <span className="text-blue-600">선두주자</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 break-words">
                동진테크는 20년 이상의 자동차 부품 재제조 경험을 바탕으로, 
                최신 기술과 엄격한 품질 관리를 통해 고품질 ABS 모듈을 제공합니다.
              </p>
              <p className="text-lg text-gray-600 mb-8 break-words">
                특히 렉서스 등 수입차 ABS 모듈 재제조에 특화되어 있으며, 
                자체 세척 설비와 전문 검사 설비를 통해 완벽한 품질을 보장합니다.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
                  <div className="text-gray-600 break-words">년 경험</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-gray-600 break-words">재제조 제품</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-gray-600 break-words">고객 만족도</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
                  <div className="text-gray-600 break-words">배송 보장</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-100 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🏭</div>
                <h3 className="text-2xl font-bold mb-4">전문 재제조 시설</h3>
                <p className="text-gray-600 mb-6">
                  최신 설비와 전문 기술로 고품질 ABS 모듈을 재제조합니다.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    <span>자체 세척 설비</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    <span>전문 검사 설비</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    <span>품질 보장 시스템</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    <span>ISO 인증</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              우리의 핵심 가치
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              동진테크가 추구하는 가치와 미션을 소개합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">품질 우선</h3>
              <p className="text-gray-600 text-center">
                엄격한 품질 관리를 통해 최고의 제품을 제공합니다. 
                모든 제품은 철저한 검사를 거쳐 출고됩니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Factory size={32} />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">기술 혁신</h3>
              <p className="text-gray-600 text-center">
                최신 기술과 설비를 도입하여 지속적으로 품질을 향상시키고 
                효율성을 높입니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">고객 중심</h3>
              <p className="text-gray-600 text-center">
                고객의 만족을 최우선으로 생각하며, 
                신속하고 정확한 서비스를 제공합니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              인증 및 허가
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              동진테크는 다양한 인증과 허가를 보유하고 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award size={40} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">통신판매업 신고</h3>
              <p className="text-gray-600">2025-인천남동구-1484</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield size={40} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ISO 9001</h3>
              <p className="text-gray-600">품질 관리 시스템</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Factory size={40} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">재제조업 등록</h3>
              <p className="text-gray-600">자동차 부품 전문</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">고객 만족도</h3>
              <p className="text-gray-600">98% 달성</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              연락처 정보
            </h2>
            <p className="text-xl text-gray-600">
              언제든지 문의해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <MapPin size={48} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">주소</h3>
              <p className="text-gray-600">
                인천광역시 남동구<br />
                청능대로340번길 24, 2층<br />
                (고잔동)
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <Phone size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">전화</h3>
              <p className="text-gray-600">
                032-221-9182<br />
                평일 09:00 - 18:00
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <Mail size={48} className="text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">이메일</h3>
              <div className="text-gray-600">
                <a 
                  href="mailto:info@remen-abs.com?subject=REMEN_ABS 문의&body=안녕하세요,%0D%0A%0D%0AREMEN_ABS에 대한 문의사항이 있습니다.%0D%0A%0D%0A문의 내용:%0D%0A%0D%0A%0D%0A감사합니다."
                  className="block hover:text-purple-600 transition-colors cursor-pointer"
                  title="info@remen-abs.com로 메일 보내기"
                >
                  info@remen-abs.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 