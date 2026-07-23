import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4454c3] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer whitespace-nowrap shrink-0 select-none';

  const variants = {
    primary: 'bg-[#4454c3] text-white hover:bg-[#3745a5] active:bg-[#2e3a8c] border border-transparent shadow-2xs font-semibold',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 font-semibold',
    outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:bg-slate-100 shadow-2xs font-medium',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium',
    destructive: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-transparent shadow-2xs font-semibold',
    link: 'bg-transparent text-[#4454c3] hover:underline p-0 h-auto font-medium',
  };

  const sizes = {
    sm: 'h-8 px-3.5 text-xs gap-1.5',
    md: 'h-9 px-4 text-xs gap-2',
    lg: 'h-10 px-5 text-sm gap-2.5',
    icon: 'h-9 w-9 p-0 flex items-center justify-center rounded-lg',
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
