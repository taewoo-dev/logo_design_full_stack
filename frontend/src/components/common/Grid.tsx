import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 2 | 4 | 6 | 8;
}

const colsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
};

const gapClasses = {
  2: 'gap-2',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8'
};

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 3,
  gap = 4
}) => {
  return (
    <div className={twMerge(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}; 