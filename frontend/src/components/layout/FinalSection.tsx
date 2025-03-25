import React from 'react';
import { motion } from 'framer-motion';

const FinalSection = () => {
  return (
    <section className="py-20 bg-green-800 text-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-left max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-bold mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8">
            브랜드의 새로운 시작을 함께 만들어가겠습니다
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-white text-green-800 text-lg font-medium rounded-full shadow-xl"
            onClick={() => alert('무료 상담 신청하기')}
          >
            무료 상담 신청하기
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalSection;