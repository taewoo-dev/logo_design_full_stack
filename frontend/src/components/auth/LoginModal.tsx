import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed left-0 right-0 top-[40%] -translate-y-1/2 w-[90%] max-w-md mx-auto bg-white rounded-2xl p-8 z-50"
          >
            <div className="relative">
              <button 
                onClick={onClose}
                className="absolute -top-2 -right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
              <button
                className="w-full py-4 bg-[#FEE500] text-black/80 rounded-xl mb-4 flex items-center justify-center font-medium hover:bg-[#FEE500]/90 transition-colors"
              >
                <img src="/kakao-logo.png" alt="Kakao" className="w-5 h-5 mr-2" />
                카카오로 시작하기
              </button>
              <p className="text-sm text-gray-500 text-center">
                로그인하여 맞춤형 로고 디자인을 시작하세요
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal; 