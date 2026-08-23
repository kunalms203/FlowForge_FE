'use client';

import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/src/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full p-3 rounded-md bg-white border text-neutral-900 text-xs shadow-2xs transition-colors placeholder:text-neutral-400 focus:outline-none focus:ring-1 resize-y min-h-[80px]',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-neutral-200 focus:border-black focus:ring-black',
            props.disabled && 'bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-500 leading-none mt-1">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-neutral-500 leading-none mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
