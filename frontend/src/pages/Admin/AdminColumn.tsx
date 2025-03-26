import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common';
import { getColumns, deleteColumn } from '../../api/column';
import type { Column } from '../../types/column';

const AdminColumn = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    fetchColumns();
  }, []);

  const fetchColumns = async () => {
    try {
      const response = await getColumns();
      setColumns(response.items);
    } catch (error) {
      console.error('컬럼 목록 조회 실패:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteColumn(id);
        await fetchColumns();
      } catch (error) {
        console.error('컬럼 삭제 실패:', error);
      }
    }
  };

  const handleEdit = (id: string) => {
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
                썸네일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                조회수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
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
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.status}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.view_count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
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
    </div>
  );
};

export default AdminColumn; 