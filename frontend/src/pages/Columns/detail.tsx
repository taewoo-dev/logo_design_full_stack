import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Column, columns } from '../../mocks/columnsData';

const ColumnDetailPage = () => {
  const { id } = useParams();
  const currentId = Number(id);
  
  // 실제 데이터 대신 목데이터에서 현재 글 찾기
  const column = columns.find((col: Column) => col.id === currentId) || {
    id: 1,
    title: "로고 디자인의 중요성: 브랜드 아이덴티티 구축하기",
    content: `
      <h2>브랜드 아이덴티티의 핵심, 로고 디자인</h2>
      <p>로고는 브랜드의 첫인상을 결정짓는 중요한 요소입니다. 효과적인 로고 디자인은 기업의 가치와 비전을 시각적으로 전달하며, 고객과의 신뢰 관계를 구축하는 데 핵심적인 역할을 합니다.</p>
      
      <h3>좋은 로고의 조건</h3>
      <ul>
        <li>심플하고 기억하기 쉬울 것</li>
        <li>다양한 크기와 매체에서 활용 가능할 것</li>
        <li>브랜드의 핵심 가치를 반영할 것</li>
      </ul>
    `,
    author: "김디자인",
    date: "2024.03.15",
    category: "브랜딩",
    readTime: "5분",
    thumbnail: "/images/columns/column1.jpg"
  };

  // 이전글과 다음글 찾기
  const prevColumn = columns.find((col: Column) => col.id === currentId - 1);
  const nextColumn = columns.find((col: Column) => col.id === currentId + 1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>{column.author}</span>
                  <span>{column.date}</span>
                </div>
                <span>읽는 시간: {column.readTime}</span>
              </div>
            </div>

            <img 
              src={column.thumbnail} 
              alt={column.title} 
              className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: column.content }}
            />

            {/* 이전/다음 글 네비게이션 추가 */}
            <div className="mt-16 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-4">
                {prevColumn ? (
                  <Link 
                    to={`/columns/${prevColumn.id}`}
                    className="group p-4 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-500 mb-2 block">이전 글</span>
                    <p className="font-medium group-hover:text-green-800 line-clamp-1">
                      {prevColumn.title}
                    </p>
                  </Link>
                ) : (
                  <div className="p-4">
                    <span className="text-sm text-gray-400">이전 글이 없습니다</span>
                  </div>
                )}

                {nextColumn ? (
                  <Link 
                    to={`/columns/${nextColumn.id}`}
                    className="group p-4 hover:bg-gray-100 rounded-lg transition-colors text-right"
                  >
                    <span className="text-sm text-gray-500 mb-2 block">다음 글</span>
                    <p className="font-medium group-hover:text-green-800 line-clamp-1">
                      {nextColumn.title}
                    </p>
                  </Link>
                ) : (
                  <div className="p-4 text-right">
                    <span className="text-sm text-gray-400">다음 글이 없습니다</span>
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ColumnDetailPage;
