import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  type = 'text',
  label,
  error,
  helperText,
  icon,
  id,
  required,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isDateInput = type === 'date';

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none shrink-0 z-10">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4454c3] focus-visible:border-[#4454c3] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-2xs relative',
            icon && 'pl-9',
            isDateInput && 'pr-9 cursor-pointer',
            error && 'border-red-600 focus-visible:ring-red-600',
            className
          )}
          {...props}
        />
        {isDateInput && !icon && (
          <div className="absolute right-3 text-slate-400 pointer-events-none shrink-0 z-10">
            <Calendar className="h-4 w-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-600 font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
