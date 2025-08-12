import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import BusinessRegistrationModal from './BusinessRegistrationModal';

const Footer: React.FC = React.memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 푸터 링크들을 메모이제이션
  const quickLinks = useMemo(() => [
    { to: "/", label: "홈" },
    { to: "/about", label: "회사소개" },
    { to: "/products", label: "제품" },
    { to: "/repair-service", label: "수리서비스" },
    { to: "/contact", label: "문의" }
  ], []);

  const policyLinks = useMemo(() => [
    { to: "/terms", label: "이용약관" },
    { to: "/privacy", label: "개인정보처리방침" },
            { to: "/refund-policy", label: "반품/환불/구매" }
  ], []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">REMEN_ABS</h3>
              <p className="text-gray-300 mb-4">
                동진테크는 자동차 ABS 모듈 재제조 전문업체입니다. 
                최고 품질의 재제조 ABS 모듈로 안전한 주행을 보장합니다.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">바로가기</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">연락처</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>인천광역시 남동구 청능대로340번길 24, 2층<br />(고잔동)</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>032-221-9182</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <a 
                    href="mailto:info@remen-abs.com?subject=REMEN_ABS 문의&body=안녕하세요,%0D%0A%0D%0AREMEN_ABS에 대한 문의사항이 있습니다.%0D%0A%0D%0A문의 내용:%0D%0A%0D%0A%0D%0A감사합니다."
                    className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                    title="info@remen-abs.com로 메일 보내기"
                  >
                    info@remen-abs.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-400">&copy; 2024 동진테크. All rights reserved.</p>
                <div className="mt-2 flex items-center justify-center md:justify-start">
                  <span className="text-sm text-gray-400 mr-2">
                    통신판매업 신고번호: 2025-인천남동구-1484
                  </span>
                  <button
                    onClick={handleOpenModal}
                    className="inline-flex items-center px-2 py-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
                    title="통신판매업 신고 정보 확인"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    확인
                  </button>
                </div>
              </div>
              <div className="flex justify-center space-x-6 text-sm">
                {policyLinks.map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 통신판매업 신고 확인 모달 */}
      <BusinessRegistrationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
});

Footer.displayName = 'Footer';

export default Footer; 