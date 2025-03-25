import React from 'react';
import { Portfolio } from '../../../types';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={portfolio.image_url}
          alt={portfolio.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{portfolio.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{portfolio.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{portfolio.category}</span>
          <span className="text-sm text-gray-500">
            {new Date(portfolio.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard; 