import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface TileProps {
  isFlipped: boolean;
  number?: number;
  className?: string;
  highlighted: boolean;
  animationDelay: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({ isFlipped, number, className = '', highlighted, animationDelay, onMouseEnter, onMouseLeave, onClick }) => {
  return (
    <motion.button
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn(
        'flex w-full aspect-square items-center justify-center rounded-sm text-xl font-semibold transition-[background-color]',
        isFlipped ? 'bg-amber-300 text-amber-950' : 'bg-stone-700 text-stone-100',
        'border-[0.6vmin]',
        highlighted ? 'border-white' : 'border-transparent',
        className
      )}
      initial={{ x: 100, opacity: 0, rotateY: isFlipped ? 180 : 0 }}
      animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1, x: 0 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{
        rotateY: { duration: 0.2, ease: 'easeOut' },
        x: { duration: 0.15, ease: 'easeInOut', delay: animationDelay },
        opacity: { duration: 0.15, ease: 'easeInOut', delay: animationDelay },
      }}
    >
      {number}
    </motion.button>
  );
};

export default Tile;
