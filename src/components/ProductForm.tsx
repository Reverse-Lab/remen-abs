import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Car, Calendar, FileText, Package, Star } from 'lucide-react';
import { productService, fileService, Product } from '../services/firebaseService';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingProduct?: Product | null;
}

interface ProductFormData {
  name: string;
  brand: string;
  model: string;
  year: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls: string[];
  inStock: boolean;
  rating: number;
  inspectionResults: {
    brakeTest: string;
    absTest: string;
    pressureTest: string;
    electricalTest: string;
  };
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSuccess, editingProduct }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    model: '',
    year: '',
    price: 0,
    description: '',
    features: [],
    imageUrl: '',
    imageUrls: [],
    inStock: true,
    rating: 5,
    inspectionResults: {
      brakeTest: '',
      absTest: '',
      pressureTest: '',
      electricalTest: ''
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  // 편집 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        model: editingProduct.model || '',
        year: editingProduct.year || '',
        price: editingProduct.price || 0,
        description: editingProduct.description || '',
        features: editingProduct.features || [],
        imageUrl: editingProduct.imageUrl || '',
        imageUrls: editingProduct.imageUrls || [],
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        rating: editingProduct.rating || 5,
        inspectionResults: {
          brakeTest: editingProduct.inspectionResults?.brakeTest || '',
          absTest: editingProduct.inspectionResults?.absTest || '',
          pressureTest: editingProduct.inspectionResults?.pressureTest || '',
          electricalTest: editingProduct.inspectionResults?.electricalTest || ''
        }
      });
    } else {
      // 새 제품 등록 모드일 때 폼 초기화
      setFormData({
        name: '',
        brand: '',
        model: '',
        year: '',
        price: 0,
        description: '',
        features: [],
        imageUrl: '',
        imageUrls: [],
        inStock: true,
        rating: 5,
        inspectionResults: {
          brakeTest: '',
          absTest: '',
          pressureTest: '',
          electricalTest: ''
        }
      });
    }
    setImageFile(null);
    setImageFiles([]);
    setError('');
    setFeatureInput('');
  }, [editingProduct, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInspectionChange = (field: keyof ProductFormData['inspectionResults'], value: string) => {
    setFormData(prev => ({
      ...prev,
      inspectionResults: {
        ...prev.inspectionResults,
        [field]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleMultipleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;
      let oldImageUrl = '';
      let uploadedImageUrls: string[] = [];

      // 편집 모드에서 기존 이미지 URL 저장
      if (editingProduct && editingProduct.imageUrl) {
        oldImageUrl = editingProduct.imageUrl;
      }

      // 새 메인 이미지가 업로드된 경우
      if (imageFile) {
        const fileName = `products/${Date.now()}_${imageFile.name}`;
        finalImageUrl = await fileService.uploadImage(imageFile, fileName);
      }

      // 여러 이미지 업로드
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file, index) => {
          const fileName = `products/${Date.now()}_${index}_${file.name}`;
          return await fileService.uploadImage(file, fileName);
        });
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const productData = {
        ...formData,
        imageUrl: finalImageUrl,
        imageUrls: [...formData.imageUrls, ...uploadedImageUrls]
      };

      if (editingProduct) {
        // 편집 모드: 기존 제품 업데이트
        await productService.updateProduct(editingProduct.id!, productData);
        
        // 새 메인 이미지가 업로드되었고 기존 이미지가 있는 경우 기존 이미지 삭제
        if (imageFile && oldImageUrl) {
          try {
            // Storage에서 기존 이미지 삭제
            await fileService.deleteFileFromUrl(oldImageUrl);
          } catch (deleteError) {
            console.warn('기존 이미지 삭제 중 오류:', deleteError);
            // 삭제 실패해도 제품 업데이트는 계속 진행
          }
        }
      } else {
        // 새 제품 등록 모드
        await productService.addProduct(productData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('제품 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? '제품 수정' : '제품 등록'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품명 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  브랜드 *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델 *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연식
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="예: 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가격 *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  평점
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>
                      {rating}점
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제품 설명 *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제품 특징
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="특징을 입력하세요"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메인 제품 이미지
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                추가 제품 이미지 (여러 개 선택 가능)
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {/* 기존 이미지들 표시 */}
                {formData.imageUrls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">기존 이미지들:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 새로 선택된 이미지들 표시 */}
                {imageFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">새로 선택된 이미지들:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">재고 있음</span>
              </label>
            </div>

            {/* Inspection Results */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">검사 결과</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제동 검사
                  </label>
                  <textarea
                    value={formData.inspectionResults.brakeTest}
                    onChange={(e) => handleInspectionChange('brakeTest', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ABS 검사
                  </label>
                  <textarea
                    value={formData.inspectionResults.absTest}
                    onChange={(e) => handleInspectionChange('absTest', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    압력 검사
                  </label>
                  <textarea
                    value={formData.inspectionResults.pressureTest}
                    onChange={(e) => handleInspectionChange('pressureTest', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전기 검사
                  </label>
                  <textarea
                    value={formData.inspectionResults.electricalTest}
                    onChange={(e) => handleInspectionChange('electricalTest', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? '저장 중...' : (editingProduct ? '수정' : '등록')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm; 