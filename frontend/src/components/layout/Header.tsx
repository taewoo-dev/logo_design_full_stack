import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '../navigation/Navigation';
import LoginModal from '../auth/LoginModal';
import ConsultationModal from '../consultation/ConsultationModal';
import Button from '../ui/button';

const Header = ({ isTransparent = true }: { isTransparent?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: '홈', path: '' },
    { name: '포트폴리오', path: 'portfolio' },
    { name: '전문 칼럼', path: 'columns' },
    { name: '고객 후기', path: 'reviews' }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled || !isTransparent ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/images/title_logo.jpg" 
              alt="인트로고" 
              className="h-12 w-auto"
            />
          </Link>

          {/* 데스크톱 메뉴와 버튼들 */}
          <div className="hidden md:flex items-center space-x-20">
            <Navigation
              items={menuItems}
              isScrolled={scrolled}
              isTransparent={isTransparent}
            />
            
            {/* 무료 상담 버튼 */}
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => setIsLoginModalOpen(true)}
              >
                로그인
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsConsultationModalOpen(true)}
              >
                상담 신청
              </Button>
            </div>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button 
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg 
              className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">메뉴</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="space-y-4">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={`/${item.path}`}
                        className="block py-2 text-gray-800 hover:text-blue-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <ConsultationModal 
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </>
  );
};

export default Header; 