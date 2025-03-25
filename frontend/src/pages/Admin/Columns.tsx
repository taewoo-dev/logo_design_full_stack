import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea, Select } from '../../components/common';
import Modal from '../../components/common/Modal';

interface ColumnItem {
  id: number;
  title: string;
  category: string;
  content: string;
  author: string;
  publishedAt: string;
  thumbnailUrl: string;
}

const AdminColumns = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<ColumnItem[]>([
    {
      id: 1,
      title: "로고 디자인의 기본 원칙",
      category: "디자인 가이드",
      content: "로고 디자인을 시작하기 전에 알아야 할 기본적인 원칙들...",
      author: "김태은",
      publishedAt: "2024-03-16",
      thumbnailUrl: "/images/columns/logo-principles.jpg",
    },
    {
      id: 2,
      title: "브랜드 아이덴티티 구축하기",
      category: "브랜딩",
      content: "효과적인 브랜드 아이덴티티를 구축하는 방법...",
      author: "김태은",
      publishedAt: "2024-03-15",
      thumbnailUrl: "/images/columns/brand-identity.jpg",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ColumnItem | null>(null);
  const [formData, setFormData] = useState<Omit<ColumnItem, 'id'>>({
    title: '',
    category: '',
    content: '',
    author: '',
    publishedAt: new Date().toISOString().split('T')[0],
    thumbnailUrl: '',
  });

  const categories = [
    '디자인 가이드',
    '브랜딩',
    '마케팅',
    '트렌드',
    '기타',
  ];

  const handleOpenModal = (item?: ColumnItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        content: item.content,
        author: item.author,
        publishedAt: item.publishedAt,
        thumbnailUrl: item.thumbnailUrl,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: '',
        content: '',
        author: '',
        publishedAt: new Date().toISOString().split('T')[0],
        thumbnailUrl: '',
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
      setColumns(columns.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      ));
    } else {
      setColumns([
        ...columns,
        {
          id: Math.max(...columns.map(item => item.id)) + 1,
          ...formData,
        },
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      // TODO: API 연동
      setColumns(columns.filter(item => item.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/columns/${id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">칼럼 관리</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/admin/columns/new')}
        >
          새 칼럼 작성
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                발행일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {columns.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.publishedAt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
        title={editingItem ? '칼럼 수정' : '새 칼럼 작성'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Select
            label="카테고리"
            value={formData.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
            options={categories.map(category => ({ value: category, label: category }))}
            required
          />
          <Input
            label="작성자"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
          <Input
            label="발행일"
            type="date"
            value={formData.publishedAt}
            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
            required
          />
          <Input
            label="썸네일 URL"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            required
          />
          <Textarea
            label="내용"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
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
              {editingItem ? '수정' : '작성'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminColumns; 