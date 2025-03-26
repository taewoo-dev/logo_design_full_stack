import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getColumns } from '../../api/column';
import type { Column } from '../../types/column';
import { ColumnStatus } from '../../types/column';

const ColumnsPage = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchColumns();
    window.scrollTo(0, 0);
  }, []);

  const fetchColumns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getColumns(1, 12, ColumnStatus.PUBLISHED);
      setColumns(response.items);
    } catch (error) {
      console.error('컬럼 목록 조회 실패:', error);
      setError('컬럼 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(columns.map(column => column.category)));

  const filteredColumns = selectedCategory
    ? columns.filter(column => column.category === selectedCategory)
    : columns;

  return (
    <>
      <Header isTransparent={false} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold mb-2">전문 칼럼</h1>
            <p className="text-gray-600 mb-8">로고 디자인과 브랜딩에 대한 인사이트</p>
          </motion.div>

          {/* 카테고리 필터 */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredColumns.map((column) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Link to={`/columns/${column.id}`}>
                    <img 
                      src={column.thumbnail_url || '/placeholder-image.jpg'} 
                      alt={column.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                          {column.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(column.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-2 hover:text-green-800 transition-colors">
                        {column.title}
                      </h2>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ColumnsPage;
