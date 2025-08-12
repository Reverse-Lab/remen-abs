import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { inquiryService } from '../services/firebaseService';
import SEO from '../components/SEO';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  carBrand: string;
  carModel: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    carBrand: '',
    carModel: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Firebase에 문의 데이터 저장
      await inquiryService.addInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        carBrand: formData.carBrand,
        carModel: formData.carModel,
        message: formData.message
      });

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        carBrand: '',
        carModel: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setError('문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "REMEN_ABS 문의하기",
    "description": "고장 ABS 모듈 수리 문의 및 상담 서비스",
    "mainEntity": {
      "@type": "Organization",
      "name": "REMEN_ABS",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+82-2-1234-5678",
        "contactType": "customer service",
        "availableLanguage": "Korean"
      }
    }
  };

  return (
    <div>
      <SEO
        title="고장 ABS 모듈 수리 문의하기 | REMEN_ABS"
        description="전문 상담원이 최적의 솔루션을 제안해드립니다. 고장 ABS 모듈 수리 문의 및 상담 서비스를 제공합니다."
        keywords="ABS 수리 문의, 고장 ABS 상담, ABS 모듈 수리 문의, 렉서스 ABS 수리 문의, 수입차 ABS 수리 문의"
        canonical="https://www.remen-abs.com/contact"
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
            문의하기
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto break-words"
          >
            전문 상담원이 최적의 솔루션을 제안해드립니다.
          </motion.p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 break-words">
                연락처 정보
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full p-3 mr-4 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 break-words">전화</h3>
                    <p className="text-gray-600 break-words">032-221-9182</p>
                    <p className="text-sm text-gray-500 break-words">평일 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full p-3 mr-4 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 break-words">이메일</h3>
                    <a 
                      href="mailto:info@remen-abs.com?subject=REMEN_ABS 문의&body=안녕하세요,%0D%0A%0D%0AREMEN_ABS에 대한 문의사항이 있습니다.%0D%0A%0D%0A문의 내용:%0D%0A%0D%0A%0D%0A감사합니다."
                      className="text-gray-600 break-words hover:text-green-600 transition-colors cursor-pointer"
                      title="info@remen-abs.com로 메일 보내기"
                    >
                      info@remen-abs.com
                    </a>
                    <p className="text-sm text-gray-500 break-words">24시간 접수 가능</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-600 text-white rounded-full p-3 mr-4 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 break-words">주소</h3>
                    <p className="text-gray-600 break-words">
                      인천광역시 남동구<br />
                      청능대로340번길 24, 2층<br />
                      (고잔동)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full p-3 mr-4 flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 break-words">영업시간</h3>
                    <p className="text-gray-600 break-words">
                      평일: 09:00 - 18:00<br />
                      토요일: 09:00 - 13:00<br />
                      일요일: 휴무
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-blue-900 break-words">
                  빠른 상담 안내
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="mr-2 text-green-500 flex-shrink-0" />
                    <span className="break-words">차량 정보를 미리 준비해 주세요</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="mr-2 text-green-500 flex-shrink-0" />
                    <span className="break-words">연락 가능한 시간을 알려주세요</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="mr-2 text-green-500 flex-shrink-0" />
                    <span className="break-words">긴급한 경우 전화 문의를 권장합니다</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    문의가 접수되었습니다!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    빠른 시일 내에 연락드리겠습니다.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    추가 문의하기
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    문의 양식
                  </h2>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이름 *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이메일 *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        연락처 *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          차량 브랜드
                        </label>
                        <select
                          name="carBrand"
                          value={formData.carBrand}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">선택해주세요</option>
                          <option value="렉서스">렉서스</option>
                          <option value="벤츠">벤츠</option>
                          <option value="BMW">BMW</option>
                          <option value="아우디">아우디</option>
                          <option value="기타">기타</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          차량 모델
                        </label>
                        <input
                          type="text"
                          name="carModel"
                          value={formData.carModel}
                          onChange={handleInputChange}
                          placeholder="예: ES350, IS250"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        문의 내용 *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="구체적인 문의 내용을 작성해 주세요..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          전송 중...
                        </>
                      ) : (
                        <>
                          <Send size={20} className="mr-2" />
                          문의하기
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-xl text-gray-600">
              고객님들이 자주 묻는 질문들을 모았습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Q. 재제조 ABS 모듈의 품질은 어떤가요?
              </h3>
              <p className="text-gray-600">
                엄격한 검사 과정을 통과한 제품만 출고되며, 
                1년 보증을 제공합니다. 신품과 동일한 성능을 보장합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Q. 배송은 얼마나 걸리나요?
              </h3>
              <p className="text-gray-600">
                주문 후 1-2일 내 배송됩니다. 
                긴급한 경우 당일 배송도 가능합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Q. 어떤 차량을 지원하나요?
              </h3>
              <p className="text-gray-600">
                주로 렉서스 등 수입차를 전문으로 취급하며, 
                기타 브랜드도 문의해 주시면 확인해드립니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Q. 설치 서비스도 제공하나요?
              </h3>
              <p className="text-gray-600">
                제품 구매 시 설치 서비스를 함께 제공할 수 있습니다. 
                자세한 내용은 문의해 주세요.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 