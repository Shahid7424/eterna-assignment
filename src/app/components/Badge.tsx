import React, { memo } from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

export const Badge = memo(({ children, variant = 'default' }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300',
    success: 'bg-green-900/30 text-green-400',
    danger: 'bg-red-900/30 text-red-400',
    warning: 'bg-yellow-900/30 text-yellow-400',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';