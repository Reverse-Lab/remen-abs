import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  Car, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { inquiryService, Inquiry } from '../services/firebaseService';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { markAnswerAsRead } = useNotifications();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/');
      return;
    }

    loadUserInquiries();
  }, [user, authLoading, navigate]);

  const loadUserInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading inquiries for user:', user!.uid);
      const userInquiries = await inquiryService.getUserInquiries(user!.uid);
      console.log('Loaded inquiries:', userInquiries);
      setInquiries(userInquiries);
    } catch (error) {
      console.error('Error loading user inquiries:', error);
      if (error instanceof Error) {
        setError(`문의 내역을 불러오는 중 오류가 발생했습니다: ${error.message}`);
      } else {
        setError('문의 내역을 불러오는 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const openInquiryModal = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsInquiryModalOpen(true);
    
    // 답변이 있고 아직 읽지 않은 경우 읽음으로 표시
    if (inquiry.answer && !inquiry.isRead) {
      try {
        await markAnswerAsRead(inquiry.id!);
        // 로컬 상태 업데이트
        setInquiries(prev => prev.map(inq => 
          inq.id === inquiry.id ? { ...inq, isRead: true } : inq
        ));
      } catch (error) {
        console.error('Error marking answer as read:', error);
      }
    }
  };

  const closeInquiryModal = () => {
    setIsInquiryModalOpen(false);
    setSelectedInquiry(null);
  };

  const getStatusIcon = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'processing':
        return <AlertCircle size={16} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'processing':
        return '처리중';
      case 'completed':
        return '완료';
      default:
        return '대기중';
    }
  };

  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">내 프로필</h1>
        </div>

        {/* 사용자 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userProfile?.name || '사용자'}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-center space-x-3">
               <Mail size={20} className="text-gray-400" />
               <span className="text-gray-700">{user.email}</span>
             </div>
           </div>
        </motion.div>

        {/* 문의 내역 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageSquare size={20} className="text-blue-600" />
              <span>문의 내역</span>
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">문의 내역을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadUserInquiries}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">문의 내역이 없습니다</p>
              <p className="text-sm">새로운 문의를 작성해보세요!</p>
              <button
                onClick={() => navigate('/contact')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                문의하기
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openInquiryModal(inquiry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {getStatusIcon(inquiry.status)}
                          <span className="ml-1">{getStatusText(inquiry.status)}</span>
                        </span>
                        {inquiry.answer && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            inquiry.isRead ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {inquiry.isRead ? '답변완료' : '새 답변'}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Car size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {inquiry.carBrand} {inquiry.carModel}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {inquiry.createdAt?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-900 line-clamp-2">
                        {inquiry.message}
                      </p>
                    </div>

                    <div className="ml-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        자세히 보기 →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* 문의 상세 모달 */}
      {isInquiryModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">문의 상세</h3>
                <button
                  onClick={closeInquiryModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 문의 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">차량 정보</label>
                  <p className="text-gray-900">{selectedInquiry.carBrand} {selectedInquiry.carModel}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">문의일</label>
                  <p className="text-gray-900">{selectedInquiry.createdAt?.toDate().toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                    {getStatusIcon(selectedInquiry.status)}
                    <span className="ml-1">{getStatusText(selectedInquiry.status)}</span>
                  </span>
                </div>
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">문의 내용</label>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* 답변 */}
              {selectedInquiry.answer ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">답변</label>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.answer}</p>
                    {selectedInquiry.answeredAt && (
                      <p className="text-sm text-green-600 mt-2">
                        답변일: {selectedInquiry.answeredAt.toDate().toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <Clock size={20} className="text-yellow-600" />
                    <p className="text-yellow-800 font-medium">답변 대기 중</p>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    문의해주신 내용에 대해 빠른 시일 내에 답변드리겠습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 모달 하단 버튼 */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeInquiryModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
