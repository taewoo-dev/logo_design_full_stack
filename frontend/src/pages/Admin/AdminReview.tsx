import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from '../../components/common';
import { getReviews, deleteReview } from '../../api/review';
import type { Review } from '../../types/review';

const AdminReview: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'created_at' | 'rating' | 'working_days'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isVisible, setIsVisible] = useState<boolean | undefined>(undefined);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReviews({
        sort_by: sortBy,
        sort_order: sortOrder,
        is_visible: isVisible,
      });
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setError('리뷰 데이터 형식이 올바르지 않습니다.');
        setReviews([]);
      }
    } catch (err) {
      setError('리뷰 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, isVisible]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(id);
      setReviews(reviews.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/reviews/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/reviews/new');
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
        <Button onClick={handleCreate}>새 리뷰 작성</Button>
      </div>

      <div className="flex gap-4">
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'created_at' | 'rating' | 'working_days')}
          options={[
            { value: 'created_at', label: '작성일' },
            { value: 'rating', label: '평점' },
            { value: 'working_days', label: '작업일수' },
          ]}
          className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          options={[
            { value: 'desc', label: '내림차순' },
            { value: 'asc', label: '오름차순' },
          ]}
          className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Select
          value={isVisible === undefined ? 'all' : isVisible.toString()}
          onChange={(e) => {
            const value = e.target.value;
            setIsVisible(value === 'all' ? undefined : value === 'true');
          }}
          options={[
            { value: 'all', label: '전체' },
            { value: 'true', label: '공개' },
            { value: 'false', label: '비공개' },
          ]}
          className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이미지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                평점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업 기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {review.images && review.images.length > 0 ? (
                    <img
                      src={review.images[0]}
                      alt={review.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{review.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{review.rating}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{review.order_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{review.order_amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{review.working_days}일</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      review.is_visible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {review.is_visible ? '공개' : '비공개'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(review.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
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
    </div>
  );
};

export default AdminReview; 