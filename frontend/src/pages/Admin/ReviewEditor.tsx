import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '../../components/common';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getReview, createReview, updateReview } from '../../api/review';

interface ReviewFormData {
  name: string;
  rating: number;
  content: string;
  order_type: string;
  order_amount: string;
  working_days: number;
  is_visible: boolean;
  images: (File | string)[];
  use_rich_text: boolean;
}

const ReviewEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    rating: 5,
    content: '',
    order_type: '',
    order_amount: '',
    working_days: 0,
    is_visible: true,
    images: [],
    use_rich_text: false
  });

  const fetchReview = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const review = await getReview(id);
      setFormData({
        name: review.name,
        rating: review.rating,
        content: review.content,
        order_type: review.order_type,
        order_amount: review.order_amount,
        working_days: review.working_days,
        is_visible: review.is_visible,
        images: review.images,
        use_rich_text: false
      });
    } catch (err) {
      console.error('Error fetching review:', err);
      setError('리뷰 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchReview();
    }
  }, [isEditMode, fetchReview]);

  useEffect(() => {
    // 이미지 미리보기 URL 생성
    const imageUrls = formData.images.map(image => {
      if (typeof image === 'string') return image;
      return URL.createObjectURL(image);
    });

    // 컴포넌트 언마운트 시 URL 정리
    return () => {
      imageUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formData.images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      // 텍스트 데이터 추가 (빈 값이 아닌 경우에만)
      if (formData.name) submitData.append('name', formData.name);
      if (formData.rating) submitData.append('rating', formData.rating.toString());
      if (formData.content) submitData.append('content', formData.content);
      if (formData.order_type) submitData.append('order_type', formData.order_type);
      if (formData.order_amount) submitData.append('order_amount', formData.order_amount);
      if (formData.working_days) submitData.append('working_days', formData.working_days.toString());
      if (formData.is_visible !== undefined) submitData.append('is_visible', formData.is_visible.toString());

      // 이미지 파일 추가
      if (formData.images) {
        formData.images.forEach((image: File | string) => {
          if (typeof image === 'string' && image.startsWith('data:')) {
            // 이미 base64로 변환된 이미지인 경우
            submitData.append('images', image);
          } else if (image instanceof File) {
            // File 객체인 경우
            submitData.append('images', image);
          }
        });
      }

      if (isEditMode && id) {
        await updateReview(id, submitData);
      } else {
        await createReview(submitData);
      }
      navigate('/admin/reviews');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/reviews');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => {
      // File 객체를 그대로 저장
      return file;
    });

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const getImageUrl = (image: File | string): string => {
    if (typeof image === 'string') {
      return image;
    }
    return URL.createObjectURL(image);
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? '리뷰 수정' : '새 리뷰 작성'}
              </h1>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? '저장 중...' : (isEditMode ? '수정' : '저장')}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="이름"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Select
                  label="평점"
                  value={formData.rating?.toString()}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  options={[
                    { value: '5', label: '5점' },
                    { value: '4', label: '4점' },
                    { value: '3', label: '3점' },
                    { value: '2', label: '2점' },
                    { value: '1', label: '1점' },
                  ]}
                  required
                />
                <Input
                  label="주문 유형"
                  value={formData.order_type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, order_type: e.target.value })}
                  required
                />
                <Input
                  label="주문 금액"
                  value={formData.order_amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, order_amount: e.target.value })}
                  required
                />
                <Input
                  label="작업일수"
                  type="number"
                  value={formData.working_days}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, working_days: parseInt(e.target.value) })}
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_visible" className="ml-2 block text-sm text-gray-900">
                    공개
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">내용</label>
                  <div className="mt-2 mb-4">
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={!formData.use_rich_text}
                          onChange={() => setFormData({ ...formData, use_rich_text: false })}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">일반 텍스트</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={formData.use_rich_text}
                          onChange={() => setFormData({ ...formData, use_rich_text: true })}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">리치 텍스트</span>
                      </label>
                    </div>
                  </div>
                  {formData.use_rich_text ? (
                    <ReactQuill
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      className="h-64 mb-12"
                    />
                  ) : (
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="리뷰 내용을 입력하세요..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">이미지</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {formData.images?.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={getImageUrl(image)}
                          alt={`리뷰 이미지 ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewEditor; 