import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Textarea } from '../../components/common';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '../../api/portfolio';
import { Portfolio, PortfolioCategory, PortfolioVisibility, PaginatedResponse, Option } from '../../types';
import { getFullImageUrl } from '../../utils/image';

const categoryOptions: Option[] = [
  { value: PortfolioCategory.LOGO, label: '로고 디자인' },
  { value: PortfolioCategory.BRANDING, label: '브랜딩' },
  { value: PortfolioCategory.PACKAGING, label: '패키지 디자인' },
  { value: PortfolioCategory.WEB, label: '웹 디자인' },
  { value: PortfolioCategory.APP, label: '앱 디자인' },
  { value: PortfolioCategory.OTHER, label: '기타' }
];

const visibilityOptions: Option[] = [
  { value: PortfolioVisibility.PUBLIC, label: '공개' },
  { value: PortfolioVisibility.PRIVATE, label: '비공개' }
];

const AdminPortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [formData, setFormData] = useState<Partial<Portfolio>>({
    title: '',
    description: '',
    image_url: '',
    category: PortfolioCategory.LOGO,
    visibility: PortfolioVisibility.PUBLIC
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await getPortfolios();
      if (response && Array.isArray(response.items)) {
        setPortfolios(response.items);
      } else {
        console.error('Invalid response format:', response);
        setPortfolios([]);
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPortfolio) {
        await updatePortfolio({
          id: editingPortfolio.id,
          title: formData.title || '',
          description: formData.description || '',
          category: formData.category || PortfolioCategory.LOGO,
          visibility: (formData.visibility || 'public').toUpperCase() as PortfolioVisibility
        });
      } else {
        if (!imageFile) {
          alert('이미지를 선택해주세요.');
          return;
        }
        await createPortfolio({
          title: formData.title || '',
          description: formData.description || '',
          category: formData.category || PortfolioCategory.LOGO,
          visibility: (formData.visibility || 'public').toUpperCase() as PortfolioVisibility
        }, imageFile);
      }
      setIsModalOpen(false);
      fetchPortfolios();
      resetForm();
    } catch (error) {
      console.error('Failed to save portfolio:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setDeletingId(id);
    try {
      await deletePortfolio(id);
      fetchPortfolios();
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: PortfolioCategory.LOGO,
      visibility: PortfolioVisibility.PUBLIC
    });
    setImageFile(null);
    setEditingPortfolio(null);
    setError(null);
  };

  const handleEdit = (portfolio: Portfolio) => {
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      image_url: getFullImageUrl(portfolio.image_url),
      category: portfolio.category,
      visibility: portfolio.visibility
    });
    setEditingPortfolio(portfolio);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image_url: previewUrl }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">포트폴리오 관리</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          새 포트폴리오 
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">등록된 포트폴리오가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={getFullImageUrl(portfolio.image_url)}
                alt={portfolio.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{portfolio.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {portfolio.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {categoryOptions.find(opt => opt.value === portfolio.category)?.label}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(portfolio)}
                      variant="secondary"
                      size="sm"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => handleDelete(portfolio.id)}
                      variant="danger"
                      size="sm"
                      disabled={deletingId === portfolio.id}
                    >
                      {deletingId === portfolio.id ? '삭제 중...' : '삭제'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPortfolio ? '포트폴리오 수정' : '새 포트폴리오'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제목
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="포트폴리오 제목을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="포트폴리오에 대한 설명을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as PortfolioCategory,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      가시성
                    </label>
                    <select
                      value={formData.visibility}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visibility: e.target.value as PortfolioVisibility,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {visibilityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이미지
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        id="portfolio-image"
                      />
                      <label
                        htmlFor="portfolio-image"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mb-1 text-sm text-gray-500">
                            <span className="font-semibold">이미지를 선택하거나 드래그하세요</span>
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                        </div>
                      </label>
                      {formData.image_url && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {error && (
                      <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  {formData.image_url && (
                    <div className="mt-4">
                      <img
                        src={formData.image_url}
                        alt="포트폴리오 미리보기"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  variant="secondary"
                >
                  취소
                </Button>
                <Button type="submit" variant="primary">
                  {editingPortfolio ? '수정' : '생성'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolioPage; 
