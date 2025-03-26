import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getColumn } from '../../api/column';
import type { Column } from '../../types/column';

const ColumnDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [column, setColumn] = useState<Column | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchColumn();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchColumn = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id) return;
      const data = await getColumn(id);
      setColumn(data);
    } catch (error) {
      console.error('컬럼 조회 실패:', error);
      setError('컬럼을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header isTransparent={false} />
        <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !column) {
    return (
      <>
        <Header isTransparent={false} />
        <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
          <div className="text-red-600">{error || '컬럼을 찾을 수 없습니다.'}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header isTransparent={false} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6 py-12">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-8">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {column.category}
              </span>
              <h1 className="text-4xl font-bold mt-4 mb-4">{column.title}</h1>
              <div className="text-gray-600">
                <span>{new Date(column.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {column.thumbnail_url && (
              <img 
                src={column.thumbnail_url} 
                alt={column.title} 
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
            )}

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: column.content }}
            />

            {/* 이전글/다음글 네비게이션 */}
            <div className="mt-16 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-4">
                {/* 이전글 */}
                {column.prev_column && (
                  <Link 
                    to={`/columns/${column.prev_column.id}`}
                    className="group flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-1">이전글</p>
                      <p className="text-base font-medium text-gray-900 truncate">{column.prev_column.title}</p>
                    </div>
                  </Link>
                )}
                {!column.prev_column && <div />}

                {/* 다음글 */}
                {column.next_column && (
                  <Link 
                    to={`/columns/${column.next_column.id}`}
                    className="group flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-sm text-gray-500 mb-1">다음글</p>
                      <p className="text-base font-medium text-gray-900 truncate">{column.next_column.title}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )}
                {!column.next_column && <div />}
              </div>
            </div>

            {/* 목록으로 돌아가기 버튼 */}
            <div className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-800 text-white px-12 py-5 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('/columns')}
              >
                목록으로 돌아가기
              </motion.button>
            </div>
          </motion.article>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ColumnDetailPage;
