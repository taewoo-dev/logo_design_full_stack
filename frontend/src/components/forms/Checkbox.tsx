import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox; 