import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Container from '../../components/layout/Container';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PortfolioLightbox from '../../components/media/PortfolioLightbox';
import { getPortfolios } from '../../api/portfolio';
import { Portfolio } from '../../types';

const ITEMS_PER_PAGE = 9;

const PortfolioPage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPortfolioRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchPortfolios = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await getPortfolios(pageNum, ITEMS_PER_PAGE);
      if (pageNum === 1) {
        setPortfolios(response.items);
      } else {
        setPortfolios(prev => [...prev, ...response.items]);
      }
      setHasMore(response.items.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios(page);
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePortfolioClick = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  const handleCloseLightbox = () => {
    setSelectedPortfolio(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isTransparent={false} />
      <main className="flex-grow pt-24 pb-16">
        <Container className="px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left mb-12"
          >
            <h1 className="text-6xl font-bold mb-4">포트폴리오</h1>
            <p className="text-2xl text-gray-600">우리의 최근 작업물을 소개합니다</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((portfolio, index) => (
              <motion.div
                key={portfolio.id}
                ref={index === portfolios.length - 1 ? lastPortfolioRef : null}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => handlePortfolioClick(portfolio)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={portfolio.image_url}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{portfolio.title}</h3>
                    <p className="text-gray-600 mb-4">{portfolio.description}</p>
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {portfolio.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
      {selectedPortfolio && (
        <PortfolioLightbox
          portfolio={selectedPortfolio}
          onClose={handleCloseLightbox}
        />
      )}
    </div>
  );
};

export default PortfolioPage;
