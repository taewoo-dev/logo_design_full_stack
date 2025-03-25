import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={twMerge('bg-white rounded-lg shadow-sm', className)}>
      {children}
    </div>
  );
}; 