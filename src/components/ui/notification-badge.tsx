import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  children: React.ReactNode;
  showBadge?: boolean;
  badgeContent?: string | number;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  children,
  showBadge = false,
  badgeContent,
  className
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {showBadge && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse">
          <div className="absolute inset-0 h-3 w-3 bg-red-500 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
};