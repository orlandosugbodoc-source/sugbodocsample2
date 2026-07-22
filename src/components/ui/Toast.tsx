import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    info: <Info className="h-4 w-4 text-sky-400 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-3 rounded-full bg-slate-900 text-white border border-slate-800 shadow-2xl text-xs font-medium max-w-md animate-in slide-in-from-bottom-3 fade-in duration-200 select-none">
      {icons[type]}
      <span className="font-semibold text-xs text-white leading-snug">{message}</span>
    </div>
  );
};
