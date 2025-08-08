import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Building, MapPin, Phone, Calendar, ExternalLink, AlertTriangle, Shield } from 'lucide-react';

interface BusinessRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessRegistrationModal: React.FC<BusinessRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [showVerificationResult, setShowVerificationResult] = useState(false);

  const businessInfo = {
    companyName: '동진테크',
    registrationNumber: '2025-인천남동구-1484',
    businessName: 'REMEN_ABS',
    representative: '오미숙',
    businessNumber: '121-26-72548', // 동진테크 실제 사업자등록번호
    address: '인천광역시 남동구 청능대로340번길 24, 2층 (고잔동)',
    phone: '032-123-4567',
    email: 'info@dongjintech.com',
    registrationDate: '2025-01-15',
    businessType: '통신판매업',
    businessCategory: '자동차부품 판매',
    status: '허가완료',
    // 공정거래위원회 통신판매업 신고 정보 조회 시스템
    ftcUrl: 'https://www.ftc.go.kr/www/bizCommPop.do?wrkr_no=1212672548'
  };

  const handleFtcCheck = () => {
    // 공정거래위원회 통신판매업 신고 정보 조회 시스템으로 이동
    const url = 'https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1212672548';
    window.open(url, '_blank', 'width=1000,height=700');
  };

  const closeVerificationResult = () => {
    setShowVerificationResult(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">공정거래확인</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* 내용 */}
              <div className="p-6">
                {/* 신고번호 */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">신고번호</p>
                      <p className="text-xl font-bold text-blue-900">{businessInfo.registrationNumber}</p>
                    </div>
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle size={16} className="text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-700">{businessInfo.status}</span>
                    </div>
                  </div>
                </div>

                {/* 회사 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Building size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">상호명</span>
                      </div>
                      <p className="text-gray-900 font-medium">{businessInfo.companyName}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">사업자명</span>
                      </div>
                      <p className="text-gray-900">{businessInfo.businessName}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">대표자</span>
                      </div>
                      <p className="text-gray-900">{businessInfo.representative}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">사업자등록번호</span>
                      </div>
                      <p className="text-gray-900">{businessInfo.businessNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <MapPin size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">사업장 주소</span>
                      </div>
                      <p className="text-gray-900">{businessInfo.address}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Phone size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">연락처</span>
                      </div>
                      <p className="text-gray-900">{businessInfo.phone}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">이메일</span>
                      </div>
                      <p className="text-gray-900">{businessInfo.email}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">신고일자</span>
                      </div>
                      <p className="text-gray-900">{businessInfo.registrationDate}</p>
                    </div>
                  </div>
                </div>

                {/* 사업 정보 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">사업 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">사업 유형:</span>
                      <span className="ml-2 text-gray-900">{businessInfo.businessType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">사업 분야:</span>
                      <span className="ml-2 text-gray-900">{businessInfo.businessCategory}</span>
                    </div>
                  </div>
                </div>

                {/* 공정거래위원회 확인 버튼 */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-yellow-900 mb-2">공정거래위원회 확인</h3>
                      <p className="text-sm text-yellow-800">
                        공정거래위원회 공식 사이트로 이동하여 사업자등록번호(121-26-72548)로 검색하여 동진테크의 통신판매업 신고 정보를 확인할 수 있습니다.
                      </p>
                    </div>
                    <button
                      onClick={handleFtcCheck}
                      className="flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      공정거래 확인
                    </button>
                  </div>
                </div>

                {/* 안내사항 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">안내사항</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 이 정보는 공정거래위원회 통신판매업 신고 시스템에서 확인할 수 있습니다.</li>
                    <li>• 신고번호는 사업자별로 고유하게 부여되는 번호입니다.</li>
                    <li>• 통신판매업 신고는 온라인 상품 판매를 위한 필수 절차입니다.</li>
                    <li>• 위 "공정거래 확인" 버튼을 클릭하면 공정거래위원회 공식 사이트로 이동합니다.</li>
                    <li>• 공정거래위원회 사이트에서 사업자등록번호(121-26-72548)로 검색하여 동진테크의 통신판매업 신고 정보를 확인할 수 있습니다.</li>
                  </ul>
                </div>
              </div>

              {/* 푸터 */}
              <div className="flex justify-end p-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BusinessRegistrationModal; 