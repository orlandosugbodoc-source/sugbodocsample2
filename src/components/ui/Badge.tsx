import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-md whitespace-nowrap shrink-0 transition-colors select-none';

  const variants = {
    neutral: 'bg-white text-slate-700 border border-slate-200',
    primary: 'bg-white text-[#4454c3] border border-[#c7d2fe] font-semibold',
    success: 'bg-white text-emerald-700 border border-emerald-300 font-semibold',
    warning: 'bg-white text-amber-700 border border-amber-300 font-semibold',
    danger: 'bg-white text-rose-700 border border-rose-300 font-semibold',
    info: 'bg-white text-sky-700 border border-sky-300 font-semibold',
    outline: 'bg-white text-slate-700 border border-slate-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
