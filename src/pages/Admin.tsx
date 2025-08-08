import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Users, MessageSquare, Settings, LogOut, Edit, Trash2, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { productService, inquiryService, Inquiry, Product } from '../services/firebaseService';
import { addNewRoute, removeRoute, generateFullSitemap } from '../utils/sitemapGenerator';

const Admin: React.FC = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'settings' | 'seo'>('products');
  const [newPagePath, setNewPagePath] = useState('');
  const [newPagePriority, setNewPagePriority] = useState(0.5);
  const [sitemapXml, setSitemapXml] = useState('');

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

  const handleInquiryStatusChange = async (inquiryId: string, status: Inquiry['status']) => {
    try {
      await inquiryService.updateInquiryStatus(inquiryId, status);
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === inquiryId 
            ? { ...inquiry, status } 
            : inquiry
        )
      );
    } catch (error) {
      console.error('Error updating inquiry status:', error);
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
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <Package className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 제품</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}개</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <MessageSquare className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 문의</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.length}건</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Users className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">대기 문의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => i.status === 'pending').length}건
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                제품 관리
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inquiries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                문의 관리
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                설정
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'seo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                SEO 관리
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="수정"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id!)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="삭제"
                              >
                                <Trash2 size={16} />
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
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          문의일
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {inquiry.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inquiry.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {inquiry.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {inquiry.carBrand} {inquiry.carModel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={inquiry.status}
                              onChange={(e) => handleInquiryStatusChange(inquiry.id!, e.target.value as Inquiry['status'])}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">대기중</option>
                              <option value="processing">처리중</option>
                              <option value="completed">완료</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          </div>
        </div>
      </div>

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