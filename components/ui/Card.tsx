import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        w-full
        p-4 sm:p-6
        bg-white
        rounded-lg
        shadow-sm hover:shadow-md
        transition-shadow duration-200
        border border-gray-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
