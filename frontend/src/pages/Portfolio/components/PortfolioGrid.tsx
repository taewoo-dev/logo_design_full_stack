import React from 'react';
import { Portfolio } from '../../../types';
import { Link } from 'react-router-dom';

interface PortfolioGridProps {
  portfolios: Portfolio[];
  onPortfolioClick: (portfolio: Portfolio) => void;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ portfolios, onPortfolioClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {portfolios.map((portfolio) => (
        <div
          key={portfolio.id}
          onClick={() => onPortfolioClick(portfolio)}
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 cursor-pointer"
        >
          <img
            src={portfolio.image_url}
            alt={portfolio.title}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-4 w-full">
              <h3 className="text-lg font-semibold text-white">{portfolio.title}</h3>
              <p className="text-sm text-gray-300">{portfolio.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid; 