import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ValidationError } from '../../types';

export interface ErrorDisplayProps {
  errors: ValidationError[];
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  errors, 
  className = '',
}) => {
  if (errors.length === 0) return null;

  const message = 'Palun parandage järgmised vead:';

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-3 ${className}`}>
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {message}
          </h3>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={`${error.field}-${index}`}>{error.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};