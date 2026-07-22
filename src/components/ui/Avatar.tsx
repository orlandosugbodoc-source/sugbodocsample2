import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (nameStr: string) => {
    if (!nameStr) return '?';
    // Remove titles like Dr., MD, RN, RMT
    const cleanName = nameStr.replace(/^(Dr\.|Nurse)\s+/i, '').replace(/,\s*(MD|RN|RMT|PA|PhD)$/i, '');
    const parts = cleanName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-10 w-10 text-xs font-semibold',
    xl: 'h-14 w-14 text-base font-bold',
  };

  const initials = getInitials(name);

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        className={cn(
          'rounded-full object-cover border border-slate-200 shrink-0 select-none',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 select-none uppercase tracking-tight',
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
};
