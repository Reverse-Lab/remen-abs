import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Award, 
  Car, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  Wrench,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { productService, Product } from '../services/firebaseService';
import { useCart } from '../contexts/CartContext';

interface ProductDetailProps {
  id: string;
  name: string;
  brand: string;
  model: string;
  year?: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls?: string[];
  inStock: boolean;
  soldOut?: boolean;
  rating: number;
  inspectionResults?: {
    brakeTest: string;
    absTest: string;
    pressureTest: string;
    electricalTest: string;
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'warranty'>('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  // 페이지 로딩 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO 최적화: 제품 정보에 따른 동적 메타 태그 및 구조화된 데이터
  useEffect(() => {
    if (product) {
      // 동적 제목 설정
      document.title = `${product.brand} ${product.model} ${product.name} - REMEN_ABS 재제조`;
      
      // 메타 설명 업데이트
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${product.brand} ${product.model} ${product.name} 재생 ABS 모듈. ${product.description}. 1년 보증, 품질 검증 완료. 렉서스 등 수입차 전문 서비스.`
        );
      }

      // 키워드 메타 태그 업데이트
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        const keywords = [
          `${product.brand} ABS`, `${product.model} ABS`, `${product.brand} ${product.model} ABS`,
          'ABS 모듈', '재생', '브레이크 시스템', '자동차 부품', '중고 ABS', 'ABS 수리',
          `${product.brand} ABS 모듈`, `${product.model} ABS 모듈`, 'ABS 재생', 'ABS 교체',
          '브레이크 모듈', '안전장치', '자동차 안전', '수입차 ABS', '렉서스 ABS', '벤츠 ABS', 'BMW ABS', '아우디 ABS'
        ].join(', ');
        metaKeywords.setAttribute('content', keywords);
      }

              // 구조화된 데이터 (JSON-LD) 추가
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `${product.brand} ${product.model} ${product.name}`,
          "description": product.description,
          "brand": {
            "@type": "Brand",
            "name": product.brand
          },
          "model": product.model,
          "category": "자동차 부품",
          "subcategory": "ABS 모듈",
          "keywords": `${product.brand} ABS, ${product.model} ABS, ABS 모듈, 재생, 브레이크 시스템`,
          "url": `https://www.remen-abs.com/products/${product.id}`,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "KRW",
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "REMEN_ABS",
              "description": "중고 ABS 모듈 재제조 전문업체"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": Math.floor(product.rating * 10)
          },
          "image": product.imageUrl,
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "재생",
              "value": "예"
            },
            {
              "@type": "PropertyValue", 
              "name": "보증기간",
              "value": "1년"
            },
            {
              "@type": "PropertyValue",
              "name": "검증완료",
              "value": "예"
            },
            {
              "@type": "PropertyValue",
              "name": "제품명",
              "value": `${product.brand} ${product.model} ${product.name}`
            },
            {
              "@type": "PropertyValue",
              "name": "브랜드",
              "value": product.brand
            },
            {
              "@type": "PropertyValue",
              "name": "모델",
              "value": product.model
            }
          ]
        };

      // 기존 구조화된 데이터 제거
      const existingScript = document.querySelector('script[data-seo="product"]');
      if (existingScript) {
        existingScript.remove();
      }

      // 새로운 구조화된 데이터 추가
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'product');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      // Open Graph 태그 업데이트
      updateOpenGraphTags();
    }
  }, [product]);

  const updateOpenGraphTags = () => {
    if (!product) return;

    // Open Graph 태그 업데이트
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${product.brand} ${product.model} ${product.name} - REMEN_ABS`);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', `${product.brand} ${product.model} ${product.name} 재제조 ABS 모듈. ${product.description}`);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && product.imageUrl) {
      ogImage.setAttribute('content', product.imageUrl);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://www.remen-abs.com/products/${product.id}`);
    }
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (getAllImages().length > 1) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          prevImage();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, currentImageIndex]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const products = await productService.getAllProducts();
      const foundProduct = products.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct({
          id: foundProduct.id || '',
          name: foundProduct.name,
          brand: foundProduct.brand,
          model: foundProduct.model,
          year: foundProduct.year,
          price: foundProduct.price,
          description: foundProduct.description,
          features: foundProduct.features,
          imageUrl: foundProduct.imageUrl,
          imageUrls: foundProduct.imageUrls,
          inStock: foundProduct.inStock,
          rating: foundProduct.rating,
          inspectionResults: foundProduct.inspectionResults
        });
      } else {
        setError('제품을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('제품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 전환 함수들
  const nextImage = () => {
    if (product) {
      const totalImages = 1 + (product.imageUrls?.length || 0);
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const prevImage = () => {
    if (product) {
      const totalImages = 1 + (product.imageUrls?.length || 0);
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 현재 표시할 이미지 URL 가져오기
  const getCurrentImageUrl = () => {
    if (!product) return '';
    
    if (currentImageIndex === 0) {
      return product.imageUrl;
    } else {
      return product.imageUrls?.[currentImageIndex - 1] || product.imageUrl;
    }
  };

  // 모든 이미지 배열 생성
  const getAllImages = () => {
    if (!product) return [];
    
    const images = [product.imageUrl];
    if (product.imageUrls) {
      images.push(...product.imageUrls);
    }
    return images;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '제품을 찾을 수 없습니다.'}</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            제품 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-600 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">중고 재제조 상품 안내</h3>
              <p className="text-yellow-700 text-sm">
                본 제품은 중고 부품을 재제조한 상품입니다. 1년 2만키로 보증을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image with Navigation */}
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                {getCurrentImageUrl() ? (
                  <div className="relative">
                    <img 
                      src={getCurrentImageUrl()} 
                      alt={product.name}
                      className={`w-full h-96 object-cover ${product.soldOut ? 'filter grayscale opacity-60' : ''}`}
                    />
                    {/* 판매완료 오버레이 */}
                    {product.soldOut && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-4xl font-bold mb-3">판매완료</div>
                          <div className="text-xl">이미 판매된 제품입니다</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center">
                    <div className={`text-6xl ${product.soldOut ? 'filter grayscale opacity-60' : ''}`}>🚗</div>
                    {/* 판매완료 오버레이 (이미지가 없는 경우) */}
                    {product.soldOut && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-4xl font-bold mb-3">판매완료</div>
                          <div className="text-xl">이미 판매된 제품입니다</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Arrows */}
                {getAllImages().length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {getAllImages().length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {getAllImages().length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {getAllImages().length > 1 && (
                <div className="flex justify-center space-x-2">
                  {getAllImages().map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-blue-500 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Additional Images Grid (if no navigation) */}
              {product.imageUrls && product.imageUrls.length > 0 && getAllImages().length <= 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">추가 이미지</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {product.imageUrls.map((imageUrl, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-24 object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{product.brand} {product.model}</p>
              {product.year && (
                <p className="text-lg text-gray-500 mb-6">{product.year}년식</p>
              )}

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  {product.price.toLocaleString()}원
                </div>
                <p className="text-sm text-gray-500 mt-1">부가세 포함</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.soldOut ? (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                    판매완료
                  </span>
                ) : !product.inStock ? (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                    품절
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    재고 있음
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                {product.soldOut ? (
                  <>
                    <button 
                      className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                      disabled
                    >
                      판매완료
                    </button>
                    <button 
                      className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                      disabled
                    >
                      판매완료
                    </button>
                  </>
                ) : !product.inStock ? (
                  <>
                    <button 
                      className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                      disabled
                    >
                      품절
                    </button>
                    <button 
                      className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                      disabled
                    >
                      품절
                    </button>
                  </>
                ) : (
                  <>
                    {isInCart(product.id) ? (
                      <button 
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                        disabled
                      >
                        장바구니에 추가됨
                      </button>
                    ) : (
                      <button 
                        onClick={() => addToCart({
                          id: product.id,
                          sku: product.id,
                          name: product.name,
                          brand: product.brand,
                          model: product.model,
                          price: product.price,
                          imageUrl: product.imageUrl,
                          inStock: product.inStock
                        })}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <ShoppingCart size={20} className="mr-2" />
                        장바구니 추가
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        // 해당 제품을 장바구니에 추가
                        addToCart({
                          id: product.id,
                          sku: product.id,
                          name: product.name,
                          brand: product.brand,
                          model: product.model,
                          price: product.price,
                          imageUrl: product.imageUrl,
                          inStock: product.inStock
                        });
                        // 바로 결제 페이지로 이동
                        navigate('/checkout');
                      }}
                      className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      주문하기
                    </button>
                  </>
                )}
              </div>

              {/* Quick Features */}
              <div className="space-y-3 mb-8">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                제품 개요
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                검사 결과
              </button>
              <button
                onClick={() => setActiveTab('warranty')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'warranty'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                보증 및 주의사항
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">제품 설명</h3>
                  <p className="text-gray-700 mb-6">{product.description}</p>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">주요 특징</h4>
                  <ul className="space-y-2 mb-8">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Product Images Gallery */}
                  {getAllImages().length > 0 && (
                    <div className="mb-8">
                      <div className="grid grid-cols-2 gap-4">
                        {getAllImages().map((imageUrl, index) => (
                          <div 
                            key={index} 
                            className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                            onClick={() => goToImage(index)}
                          >
                            <img 
                              src={imageUrl} 
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-120 object-contain bg-gray-50"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start space-x-3">
                          <div className="text-green-600 text-lg">🔍</div>
                          <div>
                            <h5 className="text-sm font-semibold text-green-800 mb-1">제품 상태 확인 포인트</h5>
                            <ul className="text-xs text-green-700 space-y-1">
                              <li>• 부품 번호와 제조사 정보 일치 여부</li>
                              <li>• 라벨의 경고 문구 및 사용법 확인</li>
                              <li>• 외관 상태 및 오염, 손상 여부</li>
                              <li>• 전기 커넥터 상태 및 연결부 확인</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                                 <h3 className="text-2xl font-bold text-gray-900 mb-6">검사 결과</h3>
                 {product.inspectionResults ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white rounded-lg p-6 shadow-sm border">
                       <h4 className="font-semibold text-gray-900 mb-4">제동 검사</h4>
                       <p className="text-gray-700">{product.inspectionResults.brakeTest}</p>
                     </div>
                     <div className="bg-white rounded-lg p-6 shadow-sm border">
                       <h4 className="font-semibold text-gray-900 mb-4">ABS 검사</h4>
                       <p className="text-gray-700">{product.inspectionResults.absTest}</p>
                     </div>
                     <div className="bg-white rounded-lg p-6 shadow-sm border">
                       <h4 className="font-semibold text-gray-900 mb-4">압력 검사</h4>
                       <p className="text-gray-700">{product.inspectionResults.pressureTest}</p>
                     </div>
                     <div className="bg-white rounded-lg p-6 shadow-sm border">
                       <h4 className="font-semibold text-gray-900 mb-4">전기 검사</h4>
                       <p className="text-gray-700">{product.inspectionResults.electricalTest}</p>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-gray-50 rounded-lg p-6">
                     <p className="text-gray-600 text-center">검사 결과 정보가 없습니다.</p>
                   </div>
                 )}
              </motion.div>
            )}

            {/* Warranty Tab */}
            {activeTab === 'warranty' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  {/* Warranty Info */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Shield className="text-blue-600 mr-3" size={24} />
                      <h3 className="text-xl font-semibold text-blue-900">보증 정보</h3>
                    </div>
                    <div className="space-y-3 text-blue-800">
                      <p><strong>보증 기간:</strong> 1년</p>
                      <p><strong>보증 거리:</strong> 20,000km</p>
                      <p><strong>보증 범위:</strong> 제조 결함 및 기능 이상</p>
                      <p><strong>보증 조건:</strong> 정상적인 사용 및 정기 점검 시</p>
                    </div>
                  </div>

                  {/* Trust Info */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Award className="text-green-600 mr-3" size={24} />
                      <h3 className="text-xl font-semibold text-green-900">신뢰성 보장</h3>
                    </div>
                    <div className="space-y-3 text-green-800">
                      <p>• 자체 개발한 전문 세척 시스템으로 완벽한 오염물 제거</p>
                      <p>• 첨단 성능 검사 장비로 모든 기능 정상 작동 확인</p>
                      <p>• 20년 이상의 재제조 전문 기술력</p>
                      <p>• 엄격한 품질 관리 시스템</p>
                    </div>
                  </div>

                  {/* Warning Info */}
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="text-yellow-600 mr-3" size={24} />
                      <h3 className="text-xl font-semibold text-yellow-900">주의사항</h3>
                    </div>
                    <div className="space-y-3 text-yellow-800">
                      <p><strong>중요:</strong> 신뢰할 수 있는 정비 자격을 갖춘 기술자에게 수리를 의뢰하세요.</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>자동차 정비업 등록업체에서 수리</li>
                        <li>ABS 전문 정비 기술자 확인</li>
                        <li>적절한 도구와 장비 사용</li>
                        <li>수리 후 반드시 기능 테스트 수행</li>
                      </ul>
                    </div>
                  </div>

                  {/* Installation Guide */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Wrench className="text-gray-600 mr-3" size={24} />
                      <h3 className="text-xl font-semibold text-gray-900">설치 가이드</h3>
                    </div>
                    <div className="space-y-3 text-gray-700">
                      <p>• 전문 정비소에서 설치를 권장합니다</p>
                      <p>• 설치 전 배터리 연결 해제</p>
                      <p>• 설치 후 ABS 경고등 점검</p>
                      <p>• 시험 주행으로 모든 기능 확인</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>


      </div>

      {/* 배송 상품 확인 요청 및 반품/구매 절차 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* 배송 상품 확인 요청 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                📦 배송 상품 확인 요청
              </h2>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">
                      🎯 배송 상품 확인의 중요성
                    </h3>
                    <p className="text-blue-800 leading-relaxed">
                      동진테크는 결함이 있거나 정상 작동하지 않는 제품에 대해서만 반품을 받습니다. 
                      상품 페이지나 쇼핑 가이드에 명시된 특정 규정에 해당하는 경우 반품/구매가 불가능할 수 있으니 
                      해당 규정을 반드시 확인해 주시기 바랍니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        ✅ 반품/구매 가능한 경우
                      </h4>
                      <ul className="space-y-2 text-green-700">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>제품의 기능적 결함이 있는 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>배송 중 제품이 파손된 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>제품이 표시·광고 내용과 다른 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>제품의 내용을 확인하기 위해 포장을 훼손한 경우</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                        ❌ 반품/구매 불가능한 경우
                      </h4>
                      <ul className="space-y-2 text-red-700">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>배송 후 7일이 경과한 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>배송 시 내용물을 확인하지 않은 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>제조업체 서비스 매뉴얼에 따라 작업을 수행하지 않은 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>구매 작업 중 손상된 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>분해, 수정, 부품 교체 또는 부품 제거가 확인된 경우</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>동진테크 제품 페이지 외에서 구매한 제품</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>고객의 편의로 인한 반품/취소</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 반품/구매 절차 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                🔄 반품/구매 절차
              </h2>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Step 1 */}
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 font-bold text-xl">1</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">상품 확인</h3>
                      <p className="text-sm text-gray-600">
                        반품/구매 가능 여부를 확인하세요. "반품/구매 불가능한 경우" 섹션을 참고하세요.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 font-bold text-xl">2</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">사전 연락</h3>
                      <p className="text-sm text-gray-600">
                        반품 전 반드시 사전에 연락해 주세요. 필요한 정보를 준비해 주세요.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 font-bold text-xl">3</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">안내 이메일</h3>
                      <p className="text-sm text-gray-600">
                        등록된 이메일 주소로 안내 이메일을 발송해 드립니다.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 font-bold text-xl">4</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">상품 반송</h3>
                      <p className="text-sm text-gray-600">
                        반품 주소로 상품을 반송해 주세요. 픽업을 대행해 드립니다.
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 font-bold text-xl">5</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">확인 및 처리</h3>
                      <p className="text-sm text-gray-600">
                        반송된 상품을 확인한 후 이메일로 연락드립니다.
                      </p>
                    </div>
                  </div>

                  {/* 필요한 정보 */}
                  <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                      📋 사전 연락 시 필요한 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-yellow-700">
                        <li>• 제품명, 구매일, 구매자명</li>
                        <li>• 결함을 보여주는 이미지, 영상 또는 테스터 화면</li>
                        <li>• 제품이 설치된 차량의 차대번호 및 번호판 사진</li>
                      </ul>
                      <ul className="space-y-2 text-yellow-700">
                        <li>• 원본 부품, 배송된 부품, 차량을 보여주는 사진</li>
                        <li>• 구매 작업을 수행한 정비소의 이름과 주소</li>
                        <li>• 결함에 대한 객관적 판단이 가능한 자료 첨부</li>
                      </ul>
                    </div>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="mt-6 bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      📞 반품/구매 문의 연락처
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-700">
                      <div>
                                                  <p><strong>전화:</strong> 010-9027-9182</p>
                                                  <p><strong>이메일:</strong> 
                          <a 
                            href="mailto:info@remen-abs.com?subject=REMEN_ABS 제품 문의&body=안녕하세요,%0D%0A%0D%0AREMEN_ABS 제품에 대한 문의사항이 있습니다.%0D%0A%0D%0A제품명: [제품명을 입력해주세요]%0D%0A문의 내용:%0D%0A%0D%0A%0D%0A감사합니다."
                            className="text-blue-700 hover:text-blue-900 underline cursor-pointer"
                            title="info@remen-abs.com로 메일 보내기"
                          >
                            info@remen-abs.com
                          </a>
                        </p>
                      </div>
                      <div>
                        <p><strong>운영시간:</strong> 평일 09:00-18:00</p>
                        <p><strong>점심시간:</strong> 12:00-13:00</p>
                      </div>
                      <div>
                        <p><strong>반품 주소:</strong></p>
                        <p>인천광역시 남동구 청능대로340번길 24, 2층</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail; 