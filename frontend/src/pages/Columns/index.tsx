import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Column, columns } from '../../mocks/columnsData';

const ColumnsPage = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {columns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link to={`/columns/${column.id}`}>
                  <img 
                    src={column.thumbnail} 
                    alt={column.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {column.category}
                      </span>
                      <span className="text-sm text-gray-500">{column.date}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 hover:text-green-800 transition-colors">
                      {column.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{column.summary}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>읽는 시간: {column.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ColumnsPage;
