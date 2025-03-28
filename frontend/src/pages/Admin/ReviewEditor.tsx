import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '../../components/common';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getReview, createReview, updateReview } from '../../api/review';
import type { Review, ReviewCreateRequest, ReviewUpdateRequest } from '../../types/review';

interface ReviewFormData {
  name: string;
  rating: number;
  content: string;
  order_type: string;
  order_amount: string;
  working_days: number;
  is_visible: boolean;
  images: (File | string)[];
}

const ReviewEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<ReviewFormData>>({
    name: '',
    rating: 5,
    content: '',
    order_type: '',
    order_amount: '',
    working_days: 0,
    is_visible: true,
    images: [],
  });

  useEffect(() => {
    if (isEditMode) {
      fetchReview();
    }
  }, [id]);

  const fetchReview = async () => {
    try {
      if (!id) return;
      const review = await getReview(id);
      setFormData({
        name: review.name,
        rating: review.rating,
        content: review.content,
        order_type: review.order_type,
        order_amount: review.order_amount,
        working_days: review.working_days,
        images: review.images,
        is_visible: review.is_visible,
      });
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
      alert('리뷰 정보를 불러오는데 실패했습니다.');
      navigate('/admin/reviews');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      // 텍스트 데이터 추가
      submitData.append('name', formData.name || '');
      submitData.append('rating', (formData.rating || 5).toString());
      submitData.append('content', formData.content || '');
      submitData.append('order_type', formData.order_type || '');
      submitData.append('order_amount', formData.order_amount || '');
      submitData.append('working_days', (formData.working_days || 0).toString());
      submitData.append('is_visible', formData.is_visible ? 'true' : 'false');

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

  // 컴포넌트가 언마운트될 때 URL 객체 정리
  useEffect(() => {
    return () => {
      formData.images?.forEach(image => {
        if (image instanceof File) {
          URL.revokeObjectURL(getImageUrl(image));
        }
      });
    };
  }, []);

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
                >
                  {isEditMode ? '수정' : '저장'}
                </Button>
              </div>
            </div>
          </div>

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
                  <ReactQuill
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    className="h-64 mb-12"
                  />
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