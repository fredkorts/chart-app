import React from 'react';
import { Alert } from 'antd';
import type { ValidationError } from '../../types';

export interface ErrorDisplayProps {
  errors: ValidationError[];
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, className }) => {
  if (errors.length === 0) return null;

  const description = (
    <ul style={{ margin: 0, paddingLeft: 20 }}>
      {errors.map((error, index) => (
        <li key={`${error.field}-${index}`}>{error.message}</li>
      ))}
    </ul>
  );

  return (
    <Alert
      type="error"
      message="Palun parandage järgmised vead:"
      description={description}
      className={className}
      showIcon
    />
  );
};
