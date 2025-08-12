import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, CheckCircle, ShoppingCart, Phone
} from 'lucide-react';
import { productService, Product } from '../services/firebaseService';
import { useCart } from '../contexts/CartContext';
import SEO from '../components/SEO';

interface DisplayProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;           // string에서 number로 변경
  priceFormatted: string;  // 새로 추가
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
        price: product.price,                    // 원본 숫자 유지
        priceFormatted: `${product.price.toLocaleString()}원`, // 표시용 포맷
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
    "@type": "Product",
    "name": "ABS 모듈 판매 제품",
    "description": "고품질 ABS 모듈 판매 제품을 제공합니다",
    "brand": {
      "@type": "Brand",
      "name": "REMEN_ABS"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div>
      <SEO
        title="ABS 모듈 판매 제품 - 고품질 ABS 모듈 | REMEN_ABS"
        description="고품질 ABS 모듈 판매 제품을 제공합니다. 렉서스, 벤츠, BMW, 아우디 등 수입차 ABS 모듈 전문."
        keywords="ABS 모듈 판매, ABS 모듈 구매, 렉서스 ABS 모듈, 벤츠 ABS 모듈, BMW ABS 모듈, 아우디 ABS 모듈, 수입차 ABS 모듈, 브레이크 모듈, ABS 구매, 자동차 부품 판매"
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
            className="text-4xl md:text-6xl font-bold mb-6 break-words"
          >
            ABS 모듈 판매 제품
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto break-words"
          >
            고품질 ABS 모듈 판매 제품으로 안전하고 경제적인 구매를 경험하세요.
          </motion.p>
        </div>
      </section>

      {/* Available Products for Exchange */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              판매 제품
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              고품질 재제조 ABS 모듈을 판매합니다.
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
                      <div className="text-2xl font-bold text-blue-600 mb-2">{product.priceFormatted}</div>
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
                                  sku: product.id,
                                  name: product.name,
                                  brand: product.brand,
                                  model: product.model,
                                  price: product.price,  // 직접 숫자 사용
                                  priceAtAdd: product.price,  // 추가
                                  imageUrl: product.imageUrl || '',
                                  inStock: product.inStock,
                                  addedAt: new Date().toISOString(),  // 추가
                                  updatedAt: new Date().toISOString()  // 추가
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
                                sku: product.id,
                                name: product.name,
                                brand: product.brand,
                                model: product.model,
                                price: product.price,  // 직접 숫자 사용
                                priceAtAdd: product.price,  // 추가
                                imageUrl: product.imageUrl || '',
                                inStock: product.inStock,
                                addedAt: new Date().toISOString(),  // 추가
                                updatedAt: new Date().toISOString()  // 추가
                              });
                              navigate('/checkout');
                            }}
                            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                          >
                            구매하기
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
                          구매 가능
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
            수리 서비스가 필요하신가요?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            제품 구매가 아닌 수리 서비스를 원하시면 수리 서비스 페이지를 방문해주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/repair-service')}
              className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              수리 서비스 보기
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