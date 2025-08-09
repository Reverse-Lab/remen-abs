import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Zap, Award, Car, Star, CheckCircle, ShoppingCart, 
  Truck, Wrench, FileText, CreditCard, Package, Phone, 
  AlertCircle, Clock, CheckSquare, DollarSign, UserCheck
} from 'lucide-react';
import { productService, Product } from '../services/firebaseService';
import { useCart } from '../contexts/CartContext';
import SEO from '../components/SEO';

interface DisplayProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: string;
  features: string[];
  image: string;
  rating: number;
  inStock: boolean;
  soldOut?: boolean;
  imageUrl?: string;
  imageUrls?: string[];
  year?: string;
  description?: string;
  inspectionResults?: {
    brakeTest: string;
    absTest: string;
    pressureTest: string;
    electricalTest: string;
  };
}

interface RepairProcess {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  price: string;
  features: string[];
}

const Products: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  // SEO 최적화: 수리 서비스 중심의 메타 태그 설정
  useEffect(() => {
    // 기존 SEO 관련 코드 제거 - SEO 컴포넌트로 대체
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const firebaseProducts = await productService.getAllProducts();
      
      // Firebase 제품 데이터를 표시용 데이터로 변환
      const displayProducts: DisplayProduct[] = firebaseProducts.map(product => ({
        id: product.id || '',
        name: product.name,
        brand: product.brand,
        model: product.model,
        price: `${product.price.toLocaleString()}원`,
        features: product.features,
        image: '🚗', // 기본 이미지
        rating: product.rating,
        inStock: product.inStock,
        imageUrl: product.imageUrl,
        year: product.year,
        description: product.description,
        inspectionResults: product.inspectionResults
      }));

      setProducts(displayProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('제품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedBrand === 'all' 
    ? products 
    : products.filter(product => product.brand === selectedBrand);

  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand)))];

  // 수리 프로세스 단계 정의 (간략화)
  const repairProcesses: RepairProcess[] = [
    {
      id: 1,
      title: "고장품 회수",
      description: "전국 무료 택배로 고장 ABS 모듈 회수",
      icon: <Truck className="w-8 h-8" />,
      duration: "1-2일",
      price: "무료",
      features: [
        "전국 무료 택배",
        "안전한 포장"
      ]
    },
    {
      id: 2,
      title: "문제점 점검",
      description: "전문 장비로 정밀 진단",
      icon: <Wrench className="w-8 h-8" />,
      duration: "1일",
      price: "무료",
      features: [
        "전문 진단 장비",
        "상세 분석 리포트"
      ]
    },
    {
      id: 3,
      title: "수리비 산정",
      description: "정확한 수리비 산정",
      icon: <DollarSign className="w-8 h-8" />,
      duration: "즉시",
      price: "진단 후 산정",
      features: [
        "투명한 비용",
        "수리 불가 시 무료 반송"
      ]
    },
    {
      id: 4,
      title: "고객 견적확인",
      description: "상세 견적서 제공",
      icon: <FileText className="w-8 h-8" />,
      duration: "1일",
      price: "무료",
      features: [
        "상세 견적서",
        "고객 승인 후 진행"
      ]
    },
    {
      id: 5,
      title: "수리진행",
      description: "전문 기술자 수리 작업",
      icon: <CheckSquare className="w-8 h-8" />,
      duration: "3-5일",
      price: "견적서 기준",
      features: [
        "전문 기술자",
        "품질 보증"
      ]
    },
    {
      id: 6,
      title: "수리 완료 결제",
      description: "안전한 온라인 결제",
      icon: <CreditCard className="w-8 h-8" />,
      duration: "즉시",
      price: "수리비 기준",
      features: [
        "온라인 결제",
        "수리 완료 후 결제"
      ]
    },
    {
      id: 7,
      title: "안전 발송",
      description: "수리 완료품 안전 발송",
      icon: <Package className="w-8 h-8" />,
      duration: "1-2일",
      price: "무료",
      features: [
        "안전한 포장",
        "배송 추적"
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "ABS 모듈 수리 서비스",
    "description": "고장품 회수부터 수리 완료 후 발송까지 원스톱 ABS 모듈 수리 서비스",
    "provider": {
      "@type": "Organization",
      "name": "REMEN_ABS",
      "description": "ABS 모듈 전문 수리 업체"
    },
    "serviceType": "자동차 부품 수리",
    "areaServed": "대한민국",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ABS 모듈 수리 서비스",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ABS 모듈 수리",
            "description": "전문적인 ABS 모듈 수리 서비스"
          }
        }
      ]
    }
  };

  return (
    <div>
      <SEO
        title="ABS 모듈 수리 서비스 - 고장품 회수부터 수리 완료까지 | REMEN_ABS"
        description="ABS 모듈 전문 수리 서비스. 고장품 회수, 문제점 점검, 수리비 산정, 고객 견적확인, 수리진행, 결제, 발송까지 원스톱 서비스 제공."
        keywords="ABS 모듈 수리, 고장품 회수, ABS 수리 서비스, 렉서스 ABS 수리, 벤츠 ABS 수리, BMW ABS 수리, 아우디 ABS 수리, 수입차 ABS 수리, 브레이크 시스템 수리, ABS 모듈 교체, 자동차 부품 수리, ABS 고장, 브레이크 모듈 수리, ABS 재생, ABS 교체, 브레이크 모듈, 안전장치 수리, 자동차 안전 수리"
        canonical="https://www.remen-abs.com/products"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            ABS 모듈 전문 수리 서비스
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            고장품 회수부터 수리 완료 후 발송까지 원스톱 서비스로 안전하고 경제적인 ABS 모듈 수리를 경험하세요.
          </motion.p>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              수리 서비스 특징
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              REMEN_ABS만의 특별한 수리 서비스 프로세스를 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">품질 보장</h3>
              <p className="text-gray-600">
                전문 기술자의 정밀한 수리와 엄격한 품질 검사를 통해 
                모든 수리 제품은 1년 보증을 제공합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">빠른 수리</h3>
              <p className="text-gray-600">
                평균 3-5일 내 수리 완료. 긴급한 경우 당일 수리도 가능하며,
                수리 과정을 실시간으로 확인할 수 있습니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">전문 기술</h3>
              <p className="text-gray-600">
                20년 이상의 ABS 모듈 수리 전문 기술로 
                완벽한 수리 품질을 보장합니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Repair Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              수리 프로세스
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              고장품 회수부터 수리 완료까지 7단계 체계적 프로세스
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repairProcesses.map((process, index) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    {process.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{process.title}</h3>
                    <p className="text-sm text-gray-600">{process.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">기간: {process.duration}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">비용: {process.price}</span>
                </div>

                <div className="space-y-1">
                  {process.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-xs text-gray-600">
                      <CheckCircle className="text-green-500 mr-1" size={12} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              수리 서비스의 장점
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              새 제품 대비 경제적이고 환경 친화적인 수리 서비스
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">경제적</h3>
              <p className="text-gray-600">새 제품 대비 50-70% 절약</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">품질 보장</h3>
              <p className="text-gray-600">1년 보증 및 품질 보장</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">빠른 처리</h3>
              <p className="text-gray-600">3-5일 내 수리 완료</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">전문 서비스</h3>
              <p className="text-gray-600">20년 전문 기술</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Available Products for Exchange */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              교환 가능한 제품
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              수리 불가능한 경우 교환용 재제조 ABS 모듈을 제공합니다.
            </p>
          </div>

          {/* Product Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  selectedBrand === brand
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {brand === 'all' ? '전체' : brand}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">등록된 제품이 없습니다</h3>
              <p className="text-gray-600 mb-8">관리자가 제품을 등록하면 여기에 표시됩니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      {product.imageUrl ? (
                        <div className="relative">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className={`w-full h-48 object-cover rounded-lg mb-4 ${product.soldOut ? 'filter grayscale opacity-60' : ''}`}
                          />
                          {product.imageUrls && product.imageUrls.length > 0 && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                              +{product.imageUrls.length}
                            </div>
                          )}
                          {/* 판매완료 오버레이 */}
                          {product.soldOut && (
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg mb-4">
                              <div className="text-white text-center">
                                <div className="text-3xl font-bold mb-2">판매완료</div>
                                <div className="text-lg">이미 판매된 제품입니다</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative text-6xl mb-4">
                          <div className={`${product.soldOut ? 'filter grayscale opacity-60' : ''}`}>
                            {product.image}
                          </div>
                          {/* 판매완료 오버레이 (이미지가 없는 경우) */}
                          {product.soldOut && (
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                              <div className="text-white text-center">
                                <div className="text-3xl font-bold mb-2">판매완료</div>
                                <div className="text-lg">이미 판매된 제품입니다</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-2">{product.brand} {product.model}</p>
                      {product.year && (
                        <p className="text-sm text-gray-500 mb-2">{product.year}년식</p>
                      )}
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{product.price}</div>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                      )}
                      <div className="space-y-2">
                        {product.features.map((feature, i) => (
                          <div key={i} className="flex items-center">
                            <CheckCircle className="text-green-500 mr-2" size={16} />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {product.soldOut ? (
                        <>
                          <button 
                            className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
                            disabled
                          >
                            판매완료
                          </button>
                          <button 
                            className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
                            disabled
                          >
                            판매완료
                          </button>
                        </>
                      ) : !product.inStock ? (
                        <>
                          <button 
                            className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
                            disabled
                          >
                            품절
                          </button>
                          <button 
                            className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
                            disabled
                          >
                            품절
                          </button>
                        </>
                      ) : (
                        <>
                          {isInCart(product.id) ? (
                            <button 
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
                              disabled
                            >
                              장바구니에 추가됨
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  brand: product.brand,
                                  model: product.model,
                                  price: parseInt(product.price.replace(/[^0-9]/g, '')),
                                  imageUrl: product.imageUrl || '',
                                  inStock: product.inStock
                                });
                              }}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                              <ShoppingCart size={16} className="mr-2" />
                              장바구니 추가
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart({
                                id: product.id,
                                name: product.name,
                                brand: product.brand,
                                model: product.model,
                                price: parseInt(product.price.replace(/[^0-9]/g, '')),
                                imageUrl: product.imageUrl || '',
                                inStock: product.inStock
                              });
                              navigate('/checkout');
                            }}
                            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                          >
                            교환 신청
                          </button>
                        </>
                      )}
                    </div>

                    {product.soldOut ? (
                      <div className="mt-4 text-center">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          판매완료
                        </span>
                      </div>
                    ) : !product.inStock ? (
                      <div className="mt-4 text-center">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          품절
                        </span>
                      </div>
                    ) : (
                      <div className="mt-4 text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          교환 가능
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 수리 서비스를 신청하세요
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            전문 상담원이 최적의 수리 방안을 제안해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/repair-service')}
              className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              수리 서비스 신청
            </button>
            <a
                                href="tel:010-9027-9182"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center"
            >
              <Phone size={20} className="mr-2" />
                              010-9027-9182
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products; 