"use client";

import type * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarSelectorProps {
  count?: number;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  className?: string;
}

export function StarSelector({
  count = 9,
  value,
  onChange,
  size = 32, // Increased default size for better touch interaction
  className,
}: StarSelectorProps) {
  const stars = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className={cn("flex space-x-1 cursor-pointer", className)} role="radiogroup" aria-label="Número de participaciones">
      {stars.map((starValue) => (
        <button
          type="button"
          key={starValue}
          onClick={() => onChange(starValue)}
          onMouseOver={(e) => e.currentTarget.focus()} // For keyboard accessibility hint
          className={cn(
            "p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
            starValue <= value ? "text-accent" : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
          aria-checked={starValue === value}
          role="radio"
          aria-label={`${starValue} participación${starValue > 1 ? 'es' : ''}`}
        >
          <Star
            size={size}
            className={cn("transition-colors duration-150", starValue <= value && "fill-current")}
          />
        </button>
      ))}
    </div>
  );
}
