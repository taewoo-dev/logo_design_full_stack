import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: Option[];
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-base',
  lg: 'py-3 text-lg',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      helperText,
      className,
      size = 'md',
      disabled,
      ...props
    },
    ref
  ) => {
    const selectStyles = twMerge(
      'block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white',
      error
        ? 'text-red-900 ring-red-300 focus:ring-red-500'
        : 'text-gray-900 ring-gray-300 focus:ring-blue-500',
      disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
      sizeStyles[size],
      className
    );

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select ref={ref} className={selectStyles} disabled={disabled} {...props}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {(error || helperText) && (
          <p
            className={twMerge(
              'mt-2 text-sm',
              error ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
); 