import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  padding = 'md',
  hover = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-md border border-gray-100',
        paddingClasses[padding],
        hover && 'transition-shadow duration-200 hover:shadow-lg cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
