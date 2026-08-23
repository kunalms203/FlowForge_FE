'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ title = 'Error', message, onDismiss, className }: ErrorAlertProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 flex items-start gap-2.5 text-xs',
        className
      )}
    >
      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-semibold text-red-950 mb-0.5">{title}</h4>}
        <p className="text-red-700 leading-normal">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-700 p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
