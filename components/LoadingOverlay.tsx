import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading = true, 
  message = 'Processing your request...' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-2xl p-8 shadow-xl border border-border max-w-sm w-full mx-4 flex flex-col items-center text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-foreground font-medium">{message}</p>
        <p className="mt-2 text-sm text-muted-foreground">Please wait a moment</p>
      </div>
    </div>
  );
};