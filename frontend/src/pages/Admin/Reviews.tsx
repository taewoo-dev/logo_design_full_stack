import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea, Select } from '../../components/common';
import Modal from '../../components/common/Modal';

interface ReviewItem {
  id: number;
  clientName: string;
  companyName: string;
  rating: number;
  content: string;
  imageUrl: string;
  createdAt: string;
  isVisible: boolean;
}

const AdminReviews: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
  const [formData, setFormData] = useState<Omit<ReviewItem, 'id'>>({
    clientName: '',
    companyName: '',
    rating: 5,
    content: '',
    imageUrl: '',
    createdAt: new Date().toISOString().split('T')[0],
    isVisible: true,
  });

  useEffect(() => {
    // TODO: API 연동
    const mockData: ReviewItem[] = [
      {
        id: 1,
        clientName: "홍길동",
        companyName: "테크스타트",
        rating: 5,
        content: "정말 만족스러운 로고 디자인이었습니다. 브랜드 아이덴티티를 잘 살려주셨네요.",
        imageUrl: "/images/reviews/review1.jpg",
        createdAt: "2024-03-16",
        isVisible: true,
      },
      {
        id: 2,
        clientName: "김철수",
        companyName: "커피하우스",
        rating: 4,
        content: "친절한 상담과 빠른 작업 진행이 인상적이었습니다.",
        imageUrl: "/images/reviews/review2.jpg",
        createdAt: "2024-03-15",
        isVisible: true,
      },
    ];
    setReviews(mockData);
  }, []);

  const handleOpenModal = (item?: ReviewItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        clientName: item.clientName,
        companyName: item.companyName,
        rating: item.rating,
        content: item.content,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt,
        isVisible: item.isVisible,
      });
    } else {
      setEditingItem(null);
      setFormData({
        clientName: '',
        companyName: '',
        rating: 5,
        content: '',
        imageUrl: '',
        createdAt: new Date().toISOString().split('T')[0],
        isVisible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    if (editingItem) {
      setReviews(reviews.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      ));
    } else {
      setReviews([
        ...reviews,
        {
          id: Math.max(...reviews.map(item => item.id)) + 1,
          ...formData,
        },
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      // TODO: API 연동
      setReviews(reviews.filter(item => item.id !== id));
    }
  };

  const handleToggleVisibility = async (id: number) => {
    // TODO: API 연동
    setReviews(reviews.map(item =>
      item.id === id
        ? { ...item, isVisible: !item.isVisible }
        : item
    ));
  };

  const handleCreate = () => {
    navigate('/admin/reviews/new');
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/reviews/${id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
        <Button
          variant="primary"
          onClick={handleCreate}
        >
          새 리뷰 추가
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회사명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                평점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                내용
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.clientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.companyName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.rating}점</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">{item.content}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.createdAt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.isVisible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isVisible ? '공개' : '비공개'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleVisibility(item.id)}
                    className={`mr-4 ${
                      item.isVisible
                        ? 'text-yellow-600 hover:text-yellow-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {item.isVisible ? '비공개' : '공개'}
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? '리뷰 수정' : '새 리뷰 추가'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="고객명"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
          />
          <Input
            label="회사명"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
          <Select
            label="평점"
            value={formData.rating.toString()}
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
            label="이미지 URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
          />
          <Input
            label="작성일"
            type="date"
            value={formData.createdAt}
            onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
            required
          />
          <Textarea
            label="내용"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-900">
              공개
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingItem ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminReviews; 