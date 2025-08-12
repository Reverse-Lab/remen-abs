import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, Wrench, FileText, CreditCard, Package, Phone, 
  Clock, CheckSquare, DollarSign, UserCheck, AlertCircle,
  Car, Calendar, MapPin, MessageSquare, Upload, CheckCircle
} from 'lucide-react';
import SEO from '../components/SEO';

interface RepairRequest {
  customerName: string;
  phone: string;
  email: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  absModel: string;
  problemDescription: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
  images: File[];
}

const RepairService: React.FC = () => {
  const navigate = useNavigate();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "ABS 모듈 수리 서비스",
    "description": "전문적인 ABS 모듈 수리 서비스",
    "provider": {
      "@type": "Organization",
      "name": "REMEN_ABS"
    },
    "serviceType": "자동차 부품 수리",
    "areaServed": "대한민국"
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [repairRequest, setRepairRequest] = useState<RepairRequest>({
    customerName: '',
    phone: '',
    email: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    absModel: '',
    problemDescription: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: '',
    images: []
  });

  const steps = [
    { id: 1, title: '고객 정보', icon: <UserCheck /> },
    { id: 2, title: '차량 정보', icon: <Car /> },
    { id: 3, title: '문제점 설명', icon: <AlertCircle /> },
    { id: 4, title: '회수 정보', icon: <Truck /> },
    { id: 5, title: '확인 및 제출', icon: <CheckCircle /> }
  ];

  const carBrands = ['렉서스', '벤츠', 'BMW', '아우디', '폭스바겐', '볼보', '기타'];
  const timeSlots = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

  const handleInputChange = (field: keyof RepairRequest, value: string | File[]) => {
    setRepairRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setRepairRequest(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setRepairRequest(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // 여기에 실제 제출 로직을 구현
      console.log('수리 서비스 신청:', repairRequest);
      
      // 성공 메시지 표시 후 홈페이지로 이동
      alert('수리 서비스 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      navigate('/');
    } catch (error) {
      console.error('제출 오류:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">고객 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={repairRequest.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="고객님의 이름을 입력해주세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  value={repairRequest.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={repairRequest.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">차량 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차량 브랜드 *
                </label>
                <select
                  value={repairRequest.carBrand}
                  onChange={(e) => handleInputChange('carBrand', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">브랜드를 선택해주세요</option>
                  {carBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차량 모델 *
                </label>
                <input
                  type="text"
                  value={repairRequest.carModel}
                  onChange={(e) => handleInputChange('carModel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: ES300h, S-Class, 5시리즈"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연식 *
                </label>
                <input
                  type="text"
                  value={repairRequest.carYear}
                  onChange={(e) => handleInputChange('carYear', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 2018, 2020"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ABS 모듈 모델
                </label>
                <input
                  type="text"
                  value={repairRequest.absModel}
                  onChange={(e) => handleInputChange('absModel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABS 모듈 모델명 (선택사항)"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">문제점 설명</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                문제점 상세 설명 *
              </label>
              <textarea
                value={repairRequest.problemDescription}
                onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABS 경고등이 켜져있나요? 브레이크 페달이 단단한가요? 어떤 증상이 나타나는지 자세히 설명해주세요."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                증상 사진 업로드
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    사진 선택하기
                  </span>
                  <span className="text-gray-500"> 또는 드래그 앤 드롭</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  최대 5장까지 업로드 가능합니다
                </p>
              </div>
              
              {repairRequest.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {repairRequest.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`증상 사진 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">회수 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회수 주소 *
                </label>
                <input
                  type="text"
                  value={repairRequest.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="상세한 주소를 입력해주세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  희망 회수 날짜 *
                </label>
                <input
                  type="date"
                  value={repairRequest.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  희망 회수 시간 *
                </label>
                <select
                  value={repairRequest.preferredTime}
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">시간을 선택해주세요</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가 요청사항
                </label>
                <textarea
                  value={repairRequest.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="추가로 요청하시는 사항이 있으시면 입력해주세요."
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">신청 정보 확인</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">고객 정보</h4>
                  <p className="text-gray-600">이름: {repairRequest.customerName}</p>
                  <p className="text-gray-600">연락처: {repairRequest.phone}</p>
                  {repairRequest.email && <p className="text-gray-600">이메일: {repairRequest.email}</p>}
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">차량 정보</h4>
                  <p className="text-gray-600">브랜드: {repairRequest.carBrand}</p>
                  <p className="text-gray-600">모델: {repairRequest.carModel}</p>
                  <p className="text-gray-600">연식: {repairRequest.carYear}</p>
                  {repairRequest.absModel && <p className="text-gray-600">ABS 모델: {repairRequest.absModel}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">문제점 설명</h4>
                <p className="text-gray-600">{repairRequest.problemDescription}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">회수 정보</h4>
                <p className="text-gray-600">주소: {repairRequest.address}</p>
                <p className="text-gray-600">희망 날짜: {repairRequest.preferredDate}</p>
                <p className="text-gray-600">희망 시간: {repairRequest.preferredTime}</p>
                {repairRequest.additionalNotes && (
                  <p className="text-gray-600">추가 요청사항: {repairRequest.additionalNotes}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">수리 프로세스 안내</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>1. 고장품 회수 (1-2일)</p>
                <p>2. 문제점 점검 (1일)</p>
                <p>3. 수리비 산정 (즉시)</p>
                <p>4. 고객 견적확인 (1일)</p>
                <p>5. 수리진행 (3-5일)</p>
                <p>6. 수리시 결제 (즉시)</p>
                <p>7. 발송 (1-2일)</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="고장 ABS 모듈 수리 서비스 신청 | REMEN_ABS"
        description="고장 ABS 모듈 회수부터 수리 완료까지 원스톱 서비스로 안전하고 경제적인 고장 ABS 수리를 경험하세요."
        keywords="ABS 모듈 수리 신청, 고장 ABS 수리, ABS 수리 서비스, 렉서스 ABS 수리, 수입차 ABS 수리"
        canonical="https://www.remen-abs.com/repair-service"
        structuredData={structuredData}
      />
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6 break-words"
          >
            고장 ABS 모듈 수리 서비스 신청
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 break-words"
          >
            고장 ABS 모듈 회수부터 수리 완료까지 원스톱 서비스로 안전하고 경제적인 고장 ABS 수리를 경험하세요.
          </motion.p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8 relative gap-4 sm:gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center" style={{ minHeight: '80px' }}>
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-xs sm:text-sm font-medium text-center break-words ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                이전
              </button>
              
              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  수리 서비스 신청
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">문의사항이 있으신가요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">전화 문의</h3>
                                <p className="text-gray-600">032-221-9182</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">카카오톡</h3>
              <p className="text-gray-600">@remen_abs</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">운영시간</h3>
              <p className="text-gray-600">평일 09:00-18:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RepairService; 