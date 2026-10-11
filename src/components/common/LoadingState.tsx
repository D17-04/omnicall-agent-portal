import React from 'react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  rows = 4,
}) => {
  return (
    <div className="w-full p-6 space-y-4 animate-pulse" role="status" aria-label={message}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-lg w-full flex items-center px-4 gap-4">
            <div className="h-3 bg-slate-200 rounded w-1/6" />
            <div className="h-3 bg-slate-200 rounded w-2/6" />
            <div className="h-3 bg-slate-200 rounded w-1/6" />
            <div className="h-3 bg-slate-200 rounded w-1/6 ml-auto" />
          </div>
        ))}
      </div>
      <span className="sr-only">{message}</span>
    </div>
  );
};

