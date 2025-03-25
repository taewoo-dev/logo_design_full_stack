import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const Modal = ({ isOpen, onClose, title, children, className = '', maxWidth = 'md' }: ModalProps) => {
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
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed left-0 right-0 top-[3%] w-[90%] mx-auto bg-white rounded-2xl p-8 z-50 max-h-[95vh] overflow-y-auto ${maxWidthClasses[maxWidth]} ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative">
              <button 
                onClick={onClose}
                className="absolute -top-2 -right-2 text-gray-500 hover:text-gray-700"
                aria-label="닫기"
              >
                ✕
              </button>
              <h2 id="modal-title" className="text-2xl font-bold mb-6 text-center">{title}</h2>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal; 