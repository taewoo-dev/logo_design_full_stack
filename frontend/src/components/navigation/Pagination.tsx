import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showFirstLast = true,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const baseButtonStyles =
    'relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 focus:outline-offset-0';
  const activeButtonStyles =
    'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
  const inactiveButtonStyles =
    'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none';
  const disabledButtonStyles = 'text-gray-400 cursor-not-allowed';

  return (
    <nav
      className={twMerge('isolate inline-flex -space-x-px rounded-md shadow-sm', className)}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={twMerge(
            baseButtonStyles,
            'rounded-l-md',
            currentPage === 1 ? disabledButtonStyles : inactiveButtonStyles
          )}
        >
          <span className="sr-only">First page</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={twMerge(
          baseButtonStyles,
          !showFirstLast && 'rounded-l-md',
          currentPage === 1 ? disabledButtonStyles : inactiveButtonStyles
        )}
      >
        <span className="sr-only">Previous</span>
        <svg
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className={twMerge(
                baseButtonStyles,
                'text-gray-700 ring-1 ring-inset ring-gray-300'
              )}
            >
              ...
            </span>
          );
        }
        const isActive = currentPage === pageNumber;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber as number)}
            className={twMerge(
              baseButtonStyles,
              isActive ? activeButtonStyles : inactiveButtonStyles
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={twMerge(
          baseButtonStyles,
          !showFirstLast && 'rounded-r-md',
          currentPage === totalPages ? disabledButtonStyles : inactiveButtonStyles
        )}
      >
        <span className="sr-only">Next</span>
        <svg
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={twMerge(
            baseButtonStyles,
            'rounded-r-md',
            currentPage === totalPages ? disabledButtonStyles : inactiveButtonStyles
          )}
        >
          <span className="sr-only">Last page</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </nav>
  );
}; 