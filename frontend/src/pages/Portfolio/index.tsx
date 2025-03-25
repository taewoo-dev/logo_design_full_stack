import React, { useState, useEffect } from 'react';
import PortfolioGrid from './components/PortfolioGrid';
import Container from '../../components/layout/Container';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PortfolioLightbox from '../../components/media/PortfolioLightbox';
import { getPortfolios } from '../../api/portfolio';
import { Portfolio } from '../../types';

const PortfolioPage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await getPortfolios();
        setPortfolios(response.items);
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handlePortfolioClick = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  const handleCloseLightbox = () => {
    setSelectedPortfolio(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Container>
          <h1 className="text-4xl font-bold text-center my-8">Portfolio</h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <PortfolioGrid portfolios={portfolios} onPortfolioClick={handlePortfolioClick} />
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
