import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portfolio } from '../../types/portfolio';

interface PortfolioLightboxProps {
  portfolio: Portfolio;
  onClose: () => void;
}

const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({ portfolio, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        onClick={onClose}
      >
        <div className="relative max-w-2xl w-full mx-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg overflow-hidden"
          >
            <div className="max-h-[70vh] overflow-hidden">
              <img
                src={portfolio.image_url}
                alt={portfolio.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{portfolio.title}</h3>
              <p className="text-gray-600">{portfolio.description}</p>
            </div>
          </motion.div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PortfolioLightbox; 