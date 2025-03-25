import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '../../components/common';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ReviewData {
  id: string;
  clientName: string;
  companyName: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
  isPublished: boolean;
}

const ReviewEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<ReviewData>>({
    clientName: '',
    companyName: '',
    rating: 5,
    content: '',
    images: [],
    createdAt: new Date().toISOString().split('T')[0],
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: API 연동
      console.log('저장할 데이터:', formData);
      navigate('/admin/reviews');
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/reviews');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
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
                  label="고객명"
                  value={formData.clientName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                  placeholder="고객님의 이름을 입력하세요"
                />

                <Input
                  label="회사명"
                  value={formData.companyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  placeholder="회사명을 입력하세요"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평점
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`text-2xl ${
                          star <= (formData.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="작성일"
                  type="date"
                  value={formData.createdAt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, createdAt: e.target.value })}
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                    즉시 발행
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 업로드
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                      이미지 선택
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">권장 크기: 800x600px</p>
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`리뷰 이미지 ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                리뷰 내용
              </label>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  className="h-96"
                  placeholder="리뷰 내용을 입력하세요..."
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewEditor; 