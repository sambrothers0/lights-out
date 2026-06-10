import React from 'react';
import { motion } from 'motion/react';

interface TileProps {
  state: boolean;
  number?: number;
  className?: string;
  highlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({ state, number, className = '', highlighted, onMouseEnter, onMouseLeave, onClick }) => {
  const stateClassName = state
    ? 'bg-amber-300 text-amber-950'
    : 'bg-stone-700 text-stone-100';

  const borderClassName = highlighted
    ? 'border-[0.6vmin] border-white'
    : 'border-[0.6vmin] border-transparent';

  return (
    <motion.button
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`flex
        w-full aspect-square items-center justify-center rounded-sm text-xl font-semibold transition-[background-color,color] ${stateClassName} ${borderClassName} ${className}`}
      initial={false}
      animate={{
        rotateY: state ? 180 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeIn',
      }}

    >
      {number}
    </motion.button>
  );
};

export default Tile;
