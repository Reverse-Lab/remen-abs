import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Users, MessageSquare, Settings, LogOut, Edit, Trash2, Globe, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { productService, inquiryService, Inquiry, Product } from '../services/firebaseService';
import { addNewRoute, removeRoute, generateFullSitemap } from '../utils/sitemapGenerator';
import VisitorStats from '../components/VisitorStats';
import { useNotifications } from '../contexts/NotificationContext';

const Admin: React.FC = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { refreshNotifications } = useNotifications();
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'settings' | 'seo' | 'analytics'>('products');
  const [newPagePath, setNewPagePath] = useState('');
  const [newPagePriority, setNewPagePriority] = useState(0.5);
  const [sitemapXml, setSitemapXml] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  // Notification toast removed; only refreshing counts

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (!isAdmin) {
      alert('관리자 권한이 필요합니다.');
      navigate('/');
      return;
    }

    loadData();
  }, [user, isAdmin, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, inquiriesData] = await Promise.all([
        productService.getAllProducts(),
        inquiryService.getAllInquiries()
      ]);
      setProducts(productsData);
      setInquiries(inquiriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'products' | 'inquiries' | 'settings' | 'seo' | 'analytics') => {
    setActiveTab(tab);
    // 탭 변경 시 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProductSuccess = () => {
    loadData();
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('정말로 이 제품을 삭제하시겠습니까?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('제품 삭제 중 오류가 발생했습니다.');
      }
    }
  };



  const openInquiryModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAnswerText(inquiry.answer || '');
    setIsInquiryModalOpen(true);
  };

  const closeInquiryModal = () => {
    setIsInquiryModalOpen(false);
    setSelectedInquiry(null);
    setAnswerText('');
    setSubmittingAnswer(false);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedInquiry || !answerText.trim()) return;

    try {
      setSubmittingAnswer(true);
      if (selectedInquiry.answer) {
        await inquiryService.updateAnswer(selectedInquiry.id!, answerText);
      } else {
        await inquiryService.addAnswer(selectedInquiry.id!, answerText);
      }
      
      // 문의 목록 새로고침
      await loadData();
      closeInquiryModal();
      refreshNotifications(); // 답변 제출 후 알림 새로고침
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('답변 제출 중 오류가 발생했습니다.');
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: Inquiry['status']) => {
    try {
      await inquiryService.updateInquiryStatus(inquiryId, newStatus);
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
            <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-sm text-gray-600">
                {userProfile?.name || user?.email}님 환영합니다
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group ${
              activeTab === 'products' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleTabChange('products')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabChange('products');
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="총 제품 통계 - 클릭하여 제품 관리 탭으로 이동"
            aria-pressed={activeTab === 'products'}
          >
            <div className="flex items-center">
              <div className={`rounded-lg p-3 transition-colors ${
                activeTab === 'products' ? 'bg-blue-200' : 'bg-blue-100 group-hover:bg-blue-200'
              }`}>
                <Package className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 제품</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}개</p>
                <p className="text-xs text-blue-600 mt-1">클릭하여 제품 관리</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group ${
              activeTab === 'inquiries' ? 'ring-2 ring-green-500 bg-green-50' : ''
            }`}
            onClick={() => handleTabChange('inquiries')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabChange('inquiries');
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="총 문의 통계 - 클릭하여 문의 관리 탭으로 이동"
            aria-pressed={activeTab === 'inquiries'}
          >
            <div className="flex items-center">
              <div className={`rounded-lg p-3 transition-colors ${
                activeTab === 'inquiries' ? 'bg-green-200' : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <MessageSquare className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 문의</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.length}건</p>
                <p className="text-xs text-green-600 mt-1">클릭하여 문의 관리</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group ${
              activeTab === 'inquiries' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
            }`}
            onClick={() => handleTabChange('inquiries')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabChange('inquiries');
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="대기 문의 통계 - 클릭하여 문의 관리 탭으로 이동"
            aria-pressed={activeTab === 'inquiries'}
          >
            <div className="flex items-center">
              <div className={`rounded-lg p-3 transition-colors ${
                activeTab === 'inquiries' ? 'bg-yellow-200' : 'bg-yellow-100 group-hover:bg-yellow-200'
              }`}>
                <Users className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">대기 문의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => i.status === 'pending').length}건
                </p>
                <p className="text-xs text-yellow-600 mt-1">클릭하여 문의 관리</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => handleTabChange('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                제품 관리
              </button>
              <button
                onClick={() => handleTabChange('inquiries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inquiries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                문의 관리
              </button>
              <button
                onClick={() => handleTabChange('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                설정
              </button>
              <button
                onClick={() => handleTabChange('seo')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'seo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                SEO 관리
              </button>
              <button
                onClick={() => handleTabChange('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 size={16} className="inline mr-2" />
                방문자 통계
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">제품 목록</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsProductFormOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>제품 등록</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제품명
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          브랜드/모델
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          가격
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          재고
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          등록일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.imageUrl && (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                  src={product.imageUrl}
                                  alt={product.name}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.year ? `${product.year}년식` : '연식 정보 없음'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.brand} {product.model}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.price.toLocaleString()}원
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? '재고있음' : '품절'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 md:space-x-4">
                              <button
                                onClick={() => handleEditProduct(product)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleEditProduct(product);
                                  }
                                }}
                                className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                title="제품 수정"
                                aria-label={`${product.name} 제품 수정`}
                              >
                                <Edit size={18} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-xs md:text-sm font-medium hidden sm:inline">수정</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id!)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleDeleteProduct(product.id!);
                                  }
                                }}
                                className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                title="제품 삭제"
                                aria-label={`${product.name} 제품 삭제`}
                              >
                                <Trash2 size={18} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-xs md:text-sm font-medium hidden sm:inline">삭제</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === 'inquiries' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">문의 목록</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이름
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          연락처
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          차량 정보
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          문의일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          답변
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {inquiry.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <p>{inquiry.email}</p>
                              <p>{inquiry.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <p className="font-medium">{inquiry.carBrand}</p>
                              <p>{inquiry.carModel}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.createdAt?.toDate().toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.answer ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                답변완료
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                답변대기
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openInquiryModal(inquiry)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                            >
                              내용보기
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {inquiries.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 문의가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">관리자 설정</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">계정 정보</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이메일</label>
                      <p className="text-sm text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이름</label>
                      <p className="text-sm text-gray-900">{userProfile?.name || '미설정'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">권한</label>
                      <p className="text-sm text-gray-900">{userProfile?.role === 'admin' ? '관리자' : '일반 사용자'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO 관리</h2>
                
                {/* 새 페이지 추가 */}
                <div className="bg-white border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">새 페이지 추가</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">페이지 경로</label>
                      <input
                        type="text"
                        value={newPagePath}
                        onChange={(e) => setNewPagePath(e.target.value)}
                        placeholder="/new-page"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">우선순위 (0.0-1.0)</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newPagePriority}
                        onChange={(e) => setNewPagePriority(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          if (newPagePath) {
                            addNewRoute(newPagePath, newPagePriority);
                            setNewPagePath('');
                            setNewPagePriority(0.5);
                            alert('새 페이지가 sitemap에 추가되었습니다.');
                          }
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        페이지 추가
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sitemap 생성 */}
                <div className="bg-white border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sitemap 생성</h3>
                  <button
                    onClick={async () => {
                      try {
                        const xml = await generateFullSitemap();
                        setSitemapXml(xml);
                        alert('Sitemap이 생성되었습니다.');
                      } catch (error) {
                        alert('Sitemap 생성 중 오류가 발생했습니다.');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Sitemap 생성
                  </button>
                </div>

                {/* 생성된 Sitemap 표시 */}
                {sitemapXml && (
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">생성된 Sitemap</h3>
                    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                        {sitemapXml}
                      </pre>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const blob = new Blob([sitemapXml], { type: 'application/xml' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'sitemap.xml';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Sitemap 다운로드
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">방문자 통계</h2>
                  <p className="text-sm text-gray-600 mt-2">
                    시간대별, 일별, 주별, 월별 방문자 통계를 확인할 수 있습니다.
                  </p>
                </div>
                <VisitorStats />
              </div>
            )}
          </div>
        </div>
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
              {/* 문의자 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <p className="text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <p className="text-gray-900">{selectedInquiry.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <p className="text-gray-900">{selectedInquiry.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">차량 정보</label>
                  <p className="text-gray-900">{selectedInquiry.carBrand} {selectedInquiry.carModel}</p>
                </div>
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">문의 내용</label>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* 답변 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  답변 {selectedInquiry.answer && <span className="text-green-600">(수정)</span>}
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="답변을 입력해주세요..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* 기존 답변 표시 */}
              {selectedInquiry.answer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기존 답변</label>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.answer}</p>
                    {selectedInquiry.answeredAt && (
                      <p className="text-sm text-green-600 mt-2">
                        답변일: {selectedInquiry.answeredAt.toDate().toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 문의 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">문의일:</span> {selectedInquiry.createdAt?.toDate().toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">상태:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedInquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedInquiry.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedInquiry.status === 'pending' ? '대기중' :
                     selectedInquiry.status === 'processing' ? '처리중' : '완료'}
                  </span>
                </div>
              </div>
            </div>

            {/* 모달 하단 버튼 */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeInquiryModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                닫기
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim() || submittingAnswer}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingAnswer ? '처리중...' : selectedInquiry.answer ? '답변 수정' : '답변 제출'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={handleProductSuccess}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default Admin; 